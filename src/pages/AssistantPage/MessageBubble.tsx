import { useState } from 'react';
import './MessageBubble.css';
import type { Message } from './ConversationContext';
import { useConversation } from './ConversationContext';

const FOLLOW_UP_PROMPTS = [
  'Narrow by sub-national area',
  'Focus on a single outcome',
  'Show most vulnerable segments',
  'Compare across countries',
];

interface MessageBubbleProps {
  message: Message;
  isFirst: boolean;
}

export function MessageBubble({ message, isFirst }: MessageBubbleProps) {
  const { openSourceDrawer, sendMessage } = useConversation();
  const [copied, setCopied] = useState(false);

  if (message.role === 'user') {
    return (
      <div className="message-bubble message-bubble--user">
        <div className="message-bubble__user-content">{message.content}</div>
      </div>
    );
  }

  // Assistant message
  const isThinking = message.isStreaming && message.content.length === 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="message-bubble message-bubble--assistant">
      <div className="message-bubble__assistant-content">
        {isThinking ? (
          <div className="message-bubble__thinking">
            <span className="message-bubble__thinking-dot" />
            <span className="message-bubble__thinking-dot" />
            <span className="message-bubble__thinking-dot" />
          </div>
        ) : (
          <>
            <AssistantMarkdown content={message.content} onCitationClick={() => {
              if (message.sourceData) openSourceDrawer(message.sourceData);
            }} />
            {message.isStreaming && <span className="message-bubble__cursor" />}
          </>
        )}
      </div>

      {!message.isStreaming && message.content.length > 0 && (
        <>
          <div className="message-bubble__toolbar">
            {message.sourceData && (
              <button
                className="message-bubble__toolbar-btn message-bubble__toolbar-btn--confidence"
                onClick={() => message.sourceData && openSourceDrawer(message.sourceData)}
              >
                <BarChartIcon />
                {message.sourceData.confidence.level === 'high' ? 'High confidence' :
                 message.sourceData.confidence.level === 'medium' ? 'Medium confidence' : 'Low confidence'}
              </button>
            )}
            {message.sourceData && (
              <button
                className="message-bubble__toolbar-btn"
                onClick={() => message.sourceData && openSourceDrawer(message.sourceData)}
              >
                <BookIcon />
                View sources
              </button>
            )}
            <button className="message-bubble__toolbar-btn" onClick={handleCopy}>
              <CopyIcon />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {isFirst && (
            <div className="message-bubble__followups">
              {FOLLOW_UP_PROMPTS.map(prompt => (
                <button
                  key={prompt}
                  className="message-bubble__followup-chip"
                  onClick={() => sendMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Renders assistant content as basic Markdown with citation badges
function AssistantMarkdown({ content, onCitationClick }: { content: string; onCitationClick: () => void }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      // Bold heading line
      const text = line.slice(2, -2);
      elements.push(<h3 key={key++}>{text}</h3>);
      i++;
    } else if (line.startsWith('- ')) {
      // Collect list items
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={key++}>
          {items.map((item, j) => (
            <li key={j}>{renderInline(item, onCitationClick)}</li>
          ))}
        </ul>
      );
    } else if (line.trim() === '') {
      i++;
    } else {
      elements.push(<p key={key++}>{renderInline(line, onCitationClick)}</p>);
      i++;
    }
  }

  return <>{elements}</>;
}

function renderInline(text: string, onCitationClick: () => void): React.ReactNode[] {
  // Split on citation markers like [P1], [P2], [E1]
  const parts = text.split(/(\[[PE]\d+\])/g);
  return parts.map((part, i) => {
    const citationMatch = part.match(/^\[([PE])(\d+)\]$/);
    if (citationMatch) {
      const type = citationMatch[1] === 'P' ? 'pathways' : 'external';
      return (
        <span
          key={i}
          className={`message-bubble__citation message-bubble__citation--${type}`}
          onClick={onCitationClick}
          title={type === 'pathways' ? 'Pathways source' : 'External source'}
        >
          {citationMatch[1]}{citationMatch[2]}
        </span>
      );
    }
    // Handle **bold** within text
    if (part.includes('**')) {
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
      return boldParts.map((bp, j) => {
        if (bp.startsWith('**') && bp.endsWith('**')) {
          return <strong key={`${i}-${j}`}>{bp.slice(2, -2)}</strong>;
        }
        return bp;
      });
    }
    return part;
  });
}

function BarChartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="8" width="3" height="5" rx="1" fill="currentColor"/>
      <rect x="5.5" y="5" width="3" height="8" rx="1" fill="currentColor"/>
      <rect x="10" y="2" width="3" height="11" rx="1" fill="currentColor"/>
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 2.5A1.5 1.5 0 013.5 1H12v11H3.5A1.5 1.5 0 012 10.5v-8z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <path d="M2 10.5A1.5 1.5 0 003.5 12H12" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M5 4.5h5M5 7h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="4" y="4" width="8" height="9" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M4 3V2a1 1 0 011-1h6a1 1 0 011 1v8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}
