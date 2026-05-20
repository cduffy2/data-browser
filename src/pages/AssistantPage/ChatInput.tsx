import { useState, useRef } from 'react';
import './ChatInput.css';
import { useConversation } from './ConversationContext';

export function ChatInput({ isEmpty }: { isEmpty?: boolean }) {
  const { sendMessage, isStreaming } = useConversation();
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    sendMessage(trimmed);
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`chat-input${isEmpty ? ' chat-input--centered' : ''}`}>
      <div className="chat-input__inner">
        <div className="chat-input__box">
          <textarea
            ref={textareaRef}
            className="chat-input__textarea"
            placeholder={isEmpty ? "Ask a question about the data..." : "Ask a follow-up..."}
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
        <p className="chat-input__disclaimer">
          Pathways AI is powered by <a className="chat-input__disclaimer-link" href="https://www.algolia.com/" target="_blank" rel="noreferrer">Algolia</a>. Always verify information using the linked citations.
        </p>
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
