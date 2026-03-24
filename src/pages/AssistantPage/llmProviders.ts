export interface LLMModel {
  id: string;
  label: string;
  description: string;
  isDefault?: boolean;
}

export interface LLMProvider {
  id: string;
  label: string;
  keyPlaceholder: string;
  models: LLMModel[];
}

export const llmProviders: LLMProvider[] = [
  {
    id: 'anthropic',
    label: 'Claude (Anthropic)',
    keyPlaceholder: 'sk-ant-...',
    models: [
      { id: 'claude-opus-4', label: 'Claude Opus 4', description: 'Most capable — best for complex analysis and synthesis.' },
      { id: 'claude-sonnet-4', label: 'Claude Sonnet 4', description: 'Balanced performance and speed for most queries.', isDefault: true },
      { id: 'claude-haiku-4', label: 'Claude Haiku 4', description: 'Fastest — good for straightforward data retrieval.' },
    ],
  },
  {
    id: 'openai',
    label: 'ChatGPT (OpenAI)',
    keyPlaceholder: 'sk-...',
    models: [
      { id: 'gpt-4o', label: 'GPT-4o', description: 'Strong all-round performance.', isDefault: true },
      { id: 'gpt-4o-mini', label: 'GPT-4o mini', description: 'Fast and cost-efficient for structured lookups.' },
      { id: 'o3', label: 'o3', description: 'Advanced reasoning — best for complex multi-step analysis.' },
    ],
  },
  {
    id: 'google',
    label: 'Gemini (Google)',
    keyPlaceholder: 'AIza...',
    models: [
      { id: 'gemini-2-5-pro', label: 'Gemini 2.5 Pro', description: 'Most capable model for analysis and synthesis.', isDefault: true },
      { id: 'gemini-2-5-flash', label: 'Gemini 2.5 Flash', description: 'Fast responses with strong reasoning.' },
    ],
  },
  {
    id: 'microsoft',
    label: 'Copilot (Microsoft)',
    keyPlaceholder: 'Bearer ...',
    models: [
      { id: 'copilot-gpt-4o', label: 'Copilot + GPT-4o', description: 'GPT-4o via Microsoft Copilot.', isDefault: true },
    ],
  },
];
