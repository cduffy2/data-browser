import { useState, useEffect, useRef } from 'react';
import './MessageBubble.css';
import './SimulatedCard.css';
import type { Message, ToolCall } from './ConversationContext';
import { useConversation } from './ConversationContext';
import type { SimulatedResponseCard, SegmentEntry } from './simulateResponse';

const FOLLOW_UP_PROMPTS = [
  'Narrow by sub-national area',
  'Focus on a single outcome',
  'Show most vulnerable segments',
  'Compare across countries',
];

const SIM_FOLLOW_UP_PROMPTS = [
  'Which segment has lowest ANC attendance?',
  'Show community health worker reach',
  'Compare to Kenya data',
  'Focus on urban segments only',
];

interface MessageBubbleProps {
  message: Message;
  isFirst: boolean;
}

export function MessageBubble({ message, isFirst }: MessageBubbleProps) {
  const { sendMessage, simulationMode } = useConversation();
  const [copied, setCopied] = useState(false);

  if (message.role === 'user') {
    return (
      <div className="message-bubble message-bubble--user">
        <div className="message-bubble__user-content">{message.content}</div>
      </div>
    );
  }

  // Assistant message
  const isThinking = message.isStreaming && message.content.length === 0 && (!message.toolCalls || message.toolCalls.length === 0);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="message-bubble message-bubble--assistant">
      {message.toolCalls && message.toolCalls.length > 0 && (
        <div className="message-bubble__tool-calls">
          {message.toolCalls.map(tc => (
            <ToolCallBlock key={tc.id} toolCall={tc} />
          ))}
        </div>
      )}

      <div className="message-bubble__assistant-content">
        {isThinking ? (
          <div className="message-bubble__thinking">
            <span className="message-bubble__thinking-dot" />
            <span className="message-bubble__thinking-dot" />
            <span className="message-bubble__thinking-dot" />
          </div>
        ) : (
          <>
            <AssistantMarkdown content={message.content} />
            {message.isStreaming && message.content.length > 0 && (
              <span className="message-bubble__cursor" />
            )}
            {!message.isStreaming && message.simulated && (
              <SimulatedCard card={message.simulated} />
            )}
          </>
        )}
      </div>

      {!message.isStreaming && message.content.length > 0 && (
        <>
          <div className="message-bubble__toolbar">
            <button className="message-bubble__toolbar-btn" onClick={handleCopy}>
              <CopyIcon />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {isFirst && (
            <div className="message-bubble__followups">
              {(simulationMode ? SIM_FOLLOW_UP_PROMPTS : FOLLOW_UP_PROMPTS).map(prompt => (
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

function ToolCallBlock({ toolCall }: { toolCall: ToolCall }) {
  const [expanded, setExpanded] = useState(false);
  const isRunning = toolCall.status === 'running';

  return (
    <div className="tool-call-block">
      <button
        className="tool-call-block__header"
        onClick={() => !isRunning && setExpanded(prev => !prev)}
        disabled={isRunning}
      >
        <span className="tool-call-block__icon"><GearIcon /></span>
        <span className="tool-call-block__name">{toolCall.name}</span>
        <span className="tool-call-block__status">
          {isRunning ? (
            <span className="tool-call-block__spinner" />
          ) : (
            <ChevronIcon expanded={expanded} />
          )}
        </span>
      </button>

      {expanded && !isRunning && (
        <div className="tool-call-block__body">
          <div className="tool-call-block__section-label">INPUT</div>
          <pre className="tool-call-block__json">{JSON.stringify(toolCall.input, null, 2)}</pre>
          {toolCall.output !== undefined && (
            <>
              <div className="tool-call-block__section-label">OUTPUT</div>
              <pre className="tool-call-block__json">{toolCall.output}</pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function AssistantMarkdown({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      const text = line.slice(2, -2);
      elements.push(<h3 key={key++}>{text}</h3>);
      i++;
    } else if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={key++}>
          {items.map((item, j) => (
            <li key={j}>{renderInline(item)}</li>
          ))}
        </ul>
      );
    } else if (line.trim() === '') {
      i++;
    } else {
      elements.push(<p key={key++}>{renderInline(line)}</p>);
      i++;
    }
  }

  return <>{elements}</>;
}

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function GearIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.22 3.22l1.42 1.42M11.36 11.36l1.42 1.42M3.22 12.78l1.42-1.42M11.36 4.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
    >
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

// ── Simulated response card ───────────────────────────────────────────────────

const LEVEL_ORDER: Array<SegmentEntry['vulnerabilityLevel']> = ['most', 'more', 'less', 'least'];
const LEVEL_LABELS: Record<SegmentEntry['vulnerabilityLevel'], string> = {
  most: 'Most vulnerable',
  more: 'More vulnerable',
  less: 'Less vulnerable',
  least: 'Least vulnerable',
};

function SimulatedCard({ card }: { card: SimulatedResponseCard }) {
  const barRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const maxPct = Math.max(...card.segments.map(s => s.pct));

  const grouped = LEVEL_ORDER.reduce<Record<string, SegmentEntry[]>>((acc, level) => {
    const items = card.segments.filter(s => s.vulnerabilityLevel === level);
    if (items.length) acc[level] = items;
    return acc;
  }, {});

  return (
    <div className="sim-card" ref={barRef}>
      <div className="sim-card__header-chip">{card.studyHeader}</div>
      <p className="sim-card__intro">{card.intro}</p>
      <div className="sim-card__segments">
        {(Object.entries(grouped) as [SegmentEntry['vulnerabilityLevel'], SegmentEntry[]][]).map(([level, segments]) => (
          <div key={level} className="sim-card__level-group">
            <span className={`sim-card__level-label sim-card__level-label--${level}`}>
              {LEVEL_LABELS[level]}
            </span>
            {segments.map(seg => (
              <div key={seg.code} className="sim-card__segment-row">
                <span className={`sim-card__segment-code sim-card__segment-code--${seg.vulnerabilityLevel}`}>
                  {seg.code}
                </span>
                <span className="sim-card__segment-label">{seg.label}</span>
                <div className="sim-card__segment-bar-wrap">
                  <div
                    className={`sim-card__segment-bar sim-card__segment-bar--${seg.vulnerabilityLevel}`}
                    style={{ width: mounted ? `${(seg.pct / maxPct) * 100}%` : '0%' }}
                  />
                </div>
                <span className="sim-card__segment-pct">{seg.pct}%</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="sim-card__callout">
        <p className="sim-card__callout-heading">💡 {card.callout.heading}</p>
        <p className="sim-card__callout-body">{card.callout.body}</p>
      </div>
    </div>
  );
}
