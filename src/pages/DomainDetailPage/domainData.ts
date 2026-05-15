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
            label: 'Natal family: Composition and support',
            description: "The structure and composition of the woman's natal family which impacts the way she experiences economic, instrumental, emotional, and health knowledge support in her early days.",
            factors: [
              { name: 'Birth order', description: 'The position of the participant among their siblings, in the order they were born.', sources: ['Pathways'] },
              { name: 'Number of siblings', description: 'The number of siblings the participant has.', sources: ['Pathways'] },
              { name: 'Orphan', description: 'The participant has lost both parents due to death.', sources: ['Pathways'] },
              { name: 'Death of parents', description: "Participant's age at parent death.", sources: ['Pathways'] },
              { name: 'Raised by', description: 'The person who raised the participant.', sources: ['Pathways'] },
              { name: 'Raised by single mother', description: 'The participant was primarily raised by her biological mother, without the presence of the biological father.', sources: ['Pathways'] },
              { name: 'Feeling of safety', description: 'The participant mostly or always felt safe at home during childhood.', sources: ['Pathways'] },
            ],
          },
          {
            label: 'Natal family: Economic stressors',
            description: "Material hardships experienced by the woman's natal family which have an early impact on her health.",
            factors: [
              { name: 'Missing meals as child', description: 'The participant regularly missed meals while growing up.', sources: ['Pathways'] },
              { name: 'Child labour', description: "Any child under the age of 15 in the participant's natal family had to work because of money problems.", sources: ['Pathways'] },
              { name: 'School dropout', description: 'The participant or any child in their household had to drop out of school during childhood.', sources: ['Pathways'] },
              { name: 'Relocation as a child', description: 'The participant had to relocate as a child due to money problems.', sources: ['Pathways'] },
              { name: 'Parent with chronic disease/disability', description: 'The participant had a parent who was chronically ill while growing up.', sources: ['Pathways'] },
            ],
          },
          {
            label: 'Natal family: Parental life trajectory',
            description: "The life paths and educational status of the woman's parents which shape her exposure to opportunities and support.",
            factors: [
              { name: "Father's highest education completed", description: "The highest level of education of the participant's father.", sources: ['Pathways'] },
              { name: "Mother's highest education completed", description: "The highest level of education of the participant's mother or guardian.", sources: ['Pathways'] },
              { name: "Parents' marriage type", description: 'The parents of the participant were in a polygamous marriage.', sources: ['Pathways'] },
            ],
          },
        ],
      },
      {
        id: 'exposure',
        label: 'Exposure',
        description: "The woman's interaction with education and information channels, indicating her access to knowledge and information.",
        subTabs: [
          {
            label: 'Educational exposure',
            description: 'The extent of formal schooling received by a woman.',
            factors: [
              { name: 'Education', description: "The participant's education level.", sources: ['DHS', 'Pathways'] },
            ],
          },
          {
            label: 'Media exposure',
            description: 'The weekly exposure a woman has to media of any kind.',
            factors: [
              { name: 'Media exposure — Radio, TV, Newspaper, Magazine, Internet', description: 'The frequency with which the participant listens to the radio, watches TV, reads newspapers or magazines or accesses the internet in a week.', sources: ['DHS', 'Pathways'] },
            ],
          },
          {
            label: 'Digital connectivity',
            description: "Measures a woman's access to and use of mobile technology and digital services. Multiple additional factors around digital connectivity can be found in the Pathways survey.",
            factors: [
              { name: 'Cell phone access', description: 'The participant owns a cell phone alone or has access to a phone.', sources: ['DHS', 'Pathways'] },
              { name: 'Type of phone', description: 'The type of phone that the participant has access to.', sources: ['DHS', 'Pathways'] },
              { name: 'Decision making around phone usage', description: 'The participant is involved in the decisions on phone usage.', sources: ['Pathways'] },
              { name: 'Usage for voice calls', description: 'The participant has made or received calls on this phone in the past month.', sources: ['Pathways'] },
              { name: 'Usage for internet', description: 'The participant has ever used the internet.', sources: ['Pathways'] },
              { name: 'Internet exposure', description: 'The frequency the participant uses the internet.', sources: ['DHS', 'Pathways'] },
            ],
          },
        ],
      },
      {
        id: 'demographic-factors',
        label: 'Demographic factors',
        description: 'Core identity markers such as age, marital status, religion, caste, and ethnicity that shape life stage, and lived experience.',
        subTabs: [
          {
            label: 'Demographic factors',
            description: 'Core identity markers such as age, marital status, religion, caste, and ethnicity that shape life stage, and lived experience.',
            factors: [
              { name: 'Age', description: 'The age of the participant.', sources: ['DHS', 'Pathways'] },
              { name: 'Religion', description: "The participant's religion.", sources: ['DHS', 'Pathways'] },
              { name: 'Caste', description: "The participant's caste status.", sources: ['DHS', 'Pathways'] },
              { name: 'National ID', description: 'The participant owns a national ID.', sources: ['DHS', 'Pathways'] },
              { name: 'Ethnicity', description: "The participant's ethnicity.", sources: ['DHS', 'Pathways'] },
              { name: 'Marital status', description: "The participant's relationship status.", sources: ['DHS', 'Pathways'] },
            ],
          },
        ],
      },
      {
        id: 'partnership-reproductive',
        label: 'Partnership and reproductive milestones',
        description: "The woman's relationship history and key reproductive events, such as marriage(s), sexual initiation and births across partnerships.",
        subTabs: [
          {
            label: 'Timing of milestones',
            description: "The age of the woman at various partnership and reproductive milestones in her life. The age of the woman at various milestones serves as an indication of the early onset of stressors, which adds to her vulnerability towards bad health outcomes.",
            factors: [
              { name: 'Age at first menstrual period', description: "The participant's age at the onset of menstruation.", sources: ['DHS', 'Pathways'] },
              { name: 'Age at first sex', description: "The participant's age at sexual debut.", sources: ['DHS', 'Pathways'] },
              { name: 'Age at cohabitation', description: 'The age at which the participant started living with a partner.', sources: ['DHS', 'Pathways'] },
              { name: 'Age at marriage', description: "The participant's age at marriage/cohabitation.", sources: ['DHS', 'Pathways'] },
              { name: 'Age at first pregnancy', description: "The participant's age at first pregnancy.", sources: ['DHS', 'Pathways'] },
              { name: 'Age at first child birth', description: "The participant's age at first birth.", sources: ['DHS', 'Pathways'] },
              { name: 'Time from marriage to first sex', description: 'The time between marriage/cohabiting with a partner and sexual debut.', sources: ['Pathways'] },
              { name: 'Time from marriage to first birth', description: 'The time between marriage/cohabitation to her first birth.', sources: ['Pathways'] },
            ],
          },
        ],
      },
      {
        id: 'gender-norms',
        label: 'Gender norms',
        description: 'The gendered expectations, roles and social rules the woman has internalised or experienced which are shaped by her community or natal environment.',
        subTabs: [
          {
            label: 'Internalisation of gender norms',
            description: 'Captures how a woman perceives, accepts, and aligns with prevailing gender norms, including her own attitudes and the degree of social pressure to conform.',
            factors: [
              { name: 'Descriptive gender norm score', description: 'The extent to which the participant perceives that most women in her community agree to certain gender norms.', sources: ['Pathways'] },
              { name: 'Injunctive gender norm score', description: 'The extent to which the participant perceives that her community expects or approves of her following certain gender norms.', sources: ['Pathways'] },
              { name: 'Norm alignment type', description: 'Alignment between what a woman perceives others are doing (descriptive norm) and what she perceives others expect or approve (injunctive norm) around a specific norm, to interpret the social acceptability and diffusion stage of that norm.', sources: ['Qualitative'] },
              { name: 'Agreement with gender norms', description: "The level of agreement that the participant and her partner have towards norms around gender based roles and duties.", sources: ['Qualitative'] },
              { name: 'Male child preference', description: 'The number of male children the participant desires compared to the number of female children.', sources: ['DHS', 'Pathways'] },
              { name: 'Justification of domestic violence', description: 'The level to which the participant justifies domestic violence in different scenarios.', sources: ['DHS', 'Pathways'] },
            ],
          },
          {
            label: 'Norms around marriage',
            description: 'Social expectations and cultural beliefs that shape when, how, and whom a woman is expected to marry.',
            factors: [
              { name: 'Intention to get married', description: 'Whether the participant wanted to get married at the time of her first marriage.', sources: ['Pathways'] },
              { name: 'Decision to get married', description: "Who made the decision about the participant's first marriage.", sources: ['Pathways'] },
              { name: 'Dowry status', description: 'Whether any dowry or bride price was paid in the marriage.', sources: ['Pathways'] },
              { name: 'Perception around dowry', description: 'Whether the participant feels that the dowry/bride price paid by the partner was a small, moderate or large amount.', sources: ['Pathways'] },
              { name: 'Reasons behind marriage', description: "The participant's reasons for her marriage/relationship.", sources: ['Qualitative'] },
            ],
          },
        ],
      },
      {
        id: 'mental-health',
        label: 'Mental health and well being',
        description: "The woman's psychological health and coping potential shaped by long-term stressors or past trauma.",
        subTabs: [
          {
            label: 'Mental health and well being',
            description: "The woman's psychological health and coping potential shaped by long-term stressors or past trauma.",
            factors: [
              { name: 'Psychological well being', description: "The participant's self assessment of her mental state in the past two weeks.", sources: ['Pathways'] },
              { name: 'Coping potential', description: 'Whether the participant feels that she can control what happens with her life, or feels helpless in dealing with difficulties in her life.', sources: ['Qualitative'] },
              { name: 'Coping style', description: 'Whether the participant largely has a coping style which entails confronting a hardship, avoiding a hardship or accepting a hardship.', sources: ['Qualitative'] },
            ],
          },
        ],
      },
    ],
  },
];
