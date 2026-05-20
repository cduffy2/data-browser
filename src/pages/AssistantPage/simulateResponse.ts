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

// ── Cards ─────────────────────────────────────────────────────────────────────

const NIGERIA_MATERNAL_HEALTH_CARD: SimulatedResponseCard = {
  studyHeader: 'PATHWAYS · NORTHERN NIGERIA STUDY · 3,211 WOMEN SURVEYED',
  intro: 'Based on the Northern Nigeria Pathways data (n=3,211 women surveyed), here are the segments most relevant to your maternal health campaign:',
  segments: [
    { code: 'R4',   label: 'Rural',  pct: 12.6, vulnerabilityLevel: 'most' },
    { code: 'U4',   label: 'Urban',  pct: 10.2, vulnerabilityLevel: 'most' },
    { code: 'R3.1', label: 'Rural',  pct: 8.4,  vulnerabilityLevel: 'more' },
    { code: 'R3.2', label: 'Rural',  pct: 6.1,  vulnerabilityLevel: 'more' },
    { code: 'U2',   label: 'Urban',  pct: 14.3, vulnerabilityLevel: 'less' },
    { code: 'R2',   label: 'Rural',  pct: 9.8,  vulnerabilityLevel: 'less' },
  ],
  callout: {
    heading: 'Priority recommendation',
    body: 'R4 and U4 segments have the highest unmet need for ANC visits and facility-based delivery. Targeting these two segments would reach 22.8% of surveyed women with the greatest impact per campaign dollar.',
  },
};

const KENYA_VACCINATION_CARD: SimulatedResponseCard = {
  studyHeader: 'PATHWAYS · KENYA STUDY · 2,847 WOMEN SURVEYED',
  intro: 'Based on the Kenya Pathways data (n=2,847 women surveyed), here are the segments with the lowest childhood vaccination coverage:',
  segments: [
    { code: 'R4',  label: 'Rural',  pct: 18.3, vulnerabilityLevel: 'most' },
    { code: 'R3',  label: 'Rural',  pct: 14.1, vulnerabilityLevel: 'more' },
    { code: 'U3',  label: 'Urban',  pct: 11.7, vulnerabilityLevel: 'more' },
    { code: 'U2',  label: 'Urban',  pct: 21.4, vulnerabilityLevel: 'less' },
    { code: 'R2',  label: 'Rural',  pct: 16.9, vulnerabilityLevel: 'less' },
    { code: 'U1',  label: 'Urban',  pct: 9.2,  vulnerabilityLevel: 'least' },
  ],
  callout: {
    heading: 'Vaccination gap',
    body: 'R4 women are 3.2× less likely to have fully vaccinated children than U1 women. Mobile outreach programmes targeting R4 and R3 in Turkana and Marsabit counties have shown a 27% uplift in coverage.',
  },
};

const SENEGAL_NUTRITION_CARD: SimulatedResponseCard = {
  studyHeader: 'PATHWAYS · SENEGAL STUDY · 1,984 WOMEN SURVEYED',
  intro: 'Based on the Senegal Pathways data (n=1,984 women surveyed), here are the segments most affected by child undernutrition:',
  segments: [
    { code: 'R4',  label: 'Rural',  pct: 22.1, vulnerabilityLevel: 'most' },
    { code: 'R3',  label: 'Rural',  pct: 15.8, vulnerabilityLevel: 'more' },
    { code: 'U3',  label: 'Urban',  pct: 9.4,  vulnerabilityLevel: 'more' },
    { code: 'R2',  label: 'Rural',  pct: 11.2, vulnerabilityLevel: 'less' },
    { code: 'U1',  label: 'Urban',  pct: 6.7,  vulnerabilityLevel: 'least' },
  ],
  callout: {
    heading: 'Stunting prevalence',
    body: 'Stunting rates among R4 children (under 5) reach 38% in the Kolda and Sédhiou regions. Community-based nutrition programmes pairing CHWs with conditional cash transfers have reduced stunting by 14% in comparable Sahel contexts.',
  },
};

