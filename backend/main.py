import json
import os
from typing import AsyncGenerator
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
import httpx

app = FastAPI()

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:4173",
]
# Allow additional origins from environment (e.g. production frontend URL)
extra = os.environ.get("ALLOWED_ORIGINS", "")
if extra:
    ALLOWED_ORIGINS.extend(o.strip() for o in extra.split(",") if o.strip())

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


@app.get("/health")
async def health():
    return JSONResponse({"status": "ok"})

MCP_URL = "https://pathways.fastmcp.app/mcp"

SYSTEM_PROMPT = """You are the Pathways AI Assistant, a specialist in analysing health segmentation data for low and middle income countries.

You have access to the Pathways segmentation database via tools. Use them to answer questions about population segments, health outcomes, vulnerability factors, and geographic distributions.

When answering:
- Be specific and data-driven — use the tools to retrieve actual data before responding
- Reference the data you retrieved (segments, metrics, regions) concretely
- Structure responses clearly with headings and bullet points where appropriate
- Keep responses focused on what the user asked"""


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    provider_id: str
    model_id: str
    api_key: str


def sse(data: dict) -> str:
    return f"data: {json.dumps(data)}\n\n"


def parse_sse_response(text: str) -> dict:
    """Extract the JSON payload from an SSE response."""
    for line in text.splitlines():
        line = line.strip()
        if line.startswith("data:"):
            return json.loads(line[5:].strip())
    # Fallback: try parsing as plain JSON
    return json.loads(text)


async def fetch_mcp_tools() -> list[dict]:
    """Fetch tool definitions from the MCP server."""
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            MCP_URL,
            json={"jsonrpc": "2.0", "method": "tools/list", "params": {}, "id": 1},
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json, text/event-stream",
            },
        )
        resp.raise_for_status()
        payload = parse_sse_response(resp.text)
        return payload["result"]["tools"]


async def call_mcp_tool(name: str, arguments: dict) -> str:
    """Call a tool on the MCP server and return the result as a string."""
    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(
            MCP_URL,
            json={
                "jsonrpc": "2.0",
                "method": "tools/call",
                "params": {"name": name, "arguments": arguments},
                "id": 2,
            },
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json, text/event-stream",
            },
        )
        resp.raise_for_status()
        payload = parse_sse_response(resp.text)
        result = payload.get("result", {})
        content = result.get("content", [])
        if content and isinstance(content, list):
            return "\n".join(c.get("text", "") for c in content if c.get("type") == "text")
        return json.dumps(result)


def mcp_tools_to_anthropic(tools: list[dict]) -> list[dict]:
    return [
        {
            "name": t["name"],
            "description": t.get("description", ""),
            "input_schema": t.get("inputSchema", {"type": "object", "properties": {}}),
        }
        for t in tools
    ]


def mcp_tools_to_openai(tools: list[dict]) -> list[dict]:
    return [
        {
            "type": "function",
            "function": {
                "name": t["name"],
                "description": t.get("description", ""),
                "parameters": t.get("inputSchema", {"type": "object", "properties": {}}),
            },
        }
        for t in tools
    ]


