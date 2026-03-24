import { useState, useEffect, useRef } from 'react';
import './ChatArea.css';
import { useConversation } from './ConversationContext';
import PathwaysP from '../../assets/Pathways-P.svg?react';
import { MessageBubble } from './MessageBubble';

const GEOGRAPHIES = [
  'All geographies',
  'Bangladesh', 'Ethiopia', 'Ghana', 'India', 'Indonesia', 'Kenya', 'Malawi', 'Mali',
  'Mozambique', 'Nepal', 'Nigeria', 'Pakistan', 'Rwanda', 'Senegal', 'Tanzania', 'Uganda', 'Zambia',
];

const HEALTH_AREAS = [
  'All',
  'Maternal health', 'Newborn & child health', 'Nutrition', 'Family planning',
  'HIV/AIDS', 'Malaria', 'Tuberculosis', 'WASH', 'Mental health',
];

export function ChatArea() {
  const { activeConversation, sendMessage } = useConversation();
  const [geography, setGeography] = useState('All geographies');
  const [healthArea, setHealthArea] = useState('All');
  const [segment, setSegment] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = activeConversation?.messages ?? [];
  const scope = activeConversation?.dataScope;

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, messages[messages.length - 1]?.content]);

  const handleExplore = () => {
    const parts: string[] = [];
    if (geography !== 'All geographies') parts.push(`Country: ${geography}`);
    if (healthArea !== 'All') parts.push(`Health area: ${healthArea}`);
    if (segment.trim()) parts.push(`Population / segment: ${segment.trim()}`);
    const query = parts.length > 0
      ? `Please provide a deep dive analysis with the following scope: ${parts.join('; ')}.`
      : 'Please provide an overview of the Pathways segmentation data.';
    sendMessage(query, {
      geography: geography !== 'All geographies' ? geography : '',
      healthArea: healthArea !== 'All' ? healthArea : '',
      segment: segment.trim(),
    });
  };

  const scopeChips = scope ? [
    scope.geography,
    scope.healthArea,
    scope.segment,
    'All data',
    'Latest',
  ].filter(Boolean) : [];

  return (
    <div className="chat-area">
      {/* Scope bar — shown when conversation has scope filters */}
      {messages.length > 0 && scopeChips.length > 2 && (
        <div className="chat-area__scope-bar">
          <span className="chat-area__scope-label">Scope:</span>
          {scopeChips.map(chip => (
            <span key={chip} className="chat-area__scope-chip">{chip}</span>
          ))}
          <button className="chat-area__scope-support">
            Support ⊞
          </button>
        </div>
      )}

      {/* Empty state */}
      {messages.length === 0 && (
        <div className="chat-area__empty">
          <PathwaysP className="chat-area__empty-logo" />
          <h2 className="chat-area__empty-title">Pathways AI Assistant</h2>
          <div className="chat-area__focus-card">
            <div>
              <h3 className="chat-area__focus-heading">Set your focus</h3>
              <p className="chat-area__focus-subtext">Set filters to focus the data, or skip ahead and ask a question</p>
            </div>
            <div className="chat-area__focus-row">
              <div className="chat-area__focus-field">
                <label className="chat-area__focus-label">Geography</label>
                <select
                  className="chat-area__focus-select"
                  value={geography}
                  onChange={e => setGeography(e.target.value)}
                >
                  {GEOGRAPHIES.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div className="chat-area__focus-field">
                <label className="chat-area__focus-label">Health area</label>
                <select
                  className="chat-area__focus-select"
                  value={healthArea}
                  onChange={e => setHealthArea(e.target.value)}
                >
                  {HEALTH_AREAS.map(h => <option key={h}>{h}</option>)}
                </select>
              </div>
            </div>
            <div className="chat-area__focus-field">
              <label className="chat-area__focus-label">Target population or segment</label>
              <input
                type="text"
                className="chat-area__focus-input"
                value={segment}
                onChange={e => setSegment(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleExplore(); }}
              />
              <span className="chat-area__focus-hint">e.g. rural women 18-35, urban youth, adolescent girls...</span>
            </div>
            <button className="chat-area__focus-explore-btn" onClick={handleExplore}>
              Explore →
            </button>
          </div>
        </div>
      )}

      {/* Message list */}
      {messages.length > 0 && (
        <div className="chat-area__messages">
          {messages.map((msg) => {
            const assistantMessages = messages.filter(m => m.role === 'assistant');
            const isFirstAssistant = msg.role === 'assistant' && assistantMessages[0]?.id === msg.id;
            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                isFirst={isFirstAssistant}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