const ETHIOPIA_FAMILY_PLANNING_CARD: SimulatedResponseCard = {
  studyHeader: 'PATHWAYS · ETHIOPIA STUDY · 4,102 WOMEN SURVEYED',
  intro: 'Based on the Ethiopia Pathways data (n=4,102 women surveyed), here are the segments with the highest unmet need for family planning:',
  segments: [
    { code: 'R4',   label: 'Rural',  pct: 31.4, vulnerabilityLevel: 'most' },
    { code: 'R3.2', label: 'Rural',  pct: 24.7, vulnerabilityLevel: 'most' },
    { code: 'R3.1', label: 'Rural',  pct: 19.2, vulnerabilityLevel: 'more' },
    { code: 'U3',   label: 'Urban',  pct: 12.8, vulnerabilityLevel: 'more' },
    { code: 'U2',   label: 'Urban',  pct: 17.6, vulnerabilityLevel: 'less' },
    { code: 'R2',   label: 'Rural',  pct: 13.1, vulnerabilityLevel: 'less' },
    { code: 'U1',   label: 'Urban',  pct: 8.3,  vulnerabilityLevel: 'least' },
  ],
  callout: {
    heading: 'Unmet need concentration',
    body: 'R4 and R3.2 together account for 56% of total unmet need despite representing only 31% of the surveyed population. Expanding access to long-acting reversible contraceptives in Oromia and SNNPR would have the highest demographic impact.',
  },
};

const INDONESIA_ANTENATAL_CARD: SimulatedResponseCard = {
  studyHeader: 'PATHWAYS · INDONESIA STUDY · 3,560 WOMEN SURVEYED',
  intro: 'Based on the Indonesia Pathways data (n=3,560 women surveyed), here are the segments with the lowest antenatal care attendance:',
  segments: [
    { code: 'R4',  label: 'Rural',  pct: 16.8, vulnerabilityLevel: 'most' },
    { code: 'R3',  label: 'Rural',  pct: 13.5, vulnerabilityLevel: 'more' },
    { code: 'U3',  label: 'Urban',  pct: 10.1, vulnerabilityLevel: 'more' },
    { code: 'U2',  label: 'Urban',  pct: 19.4, vulnerabilityLevel: 'less' },
    { code: 'R2',  label: 'Rural',  pct: 11.7, vulnerabilityLevel: 'less' },
    { code: 'U1',  label: 'Urban',  pct: 7.8,  vulnerabilityLevel: 'least' },
  ],
  callout: {
    heading: 'ANC attendance gap',
    body: 'R4 women in Papua and West Kalimantan complete an average of 1.8 ANC visits against a target of 6. Midwife-led community outreach has improved completion rates by 34% in East Java pilot programmes.',
  },
};

const FOLLOWUP_CARD: SimulatedResponseCard = {
  studyHeader: 'PATHWAYS · NORTHERN NIGERIA STUDY · 3,211 WOMEN SURVEYED',
  intro: 'Here is a closer look at ANC attendance and community health worker reach across priority segments:',
  segments: [
    { code: 'R4',   label: 'Rural', pct: 12.6, vulnerabilityLevel: 'most' },
    { code: 'U4',   label: 'Urban', pct: 10.2, vulnerabilityLevel: 'most' },
    { code: 'R3.1', label: 'Rural', pct: 8.4,  vulnerabilityLevel: 'more' },
    { code: 'R3.2', label: 'Rural', pct: 6.1,  vulnerabilityLevel: 'more' },
  ],
  callout: {
    heading: 'ANC coverage gap',
    body: 'Only 23% of R4 women complete 4+ ANC visits. Community health worker programmes have increased first-contact rates by 18% in comparable interventions in Kano State.',
  },
};

// ── Text-only responses ───────────────────────────────────────────────────────

