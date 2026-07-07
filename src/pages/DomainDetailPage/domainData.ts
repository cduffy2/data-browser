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
  {
    id: 'social-support',
    label: 'Social support',
    description: "The size, quality and reliability of the woman's social networks and the support they provide — a critical buffer against vulnerability and a determinant of her capacity to cope with hardship.",
    headerColor: '#82701d',
    categories: [
      {
        id: 'social-capital',
        label: 'Social capital',
        description: "The size, composition and embeddedness of the woman in social networks.",
        subTabs: [
          {
            label: 'Social network',
            description: "The size, structure and the quality of the support network of the woman.",
            factors: [
              { name: 'Size of support network', description: 'The size of the network that the participant could expect support from for personal problems.', sources: ['Pathways'] },
              { name: 'Ease of accessing support — neighbours', description: 'How easily the participant feels she can mobilise support from neighbours.', sources: ['Pathways'] },
              { name: 'Ease of accessing support — friends and religious groups', description: 'How easily the participant feels she can mobilise support from friends and religious groups.', sources: ['Pathways'] },
              { name: 'Participation in savings groups', description: "Whether the woman regularly participates in a women's savings group.", sources: ['Pathways'] },
              { name: 'Presence of financial support network', description: 'Whether the participant is able to borrow money from someone when she needs it.', sources: ['Pathways'] },
              { name: 'Type of financial network', description: 'The sources from whom the participant has borrowed money.', sources: ['Pathways'] },
              { name: 'Purpose of loan', description: 'The reason behind borrowing money.', sources: ['Pathways'] },
              { name: 'Size of network supported by husband/partner', description: 'The number of people financially supported by the husband of the participant.', sources: ['Pathways'] },
              { name: 'Size of network supported by woman', description: 'The number of people financially supported by the participant.', sources: ['Pathways'] },
              { name: 'Support from natal home', description: 'Perception of ease of support from natal home.', sources: ['Pathways'] },
            ],
          },
          {
            label: 'Sense of belonging',
            description: 'The feeling of being connected and included in the community.',
            factors: [
              { name: 'Opinion being valued', description: 'How many people in the community does the participant believe value her opinion.', sources: ['Pathways'] },
              { name: 'Sense of safety', description: 'Whether the participant feels safe in the community.', sources: ['Pathways'] },
              { name: 'Sense of alienation', description: 'Whether the participant mostly or always feels like she does not belong to the community.', sources: ['Pathways'] },
            ],
          },
          {
            label: 'Availability of support',
            description: "Perception of the participant about her support network being able to provide different types of support.",
            factors: [
              { name: 'Emotional support', description: 'Whether the participant can get advice and support from someone close to her when she needs it.', sources: ['Pathways'] },
              { name: 'Health advisory support', description: 'Whether the participant can get health advice from someone when she needs it.', sources: ['Pathways'] },
              { name: 'Emergency support', description: 'Whether the participant believes people will support her in the time of an emergency.', sources: ['Pathways'] },
              { name: 'Ceremonial support', description: 'Whether the participant feels she will get the necessary support during major ceremonies like marriage, funerals, naming ceremonies etc.', sources: ['Pathways'] },
              { name: 'Childcare support', description: 'Whether the participant can ask a friend or family member to take care of a child or a family member.', sources: ['Pathways'] },
              { name: 'Instrumental support', description: 'Whether the participant can ask a family member for help with household duties.', sources: ['Pathways'] },
            ],
          },
          {
            label: 'Institutional support',
            description: 'Whether the participant and her family has access to formal support systems.',
            factors: [
              { name: 'Not covered by insurance', description: 'Whether the participant has at least one family member who is not covered by insurance.', sources: ['DHS'] },
            ],
          },
        ],
      },
      {
        id: 'quality-of-support',
        label: 'Quality of support',
        description: "The consistency, reliability, and emotional safety of the support the woman receives from family, friends, or community members.",
        subTabs: [
          {
            label: 'Trust',
            description: "The level of trust that the woman has in her support provider, understood through transparency, sense of safety, perceived integrity and certainty of support.",
            factors: [
              { name: 'Perception of transparency', description: 'Whether the participant feels that her support provider rarely or never lies to her.', sources: ['Qualitative'] },
              { name: 'Perception of sense of safety', description: 'Whether the participant feels that her support provider mostly or always makes her feel safe and rarely or never threatens to leave her.', sources: ['Qualitative'] },
              { name: 'Perception of certainty of support', description: 'Whether the participant feels that her support provider mostly or always provides her positive emotional support (appreciation, safety, gratitude and comfort).', sources: ['Qualitative'] },
            ],
          },
          {
            label: 'Emotional support',
            description: "The extent to which the woman feels emotionally supported by her support provider. Emotional support is critical to coping potential and resilience.",
            factors: [
              { name: 'Reassurance', description: 'Whether the participant feels that her support provider mostly or always supports her by reassuring her in emotionally distressing times.', sources: ['Qualitative'] },
              { name: 'Empathy', description: "Whether the participant feels that her support provider mostly or always values her feelings/pleasure and not just his own.", sources: ['Qualitative'] },
              { name: 'Affection', description: 'Whether the participant feels that her support provider mostly or always shows her affection and does things which brings her joy.', sources: ['Qualitative'] },
              { name: 'Non-judgment', description: 'Whether the participant feels that her support provider rarely or never criticizes her.', sources: ['Qualitative'] },
            ],
          },
          {
            label: 'Compatibility',
            description: 'The extent to which the woman is compatible and content in the relationship with her support provider.',
            factors: [
              { name: 'Goal alignment', description: 'Whether the participant and her support provider are aligned around their life goals.', sources: ['Qualitative'] },
              { name: 'Contentment', description: 'Whether the participant rarely or never imagines leaving her support provider.', sources: ['Qualitative'] },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'human-natural',
    label: 'Human and natural systems',
    description: "The broader environmental, infrastructural and migratory forces outside the household that shape the conditions in which a woman lives and her ability to access essential services.",
    headerColor: '#617498',
    categories: [
      {
        id: 'environment-climate',
        label: 'Environment and climate change',
        description: "Perceptions and experiences of environmental and climate-related risks, including their impact on life.",
        subTabs: [
          {
            label: 'Environment and climate change',
            description: "The woman's direct experience of and preparedness for environmental and climate risks.",
            factors: [
              { name: 'Perceived impact of environment on health', description: 'Whether the participant feels that people in her community are getting sicker because of unclean air or water.', sources: ['Qualitative'] },
              { name: 'Experience of natural disasters', description: 'Whether the participant has faced more drought or floods.', sources: ['Qualitative'] },
              { name: 'Preparedness around climate change', description: 'Whether the participant can predict when there will be rainfall.', sources: ['Qualitative'] },
              { name: 'Impact of climate change on livelihoods', description: 'Whether the participant has lost any assets due to a climate related event.', sources: ['Qualitative'] },
            ],
          },
        ],
      },
      {
        id: 'migration',
        label: 'Migration',
        description: "Temporary or permanent movement patterns of the woman or the household.",
        subTabs: [
          {
            label: 'Form of migration',
            description: 'The type of migration seen in the household including location and household members involved.',
            factors: [
              { name: 'Movement of family', description: 'Whether the family of the participant had to move to a different city or village.', sources: ['Pathways'] },
              { name: 'Migration pattern', description: 'The type of migration that the family of the participant has had (rural-rural, rural-urban, urban-rural, urban-urban).', sources: ['Pathways'] },
            ],
          },
          {
            label: 'Drivers of migration',
            description: 'The reasons influencing the decision to migrate.',
            factors: [
              { name: 'Reasons behind migration', description: 'The reason leading to the migration of the family of the participant.', sources: ['Pathways'] },
            ],
          },
          {
            label: 'Status of migration',
            description: 'Who in the household has migrated and how recently relocation has occurred.',
            factors: [
              { name: 'Time since relocation', description: 'Time since the family relocated.', sources: ['Pathways'] },
              { name: 'Permanent residence', description: 'Number of years the family has lived in the same home.', sources: ['Pathways'] },
              { name: 'Partner is a migrant worker', description: "Whether the partner of the participant has been away from home for more than a month in the past year for the purpose of work or conflict.", sources: ['Pathways'] },
              { name: 'Woman is a migrant worker', description: 'Whether the participant has been away from home for more than a month in the past year for the purpose of work or conflict.', sources: ['Pathways'] },
            ],
          },
        ],
      },
      {
        id: 'infrastructure-access',
        label: 'Infrastructure access',
        description: 'Access to basic infrastructure and services essential in the day to day life.',
        subTabs: [
          {
            label: 'Access to health facility',
            description: 'The ease with which the household can access the nearest health facility.',
            factors: [
              { name: 'Time to nearest health facility', description: 'Time to get to the nearest health facility.', sources: ['Pathways'] },
              { name: 'Mode of transportation to facility', description: 'Type of transportation the participant uses to get to the nearest health facility.', sources: ['Pathways'] },
            ],
          },
          {
            label: 'Access to sanitation',
            description: 'The availability and type of sanitation facility accessible to the household for safe and dignified sanitation practices.',
            factors: [
              { name: 'Safe and dignified sanitation', description: 'Whether the household has access to a pit or flush latrine within their home.', sources: ['DHS', 'Pathways'] },
              { name: 'Ownership of toilet', description: 'Whether the household owns pit or latrine toilets or shares it with other households.', sources: ['DHS', 'Pathways'] },
            ],
          },
          {
            label: 'Access to water',
            description: "The household's access to an improved and reliable water source within a reasonable distance and time.",
            factors: [
              { name: 'Access to safe and reliable drinking water', description: 'Whether the household has access to piped drinking water source in the dwelling or in the yard/plot.', sources: ['DHS', 'Pathways'] },
              { name: 'Time taken to collect water', description: 'The amount of time taken to collect drinking water.', sources: ['DHS', 'Pathways'] },
            ],
          },
          {
            label: 'Access to safe cooking',
            description: "Whether the household environment has access to clean fuels and appropriate cooking spaces that reduce indoor air pollution, fire risk and enable safe food preparation.",
            factors: [
              { name: 'Separate kitchen', description: 'Whether the participant has access to a separate kitchen.', sources: ['DHS', 'Pathways'] },
              { name: 'Clean cooking fuel', description: 'Whether the participant has access to clean cooking fuel.', sources: ['DHS', 'Pathways'] },
            ],
          },
          {
            label: 'Access to electricity',
            description: 'Whether the household is connected to a reliable and functional source of electricity.',
            factors: [
              { name: 'Access to electricity', description: 'Whether the household has access to electricity.', sources: ['DHS', 'Pathways'] },
              { name: 'Source of electricity', description: 'Whether the household has electricity through the national grid, solar panels, electric generator or other sources.', sources: ['DHS', 'Pathways'] },
            ],
          },
          {
            label: 'Access to insurance and housing',
            description: 'Whether the household is covered by insurance and has access to adequate housing.',
            factors: [
              { name: 'Overall insurance coverage', description: 'Percentage of family members covered by insurance.', sources: ['DHS'] },
              { name: 'Informal housing condition', description: 'Whether the household experiences informal housing conditions.', sources: ['DHS', 'Pathways'] },
              { name: 'Informal urban settlement', description: 'Whether the household lives in an urban slum or an informal urban settlement.', sources: ['DHS', 'Pathways'] },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'health-mental',
    label: 'Health mental models',
    description: "The woman's knowledge, beliefs, attitudes and behavioural patterns around health services, contraception, immunisation and risk — the mental frameworks that determine whether and how she seeks care.",
    headerColor: '#71438a',
    categories: [
      {
        id: 'contraceptive-reproductive',
        label: 'Contraceptive and reproductive behaviors',
        description: "Describes the woman's behavioral patterns and decisions around contraception and fertility management.",
        subTabs: [
          {
            label: 'Fertility and pregnancy goals',
            description: "The woman's desired reproductive outcome.",
            factors: [
              { name: 'Desire for pregnancy', description: 'Whether the participant desired her last or current pregnancy.', sources: ['Pathways'] },
              { name: 'Fertility preference', description: 'Whether the participant wants to have more children, is undecided, or does not want/cannot have more children.', sources: ['DHS', 'Pathways'] },
              { name: 'Ideal number of children', description: 'The total number of children that the participant ideally wants/wanted to have.', sources: ['DHS'] },
              { name: 'Goal alignment — children', description: 'Whether the participant and her partner are aligned on preferences for future childbearing.', sources: ['Pathways'] },
            ],
          },
          {
            label: 'Current method usage',
            description: "The woman's current contraceptive choice and usage patterns.",
            factors: [
              { name: 'Condom usage', description: 'Whether the participant has used a condom in the last sexual interaction.', sources: ['DHS'] },
              { name: 'Female vs male led methods', description: 'Whether the participant is currently using a female-led or male-led contraceptive method.', sources: ['DHS', 'Pathways'] },
              { name: 'Traditional vs modern methods', description: 'Whether the participant is currently using traditional or modern methods.', sources: ['DHS', 'Pathways'] },
              { name: 'Type of contraceptive — current', description: 'The type of contraceptives currently being used by the couple (including traditional vs modern contraceptives).', sources: ['Pathways'] },
            ],
          },
          {
            label: 'Intentions around contraceptive usage',
            description: "The woman's stated plans or readiness to use contraception in the future.",
            factors: [
              { name: 'Intention to use contraceptives', description: 'Whether the participant desires to use contraceptives to delay a pregnancy in the next year or at a later date.', sources: ['Pathways'] },
              { name: 'Intention-action gap', description: 'Whether the woman has expressed a preference to have no more children but is currently not using any modern contraceptive.', sources: ['DHS', 'Pathways'] },
              { name: 'Rejection of pregnancy', description: 'Whether the partner or any family member has got angry on her after learning of her pregnancy.', sources: ['Pathways'] },
            ],
          },
          {
            label: 'Contraceptive avoidance',
            description: 'Mental models which could lead to contraceptive avoidance.',
            factors: [
              { name: 'Impact of contraceptives', description: 'Whether the participant believes that contraceptives lead to infertility and physical symptoms.', sources: ['Qualitative'] },
              { name: 'Necessity of contraceptives', description: 'Whether the participant believes that contraceptives are not needed in marriage/committed relationship or in case of infrequent sex.', sources: ['Qualitative'] },
              { name: 'Knowledge around pregnancy', description: 'Whether the woman has knowledge around safe days and periods where pregnancy is possible.', sources: ['DHS'] },
            ],
          },
        ],
      },
      {
        id: 'parity',
        label: 'Parity',
        description: "Captures the woman's number of live births and its influence on her reproductive intentions and health decisions.",
        subTabs: [
          {
            label: 'Parity',
            description: "The woman's birth history and current number of living children.",
            factors: [
              { name: 'Live births', description: 'The total number of live births the participant has had.', sources: ['DHS', 'Pathways'] },
              { name: 'Living children', description: 'The number of living children the participant currently has.', sources: ['DHS', 'Pathways'] },
            ],
          },
        ],
      },
      {
        id: 'health-system-engagement',
        label: 'Health system engagement for RMNCH services',
        description: "Describes the woman's patterns of interaction and continuity of use with clinic-based RMNCH services.",
        subTabs: [
          {
            label: 'ANC',
            description: "The woman's engagement with antenatal care services.",
            factors: [
              { name: 'Timely ANC', description: 'Whether the participant began ANC during the first trimester.', sources: ['DHS', 'Pathways'] },
              { name: 'ANC provider', description: 'Whether the participant met formal health care practitioners or traditional practitioners for ANC.', sources: ['DHS', 'Pathways'] },
              { name: 'Maternal vaccination', description: 'Whether the participant has received tetanus toxoid during pregnancy.', sources: ['DHS', 'Pathways'] },
            ],
          },
          {
            label: 'Delivery',
            description: "The nature of attendance and support during the woman's last delivery.",
            factors: [
              { name: 'Birth attendant type', description: 'Whether the participant had assistance from a trained healthcare professional or a traditional birth attendant during her last delivery.', sources: ['DHS', 'Pathways'] },
            ],
          },
          {
            label: 'PNC',
            description: "The woman's and child's engagement with postnatal care services.",
            factors: [
              { name: 'Timing of PNC — woman', description: 'The time taken from delivery to PNC for the woman.', sources: ['DHS', 'Pathways'] },
              { name: 'Service provider for PNC — woman', description: 'Whether the participant received PNC from a trained healthcare professional or a traditional birth attendant during her last delivery.', sources: ['DHS', 'Pathways'] },
              { name: 'Timing of PNC — child', description: 'The time taken from delivery to PNC for the youngest child.', sources: ['DHS', 'Pathways'] },
              { name: 'Service provider for PNC — child', description: 'Whether the youngest child of the participant received PNC from a trained healthcare professional or a traditional birth attendant.', sources: ['DHS', 'Pathways'] },
            ],
          },
          {
            label: 'Child illness and birth registration',
            description: "The woman's engagement with child illness treatment and birth registration services.",
            factors: [
              { name: 'Diarrhea treatment', description: 'Whether the participant has a child who has had diarrhea in the past 2 weeks and has had treatment.', sources: ['DHS'] },
              { name: 'Knowledge of birth registration', description: 'Whether the participant has knowledge on registering a birth.', sources: ['DHS'] },
              { name: 'Ever registered birth', description: 'Whether the participant has ever registered a birth.', sources: ['DHS'] },
            ],
          },
        ],
      },
      {
        id: 'immunisation',
        label: 'Immunisation',
        description: "Reflects the woman's attitudes, knowledge, and practices regarding vaccination for her children.",
        subTabs: [
          {
            label: 'Immunisation knowledge and beliefs',
            description: "The woman's understanding of vaccines and the immunisation system.",
            factors: [
              { name: 'Vaccination card', description: 'Whether the participant has a vaccination card for the youngest child.', sources: ['DHS', 'Pathways'] },
              { name: 'Beliefs around immunisation', description: 'Whether the participant believes that vaccination is important for their child.', sources: ['DHS', 'Pathways'] },
              { name: 'Knowledge of immunisation source', description: 'Whether the participant knows where to get vaccines for their child.', sources: ['DHS', 'Pathways'] },
            ],
          },
          {
            label: 'Motivation for immunisation',
            description: "The woman's readiness to vaccinate a child, shaped by intentions, expectations and barriers.",
            factors: [
              { name: 'Expectation to immunise', description: 'Whether the participant believes that her friends and family want her to vaccinate her child.', sources: ['DHS', 'Pathways'] },
              { name: 'Intention to immunise', description: 'Whether the participant plans to administer all listed vaccines to their child.', sources: ['DHS', 'Pathways'] },
              { name: 'Barrier to immunisation — cost', description: 'Whether cost is a major barrier for vaccination.', sources: ['DHS', 'Pathways'] },
            ],
          },
        ],
      },
      {
        id: 'preferred-site-healthcare',
        label: 'Preferred site for healthcare',
        description: 'The type of health facility a participant prefers to visit when seeking care.',
        subTabs: [
          {
            label: 'Preferred site for healthcare',
            description: "The woman's preferred source of care for herself and her children.",
            factors: [
              { name: 'Preferred care source — woman general', description: 'The generally preferred site of care for health issues faced by women.', sources: ['DHS', 'Pathways'] },
              { name: 'Preferred care source — child general', description: 'The generally preferred site of care for health issues faced by the children of the participant.', sources: ['DHS', 'Pathways'] },
            ],
          },
        ],
      },
      {
        id: 'healthcare-seeking-behaviour',
        label: 'Healthcare seeking behaviour',
        description: "Describes how, when, and where the woman chooses to access health services when experiencing any illness in the family or for routine visits.",
        subTabs: [
          {
            label: "Women's health",
            description: "Health seeking patterns for women concerning her own health.",
            factors: [
              { name: 'Recent illness — woman', description: 'Whether the participant faced any illness in the past 30 days.', sources: ['Pathways'] },
              { name: 'Recent illness — woman symptoms', description: 'The symptoms faced by the participant in case of an illness in the past month.', sources: ['Pathways'] },
              { name: 'Recent illness — woman careseeking', description: 'Whether the participant sought care for her illness in the past month.', sources: ['Pathways'] },
              { name: 'Recent illness — woman careseeking location', description: 'The actual point of care-seeking for the illness faced by the participant in the past month.', sources: ['Pathways'] },
            ],
          },
          {
            label: "Child's health",
            description: "Health seeking patterns for women concerning her child's health.",
            factors: [
              { name: 'Recent illness — child careseeking', description: "Whether the participant sought care for the illness of her youngest child in the past month.", sources: ['Pathways'] },
              { name: 'Recent illness — child careseeking location', description: 'The actual point of care-seeking for the illness faced by the youngest child of the participant in the past month.', sources: ['Pathways'] },
            ],
          },
          {
            label: 'Barriers to seeking care',
            description: 'System constraints experienced which prevent formal care-seeking.',
            factors: [
              { name: 'Experience of multiple barriers to care', description: 'Whether the participant experiences more than 3 barriers to care.', sources: ['DHS'] },
              { name: 'Distance as a barrier', description: 'Whether the participant feels distance to the nearest clinic is a major barrier to seeking care.', sources: ['DHS'] },
              { name: 'Cost as a barrier', description: 'Whether the participant feels cost of treatment is a major barrier to seeking care.', sources: ['DHS'] },
              { name: 'Transportation as a barrier', description: 'Whether the participant feels arranging transportation is a major barrier to seeking care.', sources: ['DHS'] },
              { name: 'Lack of provider as a barrier', description: 'Whether the participant feels absence of providers is a major barrier to seeking care.', sources: ['DHS'] },
              { name: 'Lack of female provider as a barrier', description: 'Whether the participant feels absence of female providers is a major barrier to seeking care.', sources: ['DHS'] },
              { name: 'Medication availability as a barrier', description: 'Whether the participant feels medication availability is a major barrier to seeking care.', sources: ['DHS'] },
            ],
          },
        ],
      },
      {
        id: 'health-risk-perception',
        label: 'Health risk perception',
        description: "The participant's pattern of assessing and responding to the risk of different types of illness experienced by herself and her children.",
        subTabs: [
          {
            label: 'Health risk perception',
            description: "The woman's risk assessment patterns across different health contexts.",
            factors: [
              { name: 'Risk assessment — child illness', description: "Categorises the risk assessment pattern of the participant when it comes to child illness.", sources: ['Pathways'] },
              { name: 'Risk assessment — antenatal', description: "The risk assessment pattern of the participant when it comes to illness during pregnancy.", sources: ['Pathways'] },
              { name: 'Risk assessment — general', description: "The risk assessment pattern of the participant when it comes to general illness.", sources: ['Pathways'] },
            ],
          },
        ],
      },
      {
        id: 'perceived-preparedness',
        label: 'Perceived preparedness for health events',
        description: 'Measures psychological readiness for onset of critical life events impacting health.',
        subTabs: [
          {
            label: 'Perceived preparedness for health events',
            description: "The woman's sense of readiness for key reproductive and health milestones.",
            factors: [
              { name: 'Preparedness for menstruation', description: 'Whether the participant knew a lot around menstruation and felt comfortable and prepared when it happened.', sources: ['Pathways'] },
              { name: 'Preparedness for sexual debut', description: 'Whether the participant knew a lot around sexual debut and felt comfortable and prepared when it happened.', sources: ['Pathways'] },
              { name: 'Preparedness for pregnancy', description: 'Whether the participant knew a lot around pregnancy and felt comfortable and prepared when it happened.', sources: ['Pathways'] },
            ],
          },
        ],
      },
      {
        id: 'trust-health-providers',
        label: 'Trust on health providers',
        description: 'The extent of trust that the participant has on clinical and community-based health workers, which determines their preference for health services.',
        subTabs: [
          {
            label: 'Trust on health providers',
            description: "The woman's trust in different types of health workers.",
            factors: [
              { name: 'Trust in doctors', description: 'Whether the participant trusts doctors.', sources: ['Pathways'] },
              { name: 'Trust in CHWs', description: 'Whether the participant trusts community health workers.', sources: ['Pathways'] },
            ],
          },
        ],
      },
      {
        id: 'health-beliefs',
        label: 'Health beliefs',
        description: "Captures underlying perceptions and culturally shaped views about causes of illness, prevention, and treatment.",
        subTabs: [
          {
            label: 'Health beliefs',
            description: "The woman's culturally shaped beliefs about medicine and healthcare.",
            factors: [
              { name: 'Medication avoidance', description: 'Whether the participant believes that medicines are harmful during pregnancy.', sources: ['Qualitative'] },
              { name: 'Institutional delivery avoidance', description: 'Whether the participant believes that home deliveries are unnecessary for complications and hospital deliveries could lead to operations.', sources: ['Qualitative'] },
            ],
          },
        ],
      },
      {
        id: 'nutrition',
        label: 'Nutrition',
        description: "Reflects the woman's practices regarding nutrition for her children.",
        subTabs: [
          {
            label: 'Child feeding practices',
            description: 'Captures nutrition practices for children in the household.',
            factors: [
              { name: 'Diet diversity for child', description: 'Whether the participant has provided a nutritious and age-appropriate diet to a child under the age of 2 on the previous day.', sources: ['DHS'] },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'household-economics',
    label: 'Household economics and living conditions',
    description: "The household's economic resources, the woman's financial agency, access to support, and time constraints that collectively shape her capacity to seek care and maintain well-being.",
    headerColor: '#b85555',
    categories: [
      {
        id: 'economic-resources-infrastructure',
        label: 'Economic resources and infrastructure',
        description: "The household's sources of income, asset base, and the quality of physical living conditions that support or constrain well-being.",
        subTabs: [
          {
            label: 'Income earning roles and work quality',
            description: 'The availability and stability of income for the household.',
            factors: [
              { name: 'Number of members involved in income generation', description: 'The number of people in the family involved in income earning roles.', sources: ['DHS', 'Pathways'] },
              { name: 'Type of work / means of earning', description: 'The primary source of income for the family e.g. wages/salaries, agricultural sales, remittances, pension, government social protection etc.', sources: ['DHS', 'Pathways'] },
              { name: 'Occupation of the head of the household', description: 'The primary occupation of the head of the household.', sources: ['DHS', 'Pathways'] },
              { name: 'Women employed in the household', description: 'Whether any adult woman in the family is employed in an income earning role.', sources: ['DHS', 'Pathways'] },
            ],
          },
          {
            label: 'Partner work status',
            description: 'The availability and stability of income for the partner.',
            factors: [
              { name: 'Partner education status', description: 'The level of education of the partner of the participant.', sources: ['DHS', 'Pathways'] },
              { name: 'Partner employment status', description: 'Whether the partner of the woman is employed in an income earning role.', sources: ['DHS', 'Pathways'] },
              { name: 'Partner type of work / means of earning', description: 'Type of work the partner is engaged in: professional/managerial/clerical work, agricultural work, service related work, or manual labour.', sources: ['DHS', 'Pathways'] },
              { name: 'Stability of income source', description: 'Whether the partner is engaged in work throughout the year, seasonally, or whenever work is available.', sources: ['DHS', 'Pathways'] },
            ],
          },
          {
            label: 'Asset base',
            description: 'The nature of structural assets that the family possesses which contributes to economic stress.',
            factors: [
              { name: 'Ownership of agricultural land', description: 'Whether anyone in the household owns agricultural land.', sources: ['DHS', 'Pathways'] },
              { name: 'Ownership of residential land', description: 'Whether anyone in the household owns land for residential use.', sources: ['DHS', 'Pathways'] },
              { name: 'Livestock ownership', description: 'Whether anyone in the household owns any livestock.', sources: ['DHS', 'Pathways'] },
              { name: 'Home ownership', description: 'Whether the household owns the house they live in.', sources: ['DHS', 'Pathways'] },
              { name: 'Cell phone ownership', description: 'Whether anyone in the household owns a cellphone.', sources: ['DHS', 'Pathways'] },
              { name: 'Composite asset base', description: 'The composite asset base of the household based on a total of 13 functional items in the household.', sources: ['DHS', 'Pathways'] },
            ],
          },
          {
            label: 'Living conditions',
            description: 'The physical state and spacing availability of the household environment, as indicators of economic status.',
            factors: [
              { name: 'Unfinished walls and floor', description: 'Whether the walls and floor in the household are finished.', sources: ['DHS', 'Pathways'] },
              { name: 'Unfinished roof', description: 'Whether the roof in the house is finished.', sources: ['DHS', 'Pathways'] },
              { name: 'Rooms for sleeping', description: 'The number of rooms available to the family for sleeping.', sources: ['DHS', 'Pathways'] },
            ],
          },
        ],
      },
      {
        id: 'womens-economic-position',
        label: "Women's economic position and agency",
        description: "The woman's participation in income generation, access to financial tools, and control over economic resources.",
        subTabs: [
          {
            label: "Women's work status and financial access",
            description: 'The availability and stability of income for the woman.',
            factors: [
              { name: 'Employment status', description: 'Whether the woman is employed in an income earning role in the past week.', sources: ['DHS', 'Pathways'] },
              { name: 'Type of work / means of earning', description: 'Type of work that the woman has been engaged in the past year.', sources: ['DHS', 'Pathways'] },
              { name: 'Professional work', description: 'Whether the woman has primarily been engaged in professional work in the past year.', sources: ['DHS', 'Pathways'] },
              { name: 'Money received', description: 'Whether the woman has received support in cash or kind from any source in the past year.', sources: ['DHS', 'Pathways'] },
              { name: 'Lack of work opportunities', description: 'Whether the woman did not work in the past year due to lack of work opportunities.', sources: ['Pathways'] },
              { name: 'Health as a barrier to work', description: 'Identifies if the woman did not work in the past year due to poor health.', sources: ['Pathways'] },
            ],
          },
          {
            label: "Woman's economic agency",
            description: "The woman's access to and control over financial tools and resources.",
            factors: [
              { name: "Woman's bank account ownership", description: 'Whether the participant has a bank account, a joint account or both.', sources: ['DHS', 'Pathways'] },
              { name: 'Microfinance account ownership', description: 'Whether the participant or anyone in her family owns a savings account with a microfinance institution.', sources: ['Pathways'] },
              { name: 'Mobile banking account', description: 'Whether the participant has her own mobile account, a joint mobile account or both.', sources: ['DHS', 'Pathways'] },
              { name: 'Mobile banking usage', description: 'Whether the mobile banking account was used within the past month.', sources: ['DHS', 'Pathways'] },
              { name: 'Control over finances', description: 'Whether the woman has full control over the money she earns or receives.', sources: ['Pathways'] },
              { name: 'Access to money for self-consumption', description: 'Whether the woman has access to money to spend on herself.', sources: ['Pathways'] },
            ],
          },
        ],
      },
      {
        id: 'economic-support',
        label: 'Economic support',
        description: 'Access to sources of financial assistance, including remittances, community transfers, or institutional support.',
        subTabs: [
          {
            label: 'Economic support',
            description: 'Access to external financial assistance and community-based support mechanisms.',
            factors: [
              { name: 'Household receipt of financial assistance', description: 'Whether the household of the woman receives any kind of financial support from the government or any donor organizations.', sources: ['DHS', 'Pathways'] },
              { name: 'Participation in self-help groups', description: 'Whether the participant has attended any self-help group meetings in the past 3 months.', sources: ['DHS', 'Pathways'] },
            ],
          },
          {
            label: 'Household borrowing',
            description: 'Patterns of saving and borrowing within the household as indicators of financial distress.',
            factors: [
              { name: 'Savings behavior', description: 'Whether the household has been able to save money in the past year.', sources: ['Pathways'] },
              { name: 'Borrowing behavior', description: 'Whether the household borrowed money in the past year.', sources: ['Pathways'] },
              { name: 'Purpose of loan', description: 'The purpose of borrowing in the past year.', sources: ['Pathways'] },
              { name: 'Source of loan', description: 'The source of borrowing in the past year.', sources: ['Pathways'] },
            ],
          },
        ],
      },
      {
        id: 'economic-distress',
        label: 'Economic distress',
        description: 'Measures of financial strain or instability, including shocks, coping strategies, and unmet basic needs.',
        subTabs: [
          {
            label: 'Economic shocks and coping mechanisms',
            description: 'Household experiences of sudden financial hardship and the strategies used to cope with them.',
            factors: [
              { name: 'Experience of economic shock', description: 'Whether the household experienced any economic shock in the past year, including type of shock.', sources: ['Pathways'] },
              { name: 'Coping with economic shocks', description: 'The strategy used by the household to cope with the economic shock.', sources: ['Pathways'] },
              { name: 'Coping — children relocation', description: 'Whether children in the household were relocated to cope with the shock.', sources: ['Pathways'] },
              { name: 'Coping — additional work', description: 'Whether members in the household took up additional work to cope with the shock.', sources: ['Pathways'] },
              { name: 'Coping — child labour', description: "Whether any child in the participant's family was involved in domestic labour to cope with the shock.", sources: ['Pathways'] },
              { name: 'Coping — dowry', description: 'Whether the household married off a daughter to receive dowry to cope with the shock.', sources: ['Pathways'] },
            ],
          },
          {
            label: 'Perception of financial stress',
            description: "The participant's subjective feeling of economic strain or worry about meeting basic financial needs.",
            factors: [
              { name: 'Perception of negative economic condition', description: 'Whether the participant feels that they are able to meet needs or is facing poverty.', sources: ['Pathways'] },
              { name: 'Financial stress', description: 'How the participant feels that their financial status has changed in the past year.', sources: ['Pathways'] },
            ],
          },
          {
            label: 'Food insecurity',
            description: 'Inability of the household to consistently access sufficient, safe, and nutritious food.',
            factors: [
              { name: 'Household hunger score', description: 'Whether the household experiences hunger based on reporting that they often experienced low resources to buy food and how often family members went hungry through the day and slept hungry.', sources: ['Pathways'] },
            ],
          },
          {
            label: 'Family (structural) stressors',
            description: 'Factors determined by the family structure which contribute to economic stress.',
            factors: [
              { name: 'Family member with chronic disease/disability', description: "Whether anyone in the participant's family has a permanent disability or a chronic disease.", sources: ['Pathways'] },
              { name: 'Size of family', description: 'Identifies the number of members staying under one roof and using the same stove for cooking.', sources: ['DHS', 'Pathways'] },
            ],
          },
        ],
      },
      {
        id: 'time-poverty',
        label: 'Time poverty',
        description: 'The burden of unpaid labour and time-related constraints that limit the woman\'s ability to rest, seek care, or pursue opportunities.',
        subTabs: [
          {
            label: 'Time poverty',
            description: "Measures of the woman's control over her time across different life domains.",
            factors: [
              { name: 'Control over daily schedule', description: 'Whether the participant feels that her daily schedule is flexible.', sources: ['Pathways'] },
              { name: 'Control over paid work time', description: 'Whether the participant feels that she can change the amount of time spent on paid work.', sources: ['Pathways'] },
              { name: 'Control over private time', description: 'Whether the participant feels that she can use her private time according to her plans.', sources: ['Pathways'] },
              { name: 'Control over domestic tasks', description: 'Whether the participant feels that she can change the amount of time spent on domestic chores.', sources: ['Pathways'] },
              { name: 'Control over recreation time', description: 'Whether the participant feels that she has enough time for recreation and socializing.', sources: ['Pathways'] },
              { name: 'Not working due to domestic load', description: 'Whether the woman did not work in the past year due to multiple conflicting responsibilities.', sources: ['Pathways'] },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'household-relationships',
    label: 'Household relationships',
    description: "The composition, relational dynamics and power structures within the household that shape a woman's daily life, decision-making authority and overall well-being.",
    headerColor: '#3d806c',
    categories: [
      {
        id: 'household-structure',
        label: 'Household structure',
        description: "The composition and configuration of the household, including the woman's relational position and co-residence with kin or in-laws.",
        subTabs: [
          {
            label: 'Household composition',
            description: 'The number of members in the family in different roles and the economic, drudgery and support burden in the household.',
            factors: [
              { name: 'Number of members in the HH', description: 'The total number of members living in the household.', sources: ['DHS', 'Pathways'] },
              { name: 'Cohabiting adult(s) in household', description: 'The total number of adults staying under the same roof and using the same stove.', sources: ['DHS', 'Pathways'] },
              { name: 'Presence of close family members in the household', description: 'Whether any close family members stay in the same household.', sources: ['DHS', 'Pathways'] },
              { name: 'Presence of other close family members nearby', description: 'Whether any close family members stay in the same compound, but not the same household.', sources: ['DHS', 'Pathways'] },
              { name: 'Head of the household', description: 'The household member who is primarily responsible for supporting and maintaining the household, and making most decisions in the household.', sources: ['DHS', 'Pathways'] },
              { name: 'Sex of the head of the household', description: 'The sex of the head of the household.', sources: ['DHS', 'Pathways'] },
              { name: 'Absence of male partner', description: 'Whether the intimate partner of the woman is away from the house for more than a month in the past year.', sources: ['DHS', 'Pathways'] },
              { name: 'Number of children in household', description: 'The number of children in the household under the age of 18.', sources: ['DHS', 'Pathways'] },
              { name: 'Number of biological children in household', description: "The number of the woman's biological children living in the household.", sources: ['DHS', 'Pathways'] },
              { name: "Biological children's ages", description: 'Identifies the ages of all biological children in the household.', sources: ['DHS', 'Pathways'] },
              { name: 'Number of biological children under 5', description: "The number of the woman's biological children who are under the age of 5.", sources: ['DHS', 'Pathways'] },
              { name: 'Caregiver for non-biological children', description: 'Whether the participant is the primary care-giver to the non-biological children in the household.', sources: ['DHS', 'Pathways'] },
              { name: 'Living with a support person', description: 'Whether the participant lives with someone in the house who can support her for child care.', sources: ['DHS', 'Pathways'] },
            ],
          },
          {
            label: 'Marriage and cohabitation',
            description: 'The type of the marital union or relationship type that the woman has along with the nature of cohabitation.',
            factors: [
              { name: 'Marital status', description: 'Whether the participant is married, widowed, in a relationship, divorced/separated or never married.', sources: ['DHS', 'Pathways'] },
              { name: 'Type of marriage (legality)', description: 'The legal status of the marriage: e.g. traditional, civil and religious marriage.', sources: ['DHS', 'Pathways'] },
              { name: 'Type of marriage (monogamy/polygamy)', description: 'Whether the participant is in a monogamous or polygamous marriage or partnership.', sources: ['DHS', 'Pathways'] },
              { name: 'Wife order if applicable', description: "The number of the participant's union among co-wives.", sources: ['DHS', 'Pathways'] },
              { name: 'Number of partners of husband', description: "The number of the husband's wives/partners.", sources: ['DHS', 'Pathways'] },
              { name: 'Length of the marriage/cohabitation', description: 'The number of years that the participant has lived with her partner.', sources: ['DHS', 'Pathways'] },
              { name: 'Number of sexual partners', description: 'The number of lifetime sexual partners for the woman.', sources: ['DHS'] },
              { name: 'Prior unions', description: 'Whether the woman has had prior unions.', sources: ['DHS', 'Pathways'] },
              { name: 'Children with multiple partners', description: 'Whether the woman has had children with more than one man.', sources: ['DHS', 'Pathways'] },
              { name: 'Marriage registration', description: 'Whether the participant has registered the current marriage and has any documentation for it.', sources: ['DHS', 'Pathways'] },
            ],
          },
        ],
      },
      {
        id: 'partner-dynamics',
        label: 'Partner dynamics',
        description: "The emotional, communicative, and functional aspects of the woman's relationship with her partner, including support, trust, and compatibility.",
        subTabs: [
          {
            label: 'Trust',
            description: "The level of trust that the woman has towards her partner. Trust is understood through 4 dimensions: transparency, sense of safety, perceived sense of integrity of the partner and perceived certainty/predictability of support.",
            factors: [
              { name: 'Trust index', description: 'The extent to which the participant trusts her partner/husband.', sources: ['Pathways'] },
              { name: 'Perception of transparency', description: 'Whether the participant feels her partner is honest and truthful with her.', sources: ['Pathways'] },
              { name: 'Perception of fairness', description: 'Whether the participant feels that her partner treats her justly and fairly.', sources: ['Pathways'] },
              { name: 'Perception of certainty of support', description: 'Whether the participant feels that she can count on her partner to support her.', sources: ['Pathways'] },
              { name: 'Perception of integrity', description: 'Whether the participant feels that her partner is sincere in his promises.', sources: ['Pathways'] },
            ],
          },
          {
            label: 'Emotional support',
            description: 'The extent to which women feel that they are emotionally supported by their partner in their relationship. Emotional support is critical to coping potential and resilience. The absence of it can make women more vulnerable to negative outcomes.',
            factors: [
              { name: 'Reassurance', description: 'Whether the participant feels that her partner mostly or always supports her by reassuring her in emotionally distressing times.', sources: ['Qualitative'] },
              { name: 'Empathy', description: "Whether the participant feels that her partner mostly or always values her feelings/pleasure and not just his own.", sources: ['Qualitative'] },
              { name: 'Affection', description: 'Whether the participant feels that her partner mostly or always shows her affection and does things which brings her joy.', sources: ['Qualitative'] },
              { name: 'Non-judgment', description: 'Whether the participant feels that her partner rarely or never criticizes her.', sources: ['Qualitative'] },
            ],
          },
          {
            label: 'Compatibility',
            description: 'The extent to which the woman is compatible with her partner and content in the relationship.',
            factors: [
              { name: 'Goal alignment', description: 'Whether the participant and her partner are aligned around their life goals.', sources: ['Qualitative'] },
              { name: 'Age of partner', description: 'The age of the partner.', sources: ['DHS', 'Pathways'] },
              { name: 'Age gap between woman and partner', description: 'The age difference between the participant and her partner.', sources: ['DHS', 'Pathways'] },
              { name: 'Level of education of the partner', description: 'The level of education of the partner.', sources: ['DHS', 'Pathways'] },
            ],
          },
        ],
      },
      {
        id: 'power-dynamics',
        label: 'Power dynamics',
        description: 'Decision-making authority, control and conflict seen in an intimate partner relationship.',
        subTabs: [
          {
            label: 'Decision making power',
            description: 'The ability of the woman to be either the primary or the secondary decision maker around major decisions involving her life.',
            factors: [
              { name: 'Child health decisions', description: 'Whether the participant is the primary or joint decision maker around child health decisions.', sources: ['Pathways'] },
              { name: 'Child health finances decisions', description: 'Whether the participant is responsible for paying for child care either alone or jointly.', sources: ['Pathways'] },
              { name: "Woman's health decisions", description: "Whether the participant is able to alone or jointly make decisions around her own healthcare.", sources: ['DHS'] },
              { name: 'Own income decisions', description: 'Whether the participant is able to alone or jointly make decisions around her own income.', sources: ['DHS'] },
              { name: "Partner's income decisions", description: "Whether the participant is able to alone or jointly make decisions around her partner's income.", sources: ['DHS'] },
              { name: 'Purchase for self decisions', description: 'Whether the participant is able to alone or jointly make a decision around purchasing clothing for herself or her children without asking anyone for permission.', sources: ['Pathways'] },
              { name: 'Mobility decisions', description: 'Whether the participant is able to visit the market, her natal home and her friends without needing permission from anyone.', sources: ['DHS', 'Pathways'] },
              { name: 'Big ticket decisions', description: 'Whether the participant is the primary or joint decision maker around major family decisions like marriage or education of children.', sources: ['Pathways'] },
              { name: 'Large purchase decisions', description: 'Whether the participant is the primary or joint decision maker around large purchases made by the household.', sources: ['DHS', 'Pathways'] },
              { name: 'Family planning decisions', description: 'Whether the participant is the primary or joint decision maker around the usage of contraceptives.', sources: ['DHS', 'Pathways'] },
              { name: 'Everyday domestic decisions', description: 'Whether the participant is the primary or joint decision maker around everyday domestic decisions like cooking.', sources: ['Pathways'] },
              { name: 'Decision making on work', description: 'Whether the woman did not work in the past year due to family not allowing it.', sources: ['Pathways'] },
              { name: 'Index: Autonomous decision making', description: 'Whether the woman can take more than 3 decisions autonomously.', sources: ['DHS', 'Pathways'] },
              { name: 'Index: Involved in decision making', description: 'Whether the woman can take more than 3 decisions autonomously or jointly with others.', sources: ['DHS', 'Pathways'] },
            ],
          },
          {
            label: 'Domestic violence',
            description: "Experiences of physical, sexual, or emotional harm inflicted by the participant's partner.",
            factors: [
              { name: 'Experience of physical violence', description: 'Whether the participant has ever experienced physical violence from her partner.', sources: ['DHS', 'Pathways'] },
              { name: 'Experience of emotional violence', description: 'Whether the participant has ever experienced emotional violence from her partner.', sources: ['DHS', 'Pathways'] },
              { name: 'Experience of domestic violence during pregnancy', description: 'Whether the participant has ever experienced physical violence during her pregnancy.', sources: ['Pathways'] },
              { name: 'Justification of domestic violence', description: 'The level to which the participant justifies domestic violence in different scenarios.', sources: ['Pathways'] },
            ],
          },
          {
            label: 'Substance abuse',
            description: "Experience of substance use by the participant's partner and its impact on the family.",
            factors: [
              { name: 'Partner abuses substance', description: "Whether the woman's partner abuses any kind of substance.", sources: ['Pathways'] },
              { name: 'Impact of substance abuse', description: 'Whether the substance abuse of the partner has negatively impacted their life.', sources: ['Pathways'] },
            ],
          },
          {
            label: 'Household conflict',
            description: 'The extent and reasons behind physical and emotional conflict in the house.',
            factors: [
              { name: 'Frequency of household conflict', description: 'Whether the household sees conflicts more than 2 days in a week.', sources: ['Qualitative'] },
              { name: 'Reasons behind conflict', description: 'The reasons behind conflict in the household.', sources: ['Qualitative'] },
              { name: 'Relative earnings', description: 'Whether the woman earns more or less than the partner.', sources: ['DHS'] },
            ],
          },
        ],
      },
    ],
  },
];
