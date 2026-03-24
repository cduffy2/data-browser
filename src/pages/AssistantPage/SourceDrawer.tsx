import { useEffect } from 'react';
import './SourceDrawer.css';
import { useConversation } from './ConversationContext';
import type { SourceData } from './simulateResponse';

export function SourceDrawer() {
  const { sourceDrawerOpen, activeSourceData, closeSourceDrawer } = useConversation();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sourceDrawerOpen) closeSourceDrawer();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [sourceDrawerOpen, closeSourceDrawer]);

  const data = activeSourceData;

  return (
    <div className="source-drawer-backdrop">
      <div className={`source-drawer ${sourceDrawerOpen ? 'source-drawer--open' : ''}`}>
        <div className="source-drawer__header">
          <h2 className="source-drawer__title">Sources</h2>
          <button className="source-drawer__close-btn" onClick={closeSourceDrawer} aria-label="Close sources">
            <CloseIcon />
          </button>
        </div>

        {data && (
          <div className="source-drawer__body">
            {/* Confidence */}
            <div className="source-drawer__confidence">
              <div className={`source-drawer__confidence-badge source-drawer__confidence-badge--${data.confidence.level}`}>
                <BarChartIcon level={data.confidence.level} />
                {data.confidence.level === 'high' ? 'High confidence' :
                 data.confidence.level === 'medium' ? 'Medium confidence' : 'Low confidence'}
              </div>
              <p className="source-drawer__confidence-explanation">{data.confidence.explanation}</p>
            </div>

            {/* Pathways sources */}
            {data.sources.pathways.length > 0 && (
              <div>
                <h3 className="source-drawer__section-title">Pathways sources</h3>
                <div className="source-drawer__source-list">
                  {data.sources.pathways.map((src, i) => (
                    <div key={i} className="source-drawer__source-item source-drawer__source-item--pathways">
                      <div className="source-drawer__source-name">{src.name}</div>
                      <div className="source-drawer__source-meta">{src.type} · {src.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* External sources */}
            {data.sources.external.length > 0 && (
              <div>
                <h3 className="source-drawer__section-title">External sources</h3>
                <div className="source-drawer__source-list">
                  {data.sources.external.map((src, i) => (
                    <div key={i} className="source-drawer__source-item source-drawer__source-item--external">
                      <div className="source-drawer__source-name">{src.name}</div>
                      <div className="source-drawer__source-meta">{src.type} · {src.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* References */}
            {data.references.length > 0 && (
              <div>
                <h3 className="source-drawer__section-title">References</h3>
                <div className="source-drawer__ref-list">
                  {data.references.map(ref => (
                    <div key={ref.id} className="source-drawer__ref-item">
                      <span className={`source-drawer__ref-id source-drawer__ref-id--${ref.type}`}>
                        {ref.id}
                      </span>
                      <div className="source-drawer__ref-content">
                        {ref.url ? (
                          <a href={ref.url} target="_blank" rel="noopener noreferrer" className="source-drawer__ref-title">
                            {ref.title}
                          </a>
                        ) : (
                          <span className="source-drawer__ref-title">{ref.title}</span>
                        )}
                        <div className="source-drawer__ref-source">{ref.source}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="source-drawer__footer">
          <p className="source-drawer__disclaimer">
            Sources are provided for reference. Always verify data with primary sources before making programme decisions.
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

function BarChartIcon({ level }: { level: SourceData['confidence']['level'] }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="8" width="3" height="5" rx="1" fill="currentColor" opacity={level !== 'low' ? '0.3' : '1'}/>
      <rect x="5.5" y="5" width="3" height="8" rx="1" fill="currentColor" opacity={level === 'high' || level === 'medium' ? '1' : '0.3'}/>
      <rect x="10" y="2" width="3" height="11" rx="1" fill="currentColor" opacity={level === 'high' ? '1' : '0.3'}/>
    </svg>
  );
}
