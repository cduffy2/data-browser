export interface SegmentEntry {
  code: string;
  label: string;
  pct: number;
  vulnerabilityLevel: 'most' | 'more' | 'less' | 'least';
}

export interface SimulatedResponseCard {
  studyHeader: string;
  intro: string;
  segments: SegmentEntry[];
  callout: {
    heading: string;
    body: string;
  };
}

const NIGERIA_MATERNAL_HEALTH_CARD: SimulatedResponseCard = {
  studyHeader: 'PATHWAYS MCP · NORTHERN NIGERIA STUDY · 3,211 WOMEN SURVEYED',
  intro: 'Based on the Northern Nigeria Pathways data (n=3,211 women surveyed), here are the segments most relevant to your maternal health campaign:',
  segments: [
    { code: 'R4',  label: 'Rural', pct: 12.6, vulnerabilityLevel: 'most' },
    { code: 'U4',  label: 'Urban', pct: 10.2, vulnerabilityLevel: 'most' },
    { code: 'R3.1', label: 'Rural', pct: 8.4,  vulnerabilityLevel: 'more' },
    { code: 'R3.2', label: 'Rural', pct: 6.1,  vulnerabilityLevel: 'more' },
    { code: 'U2',  label: 'Urban', pct: 14.3, vulnerabilityLevel: 'less' },
    { code: 'R2',  label: 'Rural', pct: 9.8,  vulnerabilityLevel: 'less' },
  ],
  callout: {
    heading: 'Priority recommendation',
    body: 'R4 and U4 segments have the highest unmet need for ANC visits and facility-based delivery. Targeting these two segments would reach 22.8% of surveyed women with the greatest impact per campaign dollar.',
  },
};

const FOLLOWUP_CARD: SimulatedResponseCard = {
  studyHeader: 'PATHWAYS MCP · NORTHERN NIGERIA STUDY · 3,211 WOMEN SURVEYED',
  intro: 'Here is a closer look at ANC attendance and community health worker reach across priority segments:',
  segments: [
    { code: 'R4',  label: 'Rural', pct: 12.6, vulnerabilityLevel: 'most' },
    { code: 'U4',  label: 'Urban', pct: 10.2, vulnerabilityLevel: 'most' },
    { code: 'R3.1', label: 'Rural', pct: 8.4,  vulnerabilityLevel: 'more' },
    { code: 'R3.2', label: 'Rural', pct: 6.1,  vulnerabilityLevel: 'more' },
  ],
  callout: {
    heading: 'ANC coverage gap',
    body: 'Only 23% of R4 women complete 4+ ANC visits. Community health worker programmes have increased first-contact rates by 18% in comparable interventions in Kano State.',
  },
};

const INTRO_TEXT = 'Let me look at the Northern Nigeria Pathways data for you...';

export function simulateAssistantResponse(
  onToken: (token: string) => void,
  onDone: (card: SimulatedResponseCard) => void,
  isFollowUp = false,
): () => void {
  const tokens = INTRO_TEXT.split(/(\s+)/).filter(t => t.length > 0);
  let cancelled = false;
  const timeouts: ReturnType<typeof setTimeout>[] = [];

  let elapsed = 0;
  for (const token of tokens) {
    const delay = elapsed + Math.floor(Math.random() * 30) + 20;
    elapsed = delay;
    const t = setTimeout(() => {
      if (!cancelled) onToken(token);
    }, delay);
    timeouts.push(t);
  }

  const card = isFollowUp ? FOLLOWUP_CARD : NIGERIA_MATERNAL_HEALTH_CARD;
  const doneTimeout = setTimeout(() => {
    if (!cancelled) onDone(card);
  }, elapsed + 300);
  timeouts.push(doneTimeout);

  return () => {
    cancelled = true;
    timeouts.forEach(clearTimeout);
  };
}
