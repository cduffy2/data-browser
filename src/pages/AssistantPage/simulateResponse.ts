export interface SourceReference {
  id: string;
  type: 'pathways' | 'external';
  title: string;
  source: string;
  url?: string;
}

export interface SourceData {
  sources: {
    pathways: Array<{ name: string; type: string; date: string }>;
    external: Array<{ name: string; type: string; date: string }>;
  };
  confidence: {
    level: 'high' | 'medium' | 'low';
    explanation: string;
  };
  references: SourceReference[];
  citationMap: Record<string, string>;
}

const MOCK_RESPONSE = `**Key findings**

- The Pathways segmentation methodology identifies 8 core vulnerability dimensions including household poverty, geographic isolation, and health system access. [P1]
- Data coverage spans 23 countries across Sub-Saharan Africa and South Asia. [P2]
- Subnational data is available for 14 priority countries, with the highest granularity in Nigeria, Ethiopia, and Senegal. [P3]

**Vulnerability distribution**

Across high-burden countries, compound risk is concentrated among rural women with low education and limited health system proximity. P2 DHS data confirms this pattern holds across survey cycles. [E1]

**Recommended focus areas**

For immunisation programmes targeting women with children under 5, the highest-impact segments are typically rural most-vulnerable groups with low ANC attendance and distance barriers to facility access. Cross-referencing with geographic clustering data from Pathways [P1] reveals that northern and arid regions show consistently lower coverage rates.`;

const MOCK_SOURCE_DATA: SourceData = {
  sources: {
    pathways: [
      { name: 'Pathways Segmentation Database', type: 'Database', date: '2024' },
      { name: 'Country Profiles 2024', type: 'Report', date: '2024' },
    ],
    external: [
      { name: 'DHS Programme', type: 'Survey data', date: '2022–2023' },
    ],
  },
  confidence: {
    level: 'high',
    explanation: 'Response draws directly from Pathways segmentation data with cross-validation against DHS survey cycles.',
  },
  references: [
    { id: 'P1', type: 'pathways', title: 'Pathways Segmentation Methodology', source: 'Pathways Segmentation Database', url: '#' },
    { id: 'P2', type: 'pathways', title: 'Country Coverage Overview', source: 'Country Profiles 2024', url: '#' },
    { id: 'P3', type: 'pathways', title: 'Subnational Data Availability', source: 'Country Profiles 2024', url: '#' },
    { id: 'E1', type: 'external', title: 'DHS Vulnerability Patterns', source: 'DHS Programme', url: 'https://dhsprogram.com' },
  ],
  citationMap: { P1: 'P1', P2: 'P2', P3: 'P3', E1: 'E1' },
};

export function simulateAssistantResponse(
  onToken: (token: string) => void,
  onDone: (sourceData: SourceData) => void,
): () => void {
  // Tokenise by splitting on spaces but keeping newlines
  const tokens = MOCK_RESPONSE.split(/(\s+)/).filter(t => t.length > 0);
  let i = 0;
  let cancelled = false;
  const timeouts: ReturnType<typeof setTimeout>[] = [];

  let elapsed = 0;
  for (const token of tokens) {
    const delay = elapsed + Math.floor(Math.random() * 20) + 18;
    elapsed = delay;
    const t = setTimeout(() => {
      if (!cancelled) onToken(token);
    }, delay);
    timeouts.push(t);
    i++;
  }

  const doneTimeout = setTimeout(() => {
    if (!cancelled) onDone(MOCK_SOURCE_DATA);
  }, elapsed + 50);
  timeouts.push(doneTimeout);

  return () => {
    cancelled = true;
    timeouts.forEach(clearTimeout);
  };
}