const TEXT_RESPONSES: { keywords: string[]; text: string }[] = [
  {
    keywords: ['what is pathways', 'about pathways', 'tell me about pathways', 'what does pathways do', 'explain pathways'],
    text: `**What is Pathways?**

Pathways is a data platform developed by PSI to help programme designers, researchers, and policymakers understand who the most vulnerable women are — and how to reach them.

It uses a segmentation methodology that groups women into distinct profiles based on their socioeconomic status, geographic location, and health-seeking behaviours. Each segment is assigned a vulnerability level (Most, More, Less, or Least vulnerable) to help prioritise limited programme resources.

**What can you do with it?**

- Explore segment profiles across six geographies: Northern Nigeria, Kenya, Senegal, Ethiopia, Indonesia, and Bihar, India
- Compare how health outcomes (ANC attendance, contraceptive use, vaccination rates) vary across segments
- Identify which segments have the highest unmet need for specific health interventions
- Build a campaign brief by asking questions in natural language

Ask me about a specific country or health topic to see the data.`,
  },
  {
    keywords: ['which countries', 'which geograph', 'what countries', 'what geograph', 'where is data', 'available countries', 'covered countries'],
    text: `**Geographies covered by Pathways**

Pathways currently has data for six geographies:

- **Northern Nigeria** — 3,211 women surveyed, focus on maternal and newborn health
- **Kenya** — 2,847 women surveyed, focus on reproductive health and vaccination
- **Senegal** — 1,984 women surveyed, focus on nutrition and family planning
- **Ethiopia** — 4,102 women surveyed, focus on family planning and antenatal care
- **Indonesia** — 3,560 women surveyed, focus on antenatal care and skilled birth attendance
- **Bihar, India** — 2,631 women surveyed, focus on maternal health and nutrition

Each study uses the same core segmentation framework, which makes cross-country comparisons possible. Ask me about a specific country or health topic to explore the data.`,
  },
  {
    keywords: ['how does segmentation work', 'what is a segment', 'how are segments defined', 'what are segments', 'segmentation methodology'],
    text: `**How Pathways segmentation works**

Pathways segments women into distinct groups using a combination of:

- **Socioeconomic status** — household wealth, education level, and asset ownership
- **Geographic setting** — rural vs. urban, and sub-national region
- **Health-seeking behaviour** — prior contact with health services, trust in formal care

Each segment is labelled with a code (e.g. R4, U3, R2) where the letter indicates rural (R) or urban (U) and the number reflects vulnerability — higher numbers mean higher vulnerability and lower health service utilisation.

Segments are then assigned one of four vulnerability levels:
- **Most vulnerable** — highest unmet need, lowest service contact
- **More vulnerable**
- **Less vulnerable**
- **Least vulnerable** — relatively better access and outcomes

This structure lets programme teams prioritise outreach and tailor messaging to the specific barriers each segment faces. Ask me about a specific segment or health outcome to see the data.`,
  },
  {
    keywords: ['how do i use', 'how to use', 'get started', 'where do i start', 'help', 'what can you do', 'what can i ask'],
    text: `**Getting started with Pathways AI**

You can ask me questions in plain English about the data. Here are some examples:

- *"Which segments have the lowest ANC attendance in Kenya?"*
- *"Show me the most vulnerable segments for family planning in Ethiopia"*
- *"What does the Nigeria data say about facility-based delivery?"*
- *"Compare urban and rural segments in Senegal"*

I'll pull the relevant segments from the Pathways dataset and show you a breakdown with vulnerability levels and population coverage.

You can also explore the data directly using the navigation on the left — the Data Browser, Segment Profiles, and Segmentations pages all give you structured views of the same underlying data.`,
  },
];

// ── Data card keyword matching ────────────────────────────────────────────────

interface CardCandidate {
  card: SimulatedResponseCard;
  introText: string;
  keywords: string[];
}

