import { useEffect, useRef } from 'react';
import './ChatArea.css';
import { useConversation } from './ConversationContext';
import { MessageBubble } from './MessageBubble';
import PathwaysP from '../../assets/Pathways-P.svg?react';

export function ChatArea() {
  const { activeConversation } = useConversation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = activeConversation?.messages ?? [];

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, messages[messages.length - 1]?.content]);

  return (
    <div className="chat-area">
      {messages.length === 0 && (
        <div className="chat-area__empty">
          <PathwaysP className="chat-area__empty-logo" />
          <h2 className="chat-area__empty-title">Pathways AI Assistant</h2>
        </div>
      )}
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
