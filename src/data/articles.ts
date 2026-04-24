export interface Article {
  id: number;
  date: string;
  title: string;
  excerpt: string;
  tags: string[];
}

export const ALL_ARTICLES: Article[] = [
  {
    id: 0,
    date: '11 Mar 2024',
    title: 'What is Pathways?',
    excerpt: 'A step-by-step introduction to using Pathways for segmentation-based research and data analysis.',
    tags: ['Getting started', 'Data Browser', 'Researcher'],
  },
  {
    id: 1,
    date: '4 Mar 2024',
    title: 'Segmentation explained',
    excerpt: 'How field teams in Kenya used Pathways to design and conduct segmentation research with rural communities.',
    tags: ['Conducting segmentation based research', 'Segment profile', 'Kenya'],
  },
  {
    id: 2,
    date: '22 Feb 2024',
    title: 'How are segments created?',
    excerpt: 'A practical guide to navigating the Data Browser for nutrition indicators across geographies.',
    tags: ['Exploring data', 'Data Browser', 'Decision maker'],
  },
  {
    id: 3,
    date: '15 Feb 2024',
    title: 'Recruiting participants for segmentation studies',
    excerpt: 'Best practices for identifying and recruiting the right participants based on segment profiles.',
    tags: ['Recruiting participants', 'Segment profile', 'Researcher', 'Ethiopia'],
  },
  {
    id: 4,
    date: '8 Feb 2024',
    title: 'Prevalence mapping across Northern Nigeria',
    excerpt: 'How programme teams used the Prevalence map feature to visualise vulnerability across districts.',
    tags: ['Planning a project', 'Prevalence map', 'Decision maker', 'Northern Nigeria'],
  },
  {
    id: 5,
    date: '1 Feb 2024',
    title: 'Creating a segmentation with the Typing Tool',
    excerpt: 'A walkthrough of the Typing Tool for creating new segmentations from household survey data.',
    tags: ['Creating a segmentation', 'Typing Tool', 'Data scientist'],
  },
  {
    id: 6,
    date: '25 Jan 2024',
    title: 'Comparing segments across Indonesia and Senegal',
    excerpt: 'Cross-country analysis using the Comparison Tool to identify shared vulnerability patterns.',
    tags: ['Exploring data', 'Comparison Tool', 'Data scientist', 'Indonesia', 'Senegal'],
  },
  {
    id: 7,
    date: '18 Jan 2024',
    title: 'Planning a segmentation project from scratch',
    excerpt: 'A framework for scoping, planning and executing a segmentation project with your team.',
    tags: ['Planning a project', 'Researcher', 'Decision maker'],
  },
  {
    id: 8,
    date: '11 Jan 2024',
    title: "Data scientist's guide to the Pathways API",
    excerpt: 'Technical documentation and worked examples for integrating Pathways data into external tools.',
    tags: ['Exploring data', 'Data Browser', 'Data scientist'],
  },
  {
    id: 9,
    date: '4 Jan 2024',
    title: 'Segmentation research in Southern Nigeria',
    excerpt: 'Lessons from a 12-month segmentation study covering maternal health behaviours in Southern Nigeria.',
    tags: ['Conducting segmentation based research', 'Prevalence map', 'Researcher', 'Southern Nigeria'],
  },
  {
    id: 10,
    date: '21 Dec 2023',
    title: 'Getting started with the Segment Profile',
    excerpt: 'How to read, interpret and use segment profiles to inform programme design decisions.',
    tags: ['Getting started', 'Segment profile', 'Decision maker', 'Kenya'],
  },
  {
    id: 11,
    date: '14 Dec 2023',
    title: 'Facilitating a segmentation workshop in Ethiopia',
    excerpt: 'A facilitator\'s guide to running a segmentation workshop with government and NGO partners.',
    tags: ['Creating a segmentation', 'Typing Tool', 'Decision maker', 'Ethiopia'],
  },
];