const CARD_CANDIDATES: CardCandidate[] = [
  {
    card: KENYA_VACCINATION_CARD,
    introText: 'Let me look at the Kenya Pathways data for you...',
    keywords: ['kenya', 'vaccin', 'immunis', 'immuniz', 'nairobi', 'mombasa'],
  },
  {
    card: SENEGAL_NUTRITION_CARD,
    introText: 'Let me look at the Senegal Pathways data for you...',
    keywords: ['senegal', 'nutrit', 'stunting', 'malnutrit', 'dakar'],
  },
  {
    card: ETHIOPIA_FAMILY_PLANNING_CARD,
    introText: 'Let me look at the Ethiopia Pathways data for you...',
    keywords: ['ethiopia', 'family planning', 'contracepti', 'fertility', 'addis'],
  },
  {
    card: INDONESIA_ANTENATAL_CARD,
    introText: 'Let me look at the Indonesia Pathways data for you...',
    keywords: ['indonesia', 'jakarta', 'java', 'papua', 'antenatal', 'anc'],
  },
  {
    card: NIGERIA_MATERNAL_HEALTH_CARD,
    introText: 'Let me look at the Northern Nigeria Pathways data for you...',
    keywords: ['nigeria', 'nigerian', 'kano', 'kaduna', 'maternal', 'mother', 'birth', 'deliver', 'pregnan'],
  },
];

const DATA_KEYWORDS = [
  'segment', 'vulnerable', 'vulnerability', 'data', 'survey', 'coverage',
  'campaign', 'reach', 'target', 'health', 'anc', 'antenatal', 'vaccin',
  'nutrit', 'family planning', 'contracepti', 'deliver', 'birth', 'maternal',
  'urban', 'rural', 'most vulnerable', 'worst', 'lowest', 'highest', 'show me',
  'which segment', 'what segment', 'compare',
];

function isDataQuery(query: string): boolean {
  const q = query.toLowerCase();
  return DATA_KEYWORDS.some(kw => q.includes(kw));
}

function pickCard(query: string): CardCandidate {
  const q = query.toLowerCase();
  for (const candidate of CARD_CANDIDATES) {
    if (candidate.keywords.some(kw => q.includes(kw))) return candidate;
  }
  return {
    card: NIGERIA_MATERNAL_HEALTH_CARD,
    introText: 'Let me search the Pathways data for you...',
    keywords: [],
  };
}

function pickTextResponse(query: string): string | null {
  const q = query.toLowerCase();
  for (const resp of TEXT_RESPONSES) {
    if (resp.keywords.some(kw => q.includes(kw))) return resp.text;
  }
  return null;
}

// ── Streamer ──────────────────────────────────────────────────────────────────

export function simulateAssistantResponse(
  onToken: (token: string) => void,
  onDone: (card: SimulatedResponseCard | null) => void,
  isFollowUp = false,
  query = '',
): () => void {
  let fullText: string;
  let card: SimulatedResponseCard | null = null;

  if (isFollowUp) {
    fullText = 'Here is a closer look at the data...';
    card = FOLLOWUP_CARD;
  } else {
    const textResponse = pickTextResponse(query);
    if (textResponse) {
      fullText = textResponse;
      card = null;
    } else if (isDataQuery(query)) {
      const candidate = pickCard(query);
      fullText = candidate.introText;
      card = candidate.card;
    } else {
      fullText = `I can help you explore the Pathways data across six geographies: Northern Nigeria, Kenya, Senegal, Ethiopia, Indonesia, and Bihar, India.\n\nTry asking about a specific country, health topic, or population segment — for example, "Which segments have the lowest ANC attendance in Kenya?" or "Show me family planning data for Ethiopia".`;
      card = null;
    }
  }

  const tokens = fullText.split(/(\s+)/).filter(t => t.length > 0);
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

  const doneTimeout = setTimeout(() => {
    if (!cancelled) onDone(card);
  }, elapsed + 300);
  timeouts.push(doneTimeout);

  return () => {
    cancelled = true;
    timeouts.forEach(clearTimeout);
  };
}
