import { useState, useEffect, useRef } from 'react';
import './ConnectionScreen.css';
import { llmProviders } from './llmProviders';
import type { LLMProvider, LLMModel } from './llmProviders';
import { useConversation } from './ConversationContext';
import PathwaysP from '../../assets/Pathways-P.svg?react';

type Step = 1 | 2 | 3;

// Split provider label into name + company for display
function splitProviderLabel(label: string): { name: string; company: string } {
  const parts = label.split(' (');
  if (parts.length === 2) {
    return { name: parts[0], company: parts[1].replace(')', '') };
  }
  return { name: label, company: '' };
}

export function ConnectionScreen() {
  const { connectMCP, mcpConnection } = useConversation();
  const [step, setStep] = useState<Step>(1);
  const [selectedProvider, setSelectedProvider] = useState<LLMProvider | null>(null);
  const [selectedModel, setSelectedModel] = useState<LLMModel | null>(null);
  const [apiKey, setApiKey] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const isConnecting = mcpConnection.status === 'connecting';

  useEffect(() => {
    if (step === 3) inputRef.current?.focus();
  }, [step]);

  const handleSelectProvider = (provider: LLMProvider) => {
    setSelectedProvider(provider);
    setStep(2);
  };

  const handleSelectModel = (model: LLMModel) => {
    setSelectedModel(model);
    setStep(3);
  };

  const handleConnect = () => {
    if (!selectedProvider || !selectedModel || isConnecting) return;
    connectMCP({ apiKey, modelId: selectedModel.id, providerId: selectedProvider.id });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleConnect();
  };

  return (
    <div className="connection-screen">
      <div className="connection-screen__col">

        {/* Brand — icon + title */}
        <div className="connection-screen__brand">
          <PathwaysP className="connection-screen__logo" />
          <h1 className="connection-screen__title">Pathways AI Assistant</h1>
        </div>

        {/* Step 1 — Choose provider */}
        {step === 1 && (
          <div className="connection-screen__card">
            <div className="connection-screen__card-header">
              <h2 className="connection-screen__heading">Choose a provider</h2>
              <p className="connection-screen__subtext">You can a free account with any provider and buy credits later</p>
            </div>
            <div className="connection-screen__list">
              {llmProviders.map(provider => {
                const { name, company } = splitProviderLabel(provider.label);
                return (
                  <button
                    key={provider.id}
                    className="connection-screen__row"
                    onClick={() => handleSelectProvider(provider)}
                  >
                    <span className="connection-screen__row-label">
                      <span className="connection-screen__row-name">{name}</span>
                      {company && <span className="connection-screen__row-company">{company}</span>}
                    </span>
                    <ArrowRight />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2 — Choose model */}
        {step === 2 && selectedProvider && (
          <>
            <button className="connection-screen__back" onClick={() => setStep(1)}>
              <ArrowLeft />
              Back
            </button>
            <div className="connection-screen__card">
              <div className="connection-screen__card-header">
                <h2 className="connection-screen__heading">Choose a model</h2>
                <p className="connection-screen__subtext">Select the recommended model if you're not sure.</p>
              </div>
              <div className="connection-screen__list">
                {selectedProvider.models.map(model => (
                  <button
                    key={model.id}
                    className="connection-screen__row connection-screen__row--model"
                    onClick={() => handleSelectModel(model)}
                  >
                    <div className="connection-screen__model-info">
                      <div className="connection-screen__model-name">
                        <span className="connection-screen__row-name">{model.label}</span>
                        {model.isDefault && (
                          <span className="connection-screen__model-badge">Recommended</span>
                        )}
                      </div>
                      <div className="connection-screen__model-desc">{model.description}</div>
                    </div>
                    <ArrowRight />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Step 3 — API key */}
        {step === 3 && selectedProvider && selectedModel && (
          <>
            <button className="connection-screen__back" onClick={() => setStep(2)}>
              <ArrowLeft />
              Back
            </button>
            <div className="connection-screen__card">
              <div className="connection-screen__card-header">
                <h2 className="connection-screen__heading">Add your API key</h2>
                <p className="connection-screen__subtext">
                  Not sure where to find it. View <a href="#" className="connection-screen__link">our guide</a>
                </p>
              </div>
              <div className="connection-screen__field">
                <label className="connection-screen__label">API Key</label>
                <input
                  ref={inputRef}
                  type="password"
                  className="connection-screen__input"
                  placeholder={selectedProvider.keyPlaceholder}
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isConnecting}
                />
              </div>
              <button
                className="connection-screen__connect-btn"
                onClick={handleConnect}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <span className="connection-screen__spinner" />
                    Connecting…
                  </>
                ) : 'Connect'}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

function ArrowRight() {
  return (
    <svg className="connection-screen__chevron" viewBox="0 0 16 16" fill="none">
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
