export interface Factor {
  name: string;
  description: string;
  sources: string[];
}

export interface SubTab {
  label: string;
  description: string;
  factors: Factor[];
}

export interface Category {
  id: string;
  label: string;
  description: string;
  subTabs: SubTab[];
}

export interface Domain {
  id: string;
  label: string;
  description: string;
  headerColor: string;
  categories: Category[];
}

export const DOMAIN_DATA: Domain[] = [
  {
    id: 'woman-experiences',
    label: 'Woman and her past experiences',
    description: "This domain focuses on the individual's life history and personal characteristics that shape her current health behaviour and resilience. A woman's past—such as a traumatic first delivery or a lack of basic literacy—dictates her confidence and ability to navigate complex modern health systems today.",
    headerColor: '#4b78a8',
    categories: [
      {
        id: 'natal-family-history',
        label: 'Natal family history',
        description: "The woman's early family environment, including composition, support structures, distress and parental characteristics that shaped her upbringing.",
        subTabs: [
          {
            label: 'Composition and support',
            description: "The structure and composition of the woman's natal family which impacts the way she experiences economic, instrumental, emotional, and health knowledge support in her early days.",
            factors: [
              { name: 'Birth order', description: 'The position of the participant among their siblings, in the order they were born.', sources: ['DHS', 'Pathways', 'Qualitative'] },
              { name: 'Number of siblings', description: 'The number of siblings the participant has.', sources: ['DHS', 'Pathways', 'Qualitative'] },
              { name: 'Orphan', description: 'The participant has lost both parents due to death.', sources: ['DHS', 'Pathways', 'Qualitative'] },
              { name: 'Death of parents', description: "Participant's age at parent death.", sources: ['DHS', 'Pathways', 'Qualitative'] },
              { name: 'Raised by', description: 'The person who raised the participant.', sources: ['DHS', 'Pathways', 'Qualitative'] },
              { name: 'Raised by single mother', description: 'The participant was primarily raised by her biological mother, without the presence of the biological father.', sources: ['DHS', 'Pathways', 'Qualitative'] },
              { name: 'Feeling of safety', description: 'The participant mostly or always felt safe at home during childhood.', sources: ['DHS', 'Pathways', 'Qualitative'] },
            ],
          },
          {
            label: 'Economic stressors',
            description: 'Economic hardships experienced within the natal family that may have shaped the participant\'s resilience and coping strategies.',
            factors: [],
          },
          {
            label: 'Parental life trajectory',
            description: 'The life paths of the participant\'s parents, including their education, occupation, and health, which shaped the participant\'s early environment.',
            factors: [],
          },
        ],
      },
      {
        id: 'exposure',
        label: 'Exposure',
        description: 'The degree to which the woman has been exposed to information, media, and digital connectivity throughout her life.',
        subTabs: [
          {
            label: 'Media exposure',
            description: 'The extent to which the participant has access to and engages with mass media such as radio, television, and newspapers.',
            factors: [],
          },
          {
            label: 'Digital connectivity',
            description: 'The participant\'s access to and use of digital technologies including mobile phones and the internet.',
            factors: [],
          },
        ],
      },
      {
        id: 'demographic-factors',
        label: 'Demographic factors',
        description: 'Basic demographic characteristics of the woman that influence her vulnerability profile.',
        subTabs: [
          {
            label: 'Demographic factors',
            description: 'Core demographic attributes including age, education, and literacy that shape the participant\'s vulnerability.',
            factors: [],
          },
        ],
      },
      {
        id: 'partnership-reproductive',
        label: 'Partnership and reproductive milestones',
        description: 'Key life events related to partnership formation and reproductive history that define a woman\'s trajectory.',
        subTabs: [
          {
            label: 'Timing of milestones',
            description: 'The age at which key reproductive and partnership milestones occurred, including first marriage and first birth.',
            factors: [],
          },
        ],
      },
      {
        id: 'gender-norms',
        label: 'Gender norms',
        description: 'The degree to which the woman has internalised prevailing gender norms and expectations in her community.',
        subTabs: [
          {
            label: 'Internalisation of gender norms',
            description: 'The extent to which the participant has accepted and internalised societal gender norms as part of her identity.',
            factors: [],
          },
          {
            label: 'Norms around marriage',
            description: 'Community and familial expectations around marriage age, partner selection, and marital roles.',
            factors: [],
          },
        ],
      },
      {
        id: 'mental-health',
        label: 'Mental health and well being',
        description: 'The psychological wellbeing of the woman, including experiences of distress, trauma, and mental health conditions.',
        subTabs: [
          {
            label: 'Mental health and well being',
            description: 'The participant\'s overall psychological health, including experiences of depression, anxiety, and life satisfaction.',
            factors: [],
          },
        ],
      },
    ],
  },
];
