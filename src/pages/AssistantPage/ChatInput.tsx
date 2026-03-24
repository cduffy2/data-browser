import { useState, useRef, useEffect } from 'react';
import './ChatInput.css';
import { useConversation } from './ConversationContext';
import { llmProviders } from './llmProviders';

export function ChatInput() {
  const { sendMessage, isStreaming, mcpConnection } = useConversation();
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const provider = llmProviders.find(p => p.id === mcpConnection.providerId);
  const model = provider?.models.find(m => m.id === mcpConnection.modelId);
  const modelLabel = model ? `${model.label}` : 'GPT-5 – Latest';
  const toolCount = 15; // stub

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }, [text]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    sendMessage(trimmed);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input">
      <div className="chat-input__inner">
        <div className="chat-input__box">
          <textarea
            ref={textareaRef}
            className="chat-input__textarea"
            placeholder="Type '/' for commands"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
            rows={1}
          />
          <button
            className="chat-input__send-btn"
            onClick={handleSend}
            disabled={!text.trim() || isStreaming}
            aria-label="Send"
          >
            <SendIcon />
          </button>
        </div>
        <div className="chat-input__status">
          <div className="chat-input__mcp-indicator">
            <span className="chat-input__mcp-dot" />
            MCP connected
          </div>
          <span className="chat-input__commands">{toolCount} commands</span>
          <div className="chat-input__model-select">
            {modelLabel} ▾
          </div>
        </div>
      </div>
    </div>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 12V4M4 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