async def stream_anthropic(request: ChatRequest, mcp_tools: list[dict]) -> AsyncGenerator[str, None]:
    import anthropic as anthropic_sdk

    client = anthropic_sdk.Anthropic(api_key=request.api_key)
    tools = mcp_tools_to_anthropic(mcp_tools)
    messages = [{"role": m.role, "content": m.content} for m in request.messages]

    while True:
        collected_text = ""
        tool_uses = []
        stop_reason = None

        with client.messages.stream(
            model=request.model_id,
            max_tokens=4096,
            system=SYSTEM_PROMPT,
            messages=messages,
            tools=tools,
        ) as stream:
            for event in stream:
                event_type = type(event).__name__

                if event_type == "RawContentBlockDeltaEvent":
                    delta = event.delta
                    if hasattr(delta, "text"):
                        collected_text += delta.text
                        yield sse({"type": "token", "text": delta.text})

                elif event_type == "RawContentBlockStartEvent":
                    block = event.content_block
                    if getattr(block, "type", None) == "tool_use":
                        tool_uses.append({
                            "id": block.id,
                            "name": block.name,
                            "input_json": "",
                        })

                elif event_type == "RawContentBlockStopEvent":
                    pass

                elif event_type == "RawMessageDeltaEvent":
                    if hasattr(event.delta, "stop_reason"):
                        stop_reason = event.delta.stop_reason

            # Get final message for tool use inputs
            final_msg = stream.get_final_message()

        # Collect complete tool use inputs from final message
        tool_use_blocks = [b for b in final_msg.content if b.type == "tool_use"]

        if not tool_use_blocks:
            break

        # Append assistant turn
        messages.append({"role": "assistant", "content": final_msg.content})

        tool_results = []
        for block in tool_use_blocks:
            tool_id = block.id
            tool_name = block.name
            tool_input = block.input

            yield sse({"type": "tool_start", "id": tool_id, "name": tool_name, "input": tool_input})

            try:
                output = await call_mcp_tool(tool_name, tool_input)
            except Exception as e:
                output = f"Error calling tool: {e}"

            yield sse({"type": "tool_done", "id": tool_id, "output": output})

            tool_results.append({
                "type": "tool_result",
                "tool_use_id": tool_id,
                "content": output,
            })

        messages.append({"role": "user", "content": tool_results})

        if stop_reason != "tool_use":
            break

    yield sse({"type": "done"})


async def stream_openai(request: ChatRequest, mcp_tools: list[dict]) -> AsyncGenerator[str, None]:
    import openai as openai_sdk

    # Microsoft uses OpenAI SDK with a different base URL
    if request.provider_id == "microsoft":
        client = openai_sdk.OpenAI(
            api_key=request.api_key,
            base_url="https://models.inference.ai.azure.com",
        )
    else:
        client = openai_sdk.OpenAI(api_key=request.api_key)

    tools = mcp_tools_to_openai(mcp_tools)
    messages = [{"role": "system", "content": SYSTEM_PROMPT}] + [
        {"role": m.role, "content": m.content} for m in request.messages
    ]

    while True:
        tool_calls_accumulator: dict[int, dict] = {}
        finish_reason = None
        collected_text = ""

        stream = client.chat.completions.create(
            model=request.model_id,
            messages=messages,
            tools=tools,
            stream=True,
        )

        for chunk in stream:
            choice = chunk.choices[0] if chunk.choices else None
            if not choice:
                continue

            delta = choice.delta
            finish_reason = choice.finish_reason or finish_reason

            if delta.content:
                collected_text += delta.content
                yield sse({"type": "token", "text": delta.content})

            if delta.tool_calls:
                for tc in delta.tool_calls:
                    idx = tc.index
                    if idx not in tool_calls_accumulator:
                        tool_calls_accumulator[idx] = {
                            "id": tc.id or "",
                            "name": tc.function.name if tc.function and tc.function.name else "",
                            "arguments": "",
                        }
                    if tc.id:
                        tool_calls_accumulator[idx]["id"] = tc.id
                    if tc.function:
                        if tc.function.name:
                            tool_calls_accumulator[idx]["name"] = tc.function.name
                        if tc.function.arguments:
                            tool_calls_accumulator[idx]["arguments"] += tc.function.arguments

        if finish_reason != "tool_calls" or not tool_calls_accumulator:
            break

        # Append assistant message with tool calls
        assistant_tool_calls = []
        for tc in tool_calls_accumulator.values():
            assistant_tool_calls.append({
                "id": tc["id"],
                "type": "function",
                "function": {"name": tc["name"], "arguments": tc["arguments"]},
            })
        messages.append({"role": "assistant", "content": collected_text or None, "tool_calls": assistant_tool_calls})

        tool_results = []
        for tc in tool_calls_accumulator.values():
            tool_name = tc["name"]
            try:
                tool_input = json.loads(tc["arguments"]) if tc["arguments"] else {}
            except json.JSONDecodeError:
                tool_input = {}

            yield sse({"type": "tool_start", "id": tc["id"], "name": tool_name, "input": tool_input})

            try:
                output = await call_mcp_tool(tool_name, tool_input)
            except Exception as e:
                output = f"Error calling tool: {e}"

            yield sse({"type": "tool_done", "id": tc["id"], "output": output})

            tool_results.append({
                "role": "tool",
                "tool_call_id": tc["id"],
                "content": output,
            })

        messages.extend(tool_results)

    yield sse({"type": "done"})


