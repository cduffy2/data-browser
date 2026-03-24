import { useState, useRef, useEffect } from 'react';
import './ChatSidebar.css';
import { useConversation } from './ConversationContext';
import PathwaysLogo from '../../assets/pathways-logo.svg?react';
import { llmProviders } from './llmProviders';

export function ChatSidebar() {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    createConversation,
    deleteConversation,
    renameConversation,
    disconnectMCP,
    mcpConnection,
  } = useConversation();

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renamingId) renameInputRef.current?.focus();
  }, [renamingId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = () => setOpenMenuId(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const handleNewConversation = () => {
    createConversation();
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  const handleMenuClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenMenuId(prev => prev === id ? null : id);
  };

  const handleRename = (id: string, currentTitle: string) => {
    setOpenMenuId(null);
    setRenamingId(id);
    setRenameValue(currentTitle);
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      renameConversation(id, renameValue.trim() || 'Untitled');
      setRenamingId(null);
    } else if (e.key === 'Escape') {
      setRenamingId(null);
    }
  };

  const handleDelete = (id: string) => {
    setOpenMenuId(null);
    deleteConversation(id);
  };

  const handleDisconnect = () => {
    const hasConversations = conversations.length > 0;
    if (hasConversations) {
      if (!window.confirm('Disconnecting will clear all data. Continue?')) return;
    }
    disconnectMCP();
  };

  const provider = llmProviders.find(p => p.id === mcpConnection.providerId);
  const model = provider?.models.find(m => m.id === mcpConnection.modelId);
  const connectedLabel = model ? `${model.label}` : '';
  const providerLabel = provider ? provider.label : '';

  return (
    <aside className="chat-sidebar">
      <div className="chat-sidebar__header">
        <div className="chat-sidebar__brand">
          <PathwaysLogo className="chat-sidebar__logo" />
        </div>
      </div>

      <div className="chat-sidebar__conversations">
        {conversations.length > 0 && (
          <div className="chat-sidebar__section-label">Recent conversations</div>
        )}
        {conversations.map(conv => (
          <div
            key={conv.id}
            className={`chat-sidebar__conv-item ${conv.id === activeConversationId ? 'chat-sidebar__conv-item--active' : ''}`}
            onClick={() => handleSelectConversation(conv.id)}
          >
            {renamingId === conv.id ? (
              <input
                ref={renameInputRef}
                className="chat-sidebar__conv-rename-input"
                value={renameValue}
                onChange={e => setRenameValue(e.target.value)}
                onKeyDown={e => handleRenameKeyDown(e, conv.id)}
                onBlur={() => setRenamingId(null)}
                onClick={e => e.stopPropagation()}
              />
            ) : (
              <button
                className="chat-sidebar__conv-title"
                onClick={() => handleSelectConversation(conv.id)}
                title={conv.title}
              >
                {conv.title}
              </button>
            )}
            <button
              className="chat-sidebar__conv-menu-btn"
              onClick={e => handleMenuClick(e, conv.id)}
              title="More options"
            >
              <DotsIcon />
            </button>
            {openMenuId === conv.id && (
              <div className="chat-sidebar__dropdown" onClick={e => e.stopPropagation()}>
                <button
                  className="chat-sidebar__dropdown-item"
                  onClick={() => handleRename(conv.id, conv.title)}
                >
                  Rename
                </button>
                <button
                  className="chat-sidebar__dropdown-item chat-sidebar__dropdown-item--danger"
                  onClick={() => handleDelete(conv.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="chat-sidebar__footer">
        <button className="chat-sidebar__new-btn" onClick={handleNewConversation}>
          <PlusIcon />
          New conversation
        </button>
      </div>
    </aside>
  );
}

function DotsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="3" r="1.2" fill="currentColor"/>
      <circle cx="7" cy="7" r="1.2" fill="currentColor"/>
      <circle cx="7" cy="11" r="1.2" fill="currentColor"/>
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
