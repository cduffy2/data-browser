import { createContext, useContext, useState, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';

export interface McpConnection {
  status: 'disconnected' | 'connecting' | 'connected';
  serverUrl: string;
  apiKey: string;
  modelId: string;
  providerId: string;
}

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
  output?: string;
  status: 'running' | 'done';
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  toolCalls?: ToolCall[];
  error?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  dataScope?: DataScope;
}

export interface DataScope {
  geography: string;
  healthArea: string;
  segment: string;
}

interface ConversationContextValue {
  mcpConnection: McpConnection;
  connectMCP: (args: { apiKey: string; modelId: string; providerId: string }) => void;
  disconnectMCP: () => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  activeConversation: Conversation | null;
  isStreaming: boolean;
  sourceDrawerOpen: boolean;
  dataScope: DataScope;
  setDataScope: (scope: Partial<DataScope>) => void;
  createConversation: () => string;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (text: string, scope?: DataScope) => void;
  stopStreaming: () => void;
  openSourceDrawer: () => void;
  closeSourceDrawer: () => void;
}

const ConversationContext = createContext<ConversationContextValue | null>(null);

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function titleFromMessage(text: string) {
  return text.split(/\s+/).slice(0, 6).join(' ');
}

export function ConversationProvider({ children }: { children: ReactNode }) {
  const [mcpConnection, setMcpConnection] = useState<McpConnection>({
    status: 'disconnected',
    serverUrl: 'https://pathways.fastmcp.app/mcp',
    apiKey: '',
    modelId: '',
    providerId: '',
  });

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sourceDrawerOpen, setSourceDrawerOpen] = useState(false);
  const [dataScope, setDataScopeState] = useState<DataScope>({
    geography: '',
    healthArea: '',
    segment: '',
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId) ?? null;

  const connectMCP = useCallback(({ apiKey, modelId, providerId }: { apiKey: string; modelId: string; providerId: string }) => {
    setMcpConnection(prev => ({ ...prev, status: 'connecting', apiKey, modelId, providerId }));
    setTimeout(() => {
      setMcpConnection(prev => ({ ...prev, status: 'connected' }));
    }, 1200);
  }, []);

  const disconnectMCP = useCallback(() => {
    abortControllerRef.current?.abort();
    setMcpConnection({
      status: 'disconnected',
      serverUrl: 'https://pathways.fastmcp.app/mcp',
      apiKey: '',
      modelId: '',
      providerId: '',
    });
    setConversations([]);
    setActiveConversationId(null);
    setSourceDrawerOpen(false);
    setIsStreaming(false);
  }, []);

  const createConversation = useCallback(() => {
    const id = generateId();
    const conv: Conversation = {
      id,
      title: 'New conversation',
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
    };
    setConversations(prev => [conv, ...prev]);
    setActiveConversationId(id);
    return id;
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    setActiveConversationId(prev => prev === id ? null : prev);
  }, []);

  const renameConversation = useCallback((id: string, title: string) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, title } : c));
  }, []);

  const setDataScope = useCallback((scope: Partial<DataScope>) => {
    setDataScopeState(prev => ({ ...prev, ...scope }));
  }, []);

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
  }, []);

  const sendMessage = useCallback((text: string, scope?: DataScope) => {
    let convId = activeConversationId;
    let existingMessages: Message[] = [];

    if (!convId) {
      convId = generateId();
      const conv: Conversation = {
        id: convId,
        title: titleFromMessage(text),
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: [],
        dataScope: scope,
      };
      setConversations(prev => [conv, ...prev]);
      setActiveConversationId(convId);
    }

    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    const assistantMsgId = generateId();
    const assistantMsg: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
      toolCalls: [],
    };

    const finalConvId = convId;

    setConversations(prev => prev.map(c => {
      if (c.id !== finalConvId) return c;
      const isFirst = c.messages.length === 0;
      existingMessages = c.messages;
      return {
        ...c,
        title: isFirst ? titleFromMessage(text) : c.title,
        updatedAt: new Date(),
        dataScope: scope ?? c.dataScope,
        messages: [...c.messages, userMsg, assistantMsg],
      };
    }));

    setIsStreaming(true);

    // Build message history for the API
    const apiMessages = [
      ...existingMessages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user' as const, content: text },
    ];

    const controller = new AbortController();
    abortControllerRef.current = controller;

    (async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL
          ? `${import.meta.env.VITE_BACKEND_URL}/chat`
          : '/api/chat';
        const response = await fetch(backendUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: apiMessages,
            provider_id: mcpConnection.providerId,
            model_id: mcpConnection.modelId,
            api_key: mcpConnection.apiKey,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const raw = line.slice(6).trim();
            if (!raw) continue;

            let event: {
              type: string;
              text?: string;
              id?: string;
              name?: string;
              input?: Record<string, unknown>;
              output?: string;
              message?: string;
            };
            try {
              event = JSON.parse(raw);
            } catch {
              continue;
            }

            if (event.type === 'token' && event.text) {
              setConversations(prev => prev.map(c => {
                if (c.id !== finalConvId) return c;
                return {
                  ...c,
                  messages: c.messages.map(m =>
                    m.id === assistantMsgId ? { ...m, content: m.content + event.text } : m
                  ),
                };
              }));
            } else if (event.type === 'tool_start' && event.id && event.name) {
              const toolCall: ToolCall = {
                id: event.id,
                name: event.name,
                input: event.input ?? {},
                status: 'running',
              };
              setConversations(prev => prev.map(c => {
                if (c.id !== finalConvId) return c;
                return {
                  ...c,
                  messages: c.messages.map(m =>
                    m.id === assistantMsgId
                      ? { ...m, toolCalls: [...(m.toolCalls ?? []), toolCall] }
                      : m
                  ),
                };
              }));
            } else if (event.type === 'tool_done' && event.id) {
              setConversations(prev => prev.map(c => {
                if (c.id !== finalConvId) return c;
                return {
                  ...c,
                  messages: c.messages.map(m =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          toolCalls: (m.toolCalls ?? []).map(tc =>
                            tc.id === event.id
                              ? { ...tc, output: event.output, status: 'done' as const }
                              : tc
                          ),
                        }
                      : m
                  ),
                };
              }));
            } else if (event.type === 'done') {
              setConversations(prev => prev.map(c => {
                if (c.id !== finalConvId) return c;
                return {
                  ...c,
                  messages: c.messages.map(m =>
                    m.id === assistantMsgId ? { ...m, isStreaming: false } : m
                  ),
                };
              }));
              setIsStreaming(false);
            } else if (event.type === 'error') {
              setConversations(prev => prev.map(c => {
                if (c.id !== finalConvId) return c;
                return {
                  ...c,
                  messages: c.messages.map(m =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          isStreaming: false,
                          error: true,
                          content: m.content || (event.message ?? 'An error occurred'),
                        }
                      : m
                  ),
                };
              }));
              setIsStreaming(false);
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setConversations(prev => prev.map(c => {
          if (c.id !== finalConvId) return c;
          return {
            ...c,
            messages: c.messages.map(m =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    isStreaming: false,
                    error: true,
                    content: m.content || 'Failed to connect to the assistant backend. Make sure it is running on port 8000.',
                  }
                : m
            ),
          };
        }));
        setIsStreaming(false);
      }
    })();
  }, [activeConversationId, mcpConnection]);

  const openSourceDrawer = useCallback(() => {
    setSourceDrawerOpen(true);
  }, []);

  const closeSourceDrawer = useCallback(() => {
    setSourceDrawerOpen(false);
  }, []);

  return (
    <ConversationContext.Provider value={{
      mcpConnection,
      connectMCP,
      disconnectMCP,
      conversations,
      activeConversationId,
      activeConversation,
      isStreaming,
      sourceDrawerOpen,
      dataScope,
      setDataScope,
      createConversation,
      deleteConversation,
      renameConversation,
      setActiveConversationId,
      sendMessage,
      stopStreaming,
      openSourceDrawer,
      closeSourceDrawer,
    }}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  const ctx = useContext(ConversationContext);
  if (!ctx) throw new Error('useConversation must be used within ConversationProvider');
  return ctx;
}
