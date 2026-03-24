import { useEffect } from 'react';
import './SourceDrawer.css';
import { useConversation } from './ConversationContext';

export function SourceDrawer() {
  const { sourceDrawerOpen, closeSourceDrawer } = useConversation();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sourceDrawerOpen) closeSourceDrawer();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [sourceDrawerOpen, closeSourceDrawer]);

  return (
    <div className="source-drawer-backdrop">
      <div className={`source-drawer ${sourceDrawerOpen ? 'source-drawer--open' : ''}`}>
        <div className="source-drawer__header">
          <h2 className="source-drawer__title">Sources</h2>
          <button className="source-drawer__close-btn" onClick={closeSourceDrawer} aria-label="Close sources">
            <CloseIcon />
          </button>
        </div>

        <div className="source-drawer__body">
          <p className="source-drawer__confidence-explanation">
            Sources used by the AI assistant will appear here once tool calls complete.
          </p>
        </div>

        <div className="source-drawer__footer">
          <p className="source-drawer__disclaimer">
            Always verify data with primary sources before making programme decisions.
          </p>
        </div>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