async def stream_google(request: ChatRequest, mcp_tools: list[dict]) -> AsyncGenerator[str, None]:
    import google.generativeai as genai
    from google.generativeai.types import FunctionDeclaration, Tool

    genai.configure(api_key=request.api_key)

    # Convert MCP tools to Google function declarations
    function_declarations = []
    for t in mcp_tools:
        schema = t.get("inputSchema", {})
        # Google requires properties to exist
        params = {
            "type": "object",
            "properties": schema.get("properties", {}),
        }
        if "required" in schema:
            params["required"] = schema["required"]
        function_declarations.append(
            FunctionDeclaration(
                name=t["name"],
                description=t.get("description", ""),
                parameters=params,
            )
        )

    google_tools = [Tool(function_declarations=function_declarations)] if function_declarations else []

    model = genai.GenerativeModel(
        model_name=request.model_id,
        system_instruction=SYSTEM_PROMPT,
        tools=google_tools,
    )

    # Convert messages to Google format
    history = []
    last_user_message = None
    for msg in request.messages:
        if msg.role == "user":
            last_user_message = msg.content
            if history or len(request.messages) > 1:
                history.append({"role": "user", "parts": [msg.content]})
        elif msg.role == "assistant":
            history.append({"role": "model", "parts": [msg.content]})

    chat = model.start_chat(history=history[:-1] if history else [])

    current_message = last_user_message or request.messages[-1].content

    while True:
        response = chat.send_message(current_message, stream=True)

        tool_calls_to_make = []
        has_text = False

        for chunk in response:
            for part in chunk.parts:
                if hasattr(part, "text") and part.text:
                    has_text = True
                    yield sse({"type": "token", "text": part.text})
                elif hasattr(part, "function_call") and part.function_call.name:
                    fc = part.function_call
                    tool_calls_to_make.append({
                        "name": fc.name,
                        "args": dict(fc.args),
                    })

        if not tool_calls_to_make:
            break

        function_responses = []
        for i, tc in enumerate(tool_calls_to_make):
            tool_id = f"google_tool_{i}"
            yield sse({"type": "tool_start", "id": tool_id, "name": tc["name"], "input": tc["args"]})

            try:
                output = await call_mcp_tool(tc["name"], tc["args"])
            except Exception as e:
                output = f"Error calling tool: {e}"

            yield sse({"type": "tool_done", "id": tool_id, "output": output})

            import google.generativeai.types as genai_types
            function_responses.append(
                genai_types.protos.Part(
                    function_response=genai_types.protos.FunctionResponse(
                        name=tc["name"],
                        response={"result": output},
                    )
                )
            )

        current_message = function_responses

    yield sse({"type": "done"})


@app.post("/chat")
async def chat(request: ChatRequest):
    async def generate():
        try:
            mcp_tools = await fetch_mcp_tools()
        except Exception as e:
            yield sse({"type": "error", "message": f"Failed to fetch MCP tools: {e}"})
            return

        try:
            if request.provider_id == "anthropic":
                async for chunk in stream_anthropic(request, mcp_tools):
                    yield chunk
            elif request.provider_id in ("openai", "microsoft"):
                async for chunk in stream_openai(request, mcp_tools):
                    yield chunk
            elif request.provider_id == "google":
                async for chunk in stream_google(request, mcp_tools):
                    yield chunk
            else:
                yield sse({"type": "error", "message": f"Unknown provider: {request.provider_id}"})
        except Exception as e:
            yield sse({"type": "error", "message": str(e)})

    return StreamingResponse(generate(), media_type="text/event-stream")
