import { useState, useRef, useEffect } from 'react';
import './ChatInput.css';
import { useConversation } from './ConversationContext';
import { llmProviders } from './llmProviders';

export function ChatInput() {
  const { sendMessage, isStreaming, mcpConnection, disconnectMCP, setModelId } = useConversation();
  const [text, setText] = useState('');
  const selectedModelId = mcpConnection.modelId;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleDisconnect = () => {
    if (window.confirm('Disconnecting will clear all data. Continue?')) {
      disconnectMCP();
    }
  };

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

  // Find current model label for display
  const allModels = llmProviders.flatMap(p => p.models.map(m => ({ ...m, providerId: p.id })));
  const currentModel = allModels.find(m => m.id === selectedModelId);
  const modelLabel = currentModel?.label ?? 'Claude Sonnet 4';

  return (
    <div className="chat-input">
      <div className="chat-input__inner">
        <div className="chat-input__box">
          <textarea
            ref={textareaRef}
            className="chat-input__textarea"
            placeholder="Ask a question about the data..."
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
          <button className="chat-input__disconnect-btn" onClick={handleDisconnect}>
            Disconnect
          </button>
          <div className="chat-input__model-wrapper">
            <select
              className="chat-input__model-select"
              value={selectedModelId}
              onChange={e => setModelId(e.target.value)}
              disabled={isStreaming}
            >
              {llmProviders.map(provider => (
                <optgroup key={provider.id} label={provider.label}>
                  {provider.models.map(model => (
                    <option key={model.id} value={model.id}>{model.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <span className="chat-input__model-label">{modelLabel} ▾</span>
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
