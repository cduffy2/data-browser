import { useState, useRef, useEffect } from 'react';
import SearchIcon from '../../../assets/icons/Search.svg?react';
import CancelIcon from '../../../assets/icons/CancelFilled.svg?react';
import InfoIcon from '../../../assets/icons/InfoOutlined.svg?react';
import ArrowForwardIcon from '../../../assets/icons/ArrowForwardFilled.svg?react';
import './AddDataModal.css';

// ── Inline SVG icons (small, not worth separate files) ──

const CheckIcon = () => (
  <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
    <path d="M1 4.5L4.5 8L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CloseSmallIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SuggestedInfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
    <path d="M9.1665 5.83268H10.8332V7.49935H9.1665V5.83268ZM9.1665 9.16602H10.8332V14.166H9.1665V9.16602ZM9.99984 1.66602C5.39984 1.66602 1.6665 5.39935 1.6665 9.99935C1.6665 14.5993 5.39984 18.3327 9.99984 18.3327C14.5998 18.3327 18.3332 14.5993 18.3332 9.99935C18.3332 5.39935 14.5998 1.66602 9.99984 1.66602ZM9.99984 16.666C6.32484 16.666 3.33317 13.6743 3.33317 9.99935C3.33317 6.32435 6.32484 3.33268 9.99984 3.33268C13.6748 3.33268 16.6665 6.32435 16.6665 9.99935C16.6665 13.6743 13.6748 16.666 9.99984 16.666Z" fill="#2D7A00" />
  </svg>
);

const FilterListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" fill="currentColor" />
  </svg>
);

// ── Data ──

interface DataItem {
  id: string;
  label: string;
  type: 'health' | 'vulnerability';
  category: string;
  domain?: string;
  definition?: string;
  significance?: string;
  associations?: string[];
}

const HEALTH_DATA: DataItem[] = [
  { id: 'h1', label: 'Less than 4 ANC visits', type: 'health', category: 'maternal-health', definition: 'Indicates whether the participant received fewer than four antenatal care visits during pregnancy. This is below the WHO recommended minimum for adequate prenatal care.' },
  { id: 'h2', label: 'No PNC for newborn', type: 'health', category: 'child-health', definition: 'Identifies newborns who did not receive postnatal care check-ups after birth. Early postnatal visits are critical for detecting and treating complications.' },
  { id: 'h3', label: 'Never breastfed', type: 'health', category: 'child-health', definition: 'Indicates whether a child was never breastfed after birth. Breastfeeding provides essential nutrients and antibodies for infant development.' },
  { id: 'h4', label: 'Pregnancy ended in stillbirth', type: 'health', category: 'maternal-health', definition: 'Records pregnancies that resulted in stillbirth, defined as fetal death at 28 weeks or later. This indicator reflects maternal and prenatal care quality.' },
  { id: 'h5', label: 'Death of a child before 1 yr', type: 'health', category: 'child-health', definition: 'Tracks infant mortality, measuring deaths occurring in the first year of life. This is a key indicator of child health and healthcare access.' },
  { id: 'h6', label: 'Death of a child before 5 yrs', type: 'health', category: 'child-health', definition: 'Measures under-five mortality rate, tracking child deaths before the age of five. This reflects overall child health and development conditions.' },
  { id: 'h7', label: 'No current modern FP use', type: 'health', category: 'family-planning', definition: 'Indicates women not currently using modern contraceptive methods. This includes pills, IUDs, injectables, implants, and barrier methods.' },
  { id: 'h8', label: 'Latest birth delivered at home', type: 'health', category: 'maternal-health', definition: 'Identifies births that occurred at home rather than in a healthcare facility. Facility births provide access to skilled attendants and emergency care.' },
  { id: 'h9', label: 'Not fully immunized with DPT', type: 'health', category: 'immunisation', definition: 'Indicates children who did not receive the full course of diphtheria, pertussis, and tetanus vaccinations. Full immunization requires three doses.' },
  { id: 'h10', label: 'Not immunized with MMR', type: 'health', category: 'immunisation', definition: 'Identifies children who did not receive measles, mumps, and rubella vaccination. This vaccine protects against three serious infectious diseases.' },
  { id: 'h11', label: 'Not immunized with polio', type: 'health', category: 'immunisation', definition: 'Tracks children who did not receive polio vaccination. Polio immunization is critical for preventing this potentially paralyzing disease.' },
  { id: 'h12', label: 'Zero-dose child', type: 'health', category: 'immunisation', definition: 'Identifies children who have not received any routine vaccinations. These children are at highest risk and indicate gaps in healthcare access.' },
  { id: 'h13', label: 'Overweight child', type: 'health', category: 'nutrition', definition: 'Measures children with weight-for-height above two standard deviations from the median. This indicates excessive weight gain and nutritional imbalance.' },
  { id: 'h14', label: 'Stunted child', type: 'health', category: 'nutrition', definition: 'Identifies children with low height-for-age, indicating chronic malnutrition. Stunting reflects long-term insufficient nutrition and repeated infections.' },
  { id: 'h15', label: 'Underweight child', type: 'health', category: 'nutrition', definition: 'Measures children with low weight-for-age compared to reference standards. This indicates acute or chronic malnutrition affecting growth.' },
  { id: 'h16', label: 'Wasted child', type: 'health', category: 'nutrition', definition: 'Identifies children with low weight-for-height, indicating acute malnutrition. Wasting reflects recent rapid weight loss or failure to gain weight.' },
  { id: 'h17', label: 'No. of children who have died', type: 'health', category: 'child-health', definition: 'Counts the total number of children who have died in the household. This measure reflects child mortality experience at the household level.' },
  { id: 'h18', label: 'No. of children who have died (3 category)', type: 'health', category: 'child-health', definition: 'Categorizes households by number of child deaths into three groups: none, one, or two or more. This provides a grouped measure of child mortality.' },
  { id: 'h19', label: 'Death of a child', type: 'health', category: 'child-health', definition: 'Binary indicator of whether any child death has occurred in the household. This identifies families who have experienced child mortality.' },
  { id: 'h20', label: 'No PNC for mother', type: 'health', category: 'maternal-health', definition: 'Indicates mothers who did not receive postnatal care after delivery. Maternal PNC is essential for detecting and treating postpartum complications.' },
  { id: 'h21', label: 'Diarrhea 2 weeks last', type: 'health', category: 'child-health', definition: 'Percentage of children under 5 who had diarrhea in the two weeks preceding the survey.' },
  { id: 'h22', label: 'Fever 2 weeks last', type: 'health', category: 'child-health', definition: 'Percentage of children under 5 who had a fever in the two weeks preceding the survey.' },
  { id: 'h23', label: 'Low birth weight', type: 'health', category: 'child-health', definition: 'Percentage of live births in the last 2 years with a reported birth weight below 2,500 grams.' },
  { id: 'h24', label: 'No routine vaccination', type: 'health', category: 'immunisation', definition: 'Percentage of children aged 12–23 months who did not receive all basic vaccinations.' },
  { id: 'h25', label: 'Vaccination docs', type: 'health', category: 'immunisation', definition: 'Percentage of children aged 12–23 months with a vaccination card or health document seen.' },
  { id: 'h26', label: 'No ANC 1st trimester', type: 'health', category: 'maternal-health', definition: 'Percentage of women who had a live birth in the last 2 years and did not receive ANC in the first trimester.' },
  { id: 'h27', label: 'Received PNC', type: 'health', category: 'maternal-health', definition: 'Percentage of women who received postnatal care within 2 days after their most recent delivery.' },
  { id: 'h28', label: 'Not exclusively breastfed', type: 'health', category: 'nutrition', definition: 'Percentage of infants 0–5 months who are not exclusively breastfed.' },
  { id: 'h29', label: 'Not immediately breastfed', type: 'health', category: 'nutrition', definition: 'Percentage of last-born children who were not put to the breast within one hour of birth.' },
  { id: 'h30', label: 'Never tested for HIV', type: 'health', category: 'family-planning', definition: 'Percentage of women aged 15–49 who have never been tested for HIV.' },
  { id: 'h31', label: 'Never used modern FP', type: 'health', category: 'family-planning', definition: 'Percentage of women aged 15–49 in union who have never used a modern family planning method.' },
  { id: 'h32', label: 'STI last 12 months', type: 'health', category: 'family-planning', definition: 'Percentage of women aged 15–49 who self-reported a sexually transmitted infection in the past 12 months.' },
  { id: 'h33', label: 'Woman underweight', type: 'health', category: 'nutrition', definition: 'Percentage of women aged 15–49 with a body mass index (BMI) below 18.5.' },
];

const VULNERABILITY_DATA: DataItem[] = [
  { id: 'v1', label: 'Any media exposure', type: 'vulnerability', category: 'suggested', domain: 'human-natural-systems', definition: 'Indicates whether the participant has regular access to any form of media including radio, television, newspapers, or internet. Media exposure influences health knowledge and behavior.', significance: '***', associations: ['Less than 4 ANC visits', 'No PNC for newborn'] },
  { id: 'v3', label: 'Bank account (woman)', type: 'vulnerability', category: 'household-economics', domain: 'household-economics', definition: 'Indicates whether the woman has her own bank account. Financial inclusion empowers women and provides economic independence.' },
  { id: 'v4', label: 'HH clean cooking fuel', type: 'vulnerability', category: 'household-economics', domain: 'household-economics', definition: 'Identifies households using clean cooking fuels like electricity or gas rather than biomass. Clean fuel reduces indoor air pollution and respiratory health risks.' },
  { id: 'v5', label: 'HH electricity', type: 'vulnerability', category: 'household-economics', domain: 'household-economics', definition: 'Indicates whether the household has access to electricity. Electricity access enables better lighting, refrigeration, and information access.' },
  { id: 'v6', label: 'HH motor transport', type: 'vulnerability', category: 'household-economics', domain: 'household-economics', definition: 'Records ownership of motorized transportation including cars, motorcycles, or scooters. Vehicle ownership indicates economic status and mobility.' },
  { id: 'v7', label: 'HH member of savings club', type: 'vulnerability', category: 'social-support', domain: 'social-support', definition: 'Indicates participation in savings groups or microfinance organizations. These groups provide financial support and social networks.' },
  { id: 'v8', label: 'HW visit in last yr', type: 'vulnerability', category: 'health-mental-models', domain: 'health-mental-models', definition: 'Records whether a health worker visited the household in the past year. Home visits by health workers improve health education and care access.' },
  { id: 'v9', label: 'Media exposure: internet', type: 'vulnerability', category: 'suggested', domain: 'human-natural-systems', definition: 'Categorizes frequency of internet use by the participant on a weekly basis. Internet access provides health information and social connections.', significance: '**', associations: ['Never breastfed'] },
  { id: 'v10', label: 'Access problem: travel alone', type: 'vulnerability', category: 'woman-past', domain: 'woman-past', definition: 'Identifies women who face barriers traveling to healthcare facilities without accompaniment. This reflects mobility restrictions and autonomy limitations.' },
  { id: 'v11', label: 'Mobile phone used for finances', type: 'vulnerability', category: 'household-economics', domain: 'household-economics', definition: 'Indicates whether a mobile phone is used for financial transactions like mobile money or banking. Mobile financial services increase economic access and independence.' },
  { id: 'v12', label: 'Not living w/ partner', type: 'vulnerability', category: 'household-relationship', domain: 'household-relationship', definition: 'Identifies women not currently living with a spouse or partner. Living arrangements affect household decision-making and resource access.' },
  { id: 'v13', label: 'Currently employed', type: 'vulnerability', category: 'woman-past', domain: 'woman-past', definition: 'Indicates whether the woman is currently engaged in paid employment. Employment provides economic independence and decision-making power.' },
  { id: 'v14', label: 'Age at first birth (3 category)', type: 'vulnerability', category: 'woman-past', domain: 'woman-past', definition: 'Categorizes age at first childbirth into three groups: under 18, 18-24, or 25+. Early childbirth is associated with health and socioeconomic risks.' },
  { id: 'v15', label: 'Age at first sex (4 category)', type: 'vulnerability', category: 'woman-past', domain: 'woman-past' },
  { id: 'v16', label: 'Decision maker: family planning', type: 'vulnerability', category: 'household-relationship', domain: 'household-relationship', definition: 'Identifies who makes decisions about contraceptive use: woman alone, jointly with partner, partner alone, or others. Decision-making power affects reproductive autonomy.' },
  { id: 'v17', label: 'Decision maker: HH purchases', type: 'vulnerability', category: 'household-relationship', domain: 'household-relationship', definition: 'Identifies who makes decisions about major household purchases. Control over household spending reflects economic power within relationships.' },
  { id: 'v18', label: 'Decision maker: own income', type: 'vulnerability', category: 'household-relationship', domain: 'household-relationship', definition: "Identifies who decides how the woman's earnings are spent. Control over personal income indicates economic autonomy and empowerment." },
  { id: 'v19', label: 'Educational attainment', type: 'vulnerability', category: 'suggested', domain: 'woman-past', definition: 'Measures the highest level of education completed: none, primary, secondary, or higher. Education strongly influences health knowledge and economic opportunities.', significance: '***', associations: ['Less than 4 ANC visits'] },
  { id: 'v20', label: 'Preferred next birth interval', type: 'vulnerability', category: 'woman-past', domain: 'woman-past', definition: "Records the woman's desired waiting time before next pregnancy. Birth spacing preferences affect maternal and child health outcomes." },
  { id: 'v21', label: 'Partner opposition to FP use', type: 'vulnerability', category: 'household-relationship', domain: 'household-relationship' },
  { id: 'v22', label: 'Sex of the head of HH', type: 'vulnerability', category: 'household-relationship', domain: 'household-relationship' },
  { id: 'v23', label: 'HH received money', type: 'vulnerability', category: 'social-support', domain: 'social-support' },
  { id: 'v24', label: 'HH slum residence (UN definition)', type: 'vulnerability', category: 'human-natural-systems', domain: 'human-natural-systems' },
  { id: 'v25', label: 'HH water source interrupted', type: 'vulnerability', category: 'human-natural-systems', domain: 'human-natural-systems' },
  { id: 'v26', label: 'Joint decision making index', type: 'vulnerability', category: 'household-relationship', domain: 'household-relationship' },
  { id: 'v27', label: 'HH in malaria zone', type: 'vulnerability', category: 'human-natural-systems', domain: 'human-natural-systems' },
  { id: 'v28', label: 'Marital status', type: 'vulnerability', category: 'household-relationship', domain: 'household-relationship', definition: 'Categorizes if the participant is married, widowed, in a relationship, divorced/separated or never married. Marital status affects household resources and decision-making patterns.' },
  { id: 'v29', label: 'No. <5 yrs in HH (4 category)', type: 'vulnerability', category: 'household-relationship', domain: 'household-relationship' },
  { id: 'v30', label: 'Total lifetime sex partners', type: 'vulnerability', category: 'woman-past', domain: 'woman-past' },
  { id: 'v31', label: 'Wife rank', type: 'vulnerability', category: 'household-relationship', domain: 'household-relationship' },
  { id: 'v32', label: 'Employment continuity', type: 'vulnerability', category: 'woman-past', domain: 'woman-past' },
  { id: 'v33', label: 'Education level (partner)', type: 'vulnerability', category: 'household-relationship', domain: 'household-relationship' },
  { id: 'v34', label: 'Employment status', type: 'vulnerability', category: 'woman-past', domain: 'woman-past' },
  { id: 'v35', label: 'IPV justification', type: 'vulnerability', category: 'household-relationship', domain: 'household-relationship' },
  { id: 'v36', label: 'Religion', type: 'vulnerability', category: 'human-natural-systems', domain: 'human-natural-systems', definition: 'Identifies the religion that the participant belongs to. Religious affiliation influences health beliefs, practices, and care-seeking behaviors.' },
  { id: 'v37', label: 'Age at first cohabitation (3 category)', type: 'vulnerability', category: 'woman-past', domain: 'woman-past' },
  { id: 'v38', label: 'Age at first birth', type: 'vulnerability', category: 'woman-past', domain: 'woman-past' },
  { id: 'v39', label: 'Age at first cohabitation', type: 'vulnerability', category: 'woman-past', domain: 'woman-past' },
  { id: 'v40', label: 'Age at first sex', type: 'vulnerability', category: 'woman-past', domain: 'woman-past' },
  { id: 'v41', label: 'Child given beans/peas/lentils', type: 'vulnerability', category: 'health-mental-models', domain: 'health-mental-models' },
  { id: 'v42', label: 'Child given fortified food', type: 'vulnerability', category: 'health-mental-models', domain: 'health-mental-models' },
  { id: 'v43', label: 'Child given meat', type: 'vulnerability', category: 'health-mental-models', domain: 'health-mental-models' },
  { id: 'v44', label: 'Child given solid/soft food', type: 'vulnerability', category: 'health-mental-models', domain: 'health-mental-models' },
  { id: 'v45', label: 'Child given sweet snacks', type: 'vulnerability', category: 'health-mental-models', domain: 'health-mental-models' },
  { id: 'v46', label: 'Decision maker: family visits', type: 'vulnerability', category: 'household-relationship', domain: 'household-relationship' },
  { id: 'v47', label: 'Child treated for diarrhea', type: 'vulnerability', category: 'health-mental-models', domain: 'health-mental-models' },
  { id: 'v48', label: 'HH member w/ disability', type: 'vulnerability', category: 'household-relationship', domain: 'household-relationship' },
  { id: 'v49', label: 'Earnings relative to partner', type: 'vulnerability', category: 'household-economics', domain: 'household-economics' },
  { id: 'v50', label: 'At least primary education', type: 'vulnerability', category: 'suggested', domain: 'woman-past', definition: 'Binary indicator of whether the woman completed primary education or higher. Primary education is a critical threshold for health literacy and economic opportunities.', significance: '***' },
  { id: 'v51', label: 'Educational attainment (binary)', type: 'vulnerability', category: 'suggested', domain: 'woman-past', definition: 'Simplified education measure categorizing participants as having formal education or no formal education. This captures the fundamental education divide.', significance: '**' },
  { id: 'v52', label: 'Fertility preference', type: 'vulnerability', category: 'woman-past', domain: 'woman-past', definition: "Records whether the woman wants more children, wants no more, or is undecided. Fertility preferences guide family planning needs and service targeting." },
  { id: 'v53', label: 'Media exposure: news/journal', type: 'vulnerability', category: 'suggested', domain: 'human-natural-systems', definition: 'Categorizes frequency of reading newspapers or journals on a weekly basis. Print media access indicates literacy and information access.', significance: '*' },
  { id: 'v54', label: 'Media exposure: radio', type: 'vulnerability', category: 'suggested', domain: 'human-natural-systems', definition: 'Categorizes the frequency of the participant listening to the radio on a weekly basis. Radio is a primary health information source in many communities.', significance: '**' },
  { id: 'v58', label: 'HH received other state support', type: 'vulnerability', category: 'social-support', domain: 'social-support' },
  { id: 'v59', label: 'HH car', type: 'vulnerability', category: 'household-economics', domain: 'household-economics' },
  { id: 'v60', label: 'HH animal-drawn cart', type: 'vulnerability', category: 'household-economics', domain: 'household-economics' },
  { id: 'v61', label: 'HH internet', type: 'vulnerability', category: 'household-economics', domain: 'household-economics' },
  { id: 'v62', label: 'HH child to woman ratio', type: 'vulnerability', category: 'household-relationship', domain: 'household-relationship' },
  { id: 'v63', label: 'HH motorcycle or scooter', type: 'vulnerability', category: 'household-economics', domain: 'household-economics' },
  { id: 'v64', label: 'Age at first birth (5 category)', type: 'vulnerability', category: 'woman-past', domain: 'woman-past' },
  { id: 'v66', label: 'HH rudimentary or natural floor', type: 'vulnerability', category: 'household-economics', domain: 'household-economics' },
  { id: 'v67', label: 'Any birth registered/declared', type: 'vulnerability', category: 'human-natural-systems', domain: 'human-natural-systems' },
  { id: 'v68', label: 'HH water not treated', type: 'vulnerability', category: 'human-natural-systems', domain: 'human-natural-systems' },
  { id: 'v69', label: 'HH radio', type: 'vulnerability', category: 'household-economics', domain: 'household-economics' },
  { id: 'v70', label: 'Condom use during last sex', type: 'vulnerability', category: 'health-mental-models', domain: 'health-mental-models' },
  { id: 'v71', label: "Decision maker: woman's health", type: 'vulnerability', category: 'household-relationship', domain: 'household-relationship' },
  { id: 'v72', label: 'HH refrigerator', type: 'vulnerability', category: 'household-economics', domain: 'household-economics' },
  { id: 'v73', label: 'HH sanitation (3 category)', type: 'vulnerability', category: 'human-natural-systems', domain: 'human-natural-systems' },
  { id: 'v74', label: "Provider for woman's PNC", type: 'vulnerability', category: 'health-mental-models', domain: 'health-mental-models' },
  { id: 'v75', label: 'HH member sends money', type: 'vulnerability', category: 'social-support', domain: 'social-support' },
  { id: 'v76', label: 'HH shares toilet', type: 'vulnerability', category: 'human-natural-systems', domain: 'human-natural-systems' },
  { id: 'v77', label: 'HH stove', type: 'vulnerability', category: 'household-economics', domain: 'household-economics' },
  { id: 'v78', label: 'HH television', type: 'vulnerability', category: 'household-economics', domain: 'household-economics' },
  { id: 'v82', label: 'Media exposure: TV', type: 'vulnerability', category: 'suggested', domain: 'human-natural-systems', definition: 'Categorizes the frequency of watching television on a weekly basis. Television provides visual health education and behavior change messaging.', significance: '**' },
  { id: 'v83', label: 'Phone ownership (woman)', type: 'vulnerability', category: 'household-economics', domain: 'household-economics', definition: 'Indicates whether the woman owns her own mobile phone. Phone ownership enables communication, information access, and economic independence.' },
  { id: 'v84', label: 'HH highest education', type: 'vulnerability', category: 'suggested', domain: 'household-relationship', definition: 'Records the highest level of education achieved by any household member. Household education level influences health knowledge and resource management.', significance: '*' },
  { id: 'v85', label: 'HH owns animals', type: 'vulnerability', category: 'household-economics', domain: 'household-economics' },
  { id: 'v86', label: 'Bank account (household)', type: 'vulnerability', category: 'household-economics', domain: 'household-economics' },
  { id: 'v87', label: 'HH bicycle', type: 'vulnerability', category: 'household-economics', domain: 'household-economics' },
  { id: 'v88', label: 'Fecundity status', type: 'vulnerability', category: 'woman-past', domain: 'woman-past' },
  { id: 'v89', label: 'Family security grants', type: 'vulnerability', category: 'social-support', domain: 'social-support' },
  { id: 'v90', label: 'HH computer', type: 'vulnerability', category: 'household-economics', domain: 'household-economics' },
  { id: 'v91', label: 'Home ownership', type: 'vulnerability', category: 'household-economics', domain: 'household-economics' },
  { id: 'v92', label: 'Land ownership', type: 'vulnerability', category: 'household-economics', domain: 'household-economics' },
  { id: 'v93', label: 'HH cooks food inside', type: 'vulnerability', category: 'household-economics', domain: 'household-economics' },
  { id: 'v94', label: 'HH unimproved toilet', type: 'vulnerability', category: 'human-natural-systems', domain: 'human-natural-systems' },
  { id: 'v95', label: 'Child <15yrs lives away', type: 'vulnerability', category: 'household-relationship', domain: 'household-relationship' },
  { id: 'v96', label: 'Age at first birth (partner)', type: 'vulnerability', category: 'household-relationship', domain: 'household-relationship' },
  { id: 'v108', label: 'HH highest education: 7+', type: 'vulnerability', category: 'suggested', domain: 'household-relationship', definition: 'Indicates whether the highest education in the household is 7 or more years of schooling. This threshold represents completion of primary education and affects household health practices.', significance: '***' },
  { id: 'v109', label: 'Child <3yr given micronutrient', type: 'vulnerability', category: 'health-mental-models', domain: 'health-mental-models' },
  { id: 'v110', label: 'HW talked about FP', type: 'vulnerability', category: 'health-mental-models', domain: 'health-mental-models' },
  { id: 'v111', label: 'Religion: Islam', type: 'vulnerability', category: 'human-natural-systems', domain: 'human-natural-systems' },
  { id: 'v114', label: 'Access problem: treatment cost', type: 'vulnerability', category: 'human-natural-systems', domain: 'human-natural-systems' },
  { id: 'v115', label: 'Access problem: distance to HF', type: 'vulnerability', category: 'human-natural-systems', domain: 'human-natural-systems' },
  { id: 'v116', label: 'Access problem: permission', type: 'vulnerability', category: 'household-relationship', domain: 'household-relationship' },
  { id: 'v117', label: 'No. over 15+ yrs', type: 'vulnerability', category: 'household-relationship', domain: 'household-relationship' },
  { id: 'v118', label: 'No. of living children', type: 'vulnerability', category: 'woman-past', domain: 'woman-past' },
  { id: 'v119', label: 'No. of living children (4 category)', type: 'vulnerability', category: 'woman-past', domain: 'woman-past' },
  { id: 'v120', label: 'No. of pregnancies', type: 'vulnerability', category: 'woman-past', domain: 'woman-past' },
  { id: 'v121', label: 'Female circumcision', type: 'vulnerability', category: 'woman-past', domain: 'woman-past', definition: 'Percentage of women aged 15–49 who have undergone female genital cutting.' },
];

export const ALL_DATA = [...HEALTH_DATA, ...VULNERABILITY_DATA];

const HEALTH_CATEGORIES = [
  { id: 'family-planning', label: 'Family planning' },
  { id: 'child-health', label: 'Child health' },
  { id: 'immunisation', label: 'Immunisation' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'maternal-health', label: 'Maternal health' },
];

const VULNERABILITY_CATEGORIES = [
  { id: 'suggested', label: 'Statistical association' },
  { id: 'woman-past', label: 'Woman and her past experiences' },
  { id: 'health-mental-models', label: 'Health mental models' },
  { id: 'household-relationship', label: 'Household relationships' },
  { id: 'household-economics', label: 'Household economics and living conditions' },
  { id: 'social-support', label: 'Social support' },
  { id: 'human-natural-systems', label: 'Human and natural systems' },
];

const VULNERABILITY_DOMAINS = [
  { id: 'woman-past', label: 'Woman and her past experiences' },
  { id: 'health-mental-models', label: 'Health mental models' },
  { id: 'household-relationship', label: 'Household relationships' },
  { id: 'household-economics', label: 'Household economics and living conditions' },
  { id: 'social-support', label: 'Social support' },
  { id: 'human-natural-systems', label: 'Human and natural systems' },
];

// ── Helper functions ──

function getSignificanceText(sig: string) {
  if (sig === '***') return 'Highly significant';
  if (sig === '**') return 'Very significant';
  return 'Significant';
}

function getPValue(sig: string) {
  if (sig === '***') return 'p ≤ 0.001';
  if (sig === '**') return 'p ≤ 0.01';
  return 'p ≤ 0.05';
}

// ── Sub-components ──

function FilterMenu({
  isOpen,
  activeTab,
  tempFilters,
  setTempFilters,
  onApply,
  onClearAll,
  onClose,
  filterButtonRef,
}: {
  isOpen: boolean;
  activeTab: string;
  tempFilters: string[];
  setTempFilters: React.Dispatch<React.SetStateAction<string[]>>;
  onApply: () => void;
  onClearAll: () => void;
  onClose: () => void;
  filterButtonRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(event.target as Node) &&
        filterButtonRef.current && !filterButtonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, filterButtonRef]);

  if (!isOpen) return null;

  const toggleFilter = (filterId: string) => {
    setTempFilters(prev => prev.includes(filterId) ? prev.filter(id => id !== filterId) : [...prev, filterId]);
  };

  const showBothColumns = activeTab === 'all';
  const categories = activeTab === 'health' ? HEALTH_CATEGORIES : VULNERABILITY_CATEGORIES;

  return (
    <div ref={menuRef} className="add-data-modal__filter-menu">
      <div className="add-data-modal__filter-menu-columns">
        {showBothColumns ? (
          <>
            <div className="add-data-modal__filter-menu-column">
              <div className="add-data-modal__filter-menu-heading">Health area</div>
              {HEALTH_CATEGORIES.map(cat => (
                <button key={cat.id} className="add-data-modal__filter-menu-item" onClick={() => toggleFilter(cat.id)}>
                  <div className={`add-data-modal__checkbox${tempFilters.includes(cat.id) ? ' add-data-modal__checkbox--checked' : ''}`}>
                    {tempFilters.includes(cat.id) && <CheckIcon />}
                  </div>
                  <span className="add-data-modal__filter-menu-item-label">{cat.label}</span>
                </button>
              ))}
            </div>
            <div className="add-data-modal__filter-menu-column">
              <div className="add-data-modal__filter-menu-heading">Vulnerability domains</div>
              {VULNERABILITY_CATEGORIES.map(cat => (
                <button key={cat.id} className="add-data-modal__filter-menu-item" onClick={() => toggleFilter(cat.id)}>
                  <div className={`add-data-modal__checkbox${tempFilters.includes(cat.id) ? ' add-data-modal__checkbox--checked' : ''}`}>
                    {tempFilters.includes(cat.id) && <CheckIcon />}
                  </div>
                  <span className="add-data-modal__filter-menu-item-label">{cat.label}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="add-data-modal__filter-menu-column">
            <div className="add-data-modal__filter-menu-heading">
              {activeTab === 'health' ? 'Health area' : 'Vulnerability domains'}
            </div>
            {categories.map(cat => (
              <button key={cat.id} className="add-data-modal__filter-menu-item" onClick={() => toggleFilter(cat.id)}>
                <div className={`add-data-modal__checkbox${tempFilters.includes(cat.id) ? ' add-data-modal__checkbox--checked' : ''}`}>
                  {tempFilters.includes(cat.id) && <CheckIcon />}
                </div>
                <span className="add-data-modal__filter-menu-item-label">{cat.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="add-data-modal__filter-menu-footer">
        <button className="add-data-modal__filter-menu-clear" onClick={onClearAll}>Clear all</button>
        <button className="add-data-modal__filter-menu-apply" onClick={onApply}>Apply</button>
      </div>
    </div>
  );
}

// ── Chip with tooltip ──

function AssociationChip({ item }: { item: DataItem }) {
  const chipRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (showTooltip && chipRef.current) {
      const rect = chipRef.current.getBoundingClientRect();
      setTooltipPos({ top: rect.top - 8, left: rect.left });
    }
  }, [showTooltip]);

  if (!item.associations || item.associations.length === 0) return null;

  return (
    <>
      <div
        ref={chipRef}
        className="add-data-modal__chip"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <SuggestedInfoIcon />
        <span className="add-data-modal__chip-label">
          {item.associations.length > 1
            ? `${item.associations.length} statistical associations${item.significance || ''}`
            : `Statistical association${item.significance || ''}`
          }
        </span>
      </div>
      {showTooltip && (
        <div className="add-data-modal__chip-tooltip" style={{ top: tooltipPos.top, left: tooltipPos.left }}>
          <div className="add-data-modal__chip-tooltip-title">Statistical associations</div>
          {item.associations.map((assoc, idx) => (
            <div key={idx} className="add-data-modal__chip-tooltip-item">
              <span className="add-data-modal__chip-tooltip-sig">{item.significance}{getSignificanceText(item.significance || '*')}</span>
              <span className="add-data-modal__chip-tooltip-pval">({getPValue(item.significance || '*')})</span>
              <span className="add-data-modal__chip-tooltip-pval">statistical association with:</span>
              <span className="add-data-modal__chip-tooltip-assoc">{assoc}</span>
            </div>
          ))}
          <div className="add-data-modal__chip-tooltip-arrow" />
        </div>
      )}
    </>
  );
}

// ── Data Row ──

function DataRow({
  item,
  isSelected,
  onToggle,
  searchTerm,
  hoveredInfoIcon,
  setHoveredInfoIcon,
}: {
  item: DataItem;
  isSelected: boolean;
  onToggle: () => void;
  searchTerm: string;
  hoveredInfoIcon: string | null;
  setHoveredInfoIcon: (id: string | null) => void;
}) {
  const highlightLabel = (text: string) => {
    if (!searchTerm.trim()) return text;
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <span key={i} className="add-data-modal__row-label-highlight">{part}</span> : part
    );
  };

  return (
    <button className="add-data-modal__row" onClick={onToggle}>
      <div className="add-data-modal__row-left">
        <div className={`add-data-modal__checkbox${isSelected ? ' add-data-modal__checkbox--checked' : ''}`}>
          {isSelected && <CheckIcon />}
        </div>
        <span className="add-data-modal__row-label">{highlightLabel(item.label)}</span>
        {item.category === 'suggested' && <AssociationChip item={item} />}
      </div>
      <div
        className="add-data-modal__info"
        onMouseEnter={(e) => { e.stopPropagation(); setHoveredInfoIcon(item.id); }}
        onMouseLeave={(e) => { e.stopPropagation(); setHoveredInfoIcon(null); }}
        onClick={(e) => e.stopPropagation()}
      >
        <InfoIcon className="add-data-modal__info-icon" />
        {hoveredInfoIcon === item.id && item.definition && (
          <div className="add-data-modal__info-tooltip">
            <p className="add-data-modal__info-tooltip-text">{item.definition}</p>
          </div>
        )}
      </div>
    </button>
  );
}

// ── Main Component ──

interface AddDataModalProps {
  onClose: () => void;
  onConfirm?: (selectedIds: string[]) => void;
  initialSelected?: string[];
}

export function AddDataModal({ onClose, onConfirm, initialSelected }: AddDataModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>(initialSelected || []);
  const [activeTab, setActiveTab] = useState<'all' | 'health' | 'vulnerability'>('all');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  const [tempFilters, setTempFilters] = useState<string[]>([]);
  const [hoveredInfoIcon, setHoveredInfoIcon] = useState<string | null>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);

  const toggleItem = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const clearAll = () => setSelectedItems([]);

  const handleFilterButtonClick = () => {
    if (isFilterMenuOpen) {
      setIsFilterMenuOpen(false);
    } else {
      setTempFilters(appliedFilters);
      setIsFilterMenuOpen(true);
    }
  };

  const handleApplyFilters = () => {
    setAppliedFilters(tempFilters);
    setIsFilterMenuOpen(false);
  };

  const handleClearAllFilters = () => {
    setTempFilters([]);
    setAppliedFilters([]);
    setIsFilterMenuOpen(false);
  };

  // Filter logic
  const getFilteredData = () => {
    let data: DataItem[];
    if (activeTab === 'health') data = HEALTH_DATA;
    else if (activeTab === 'vulnerability') data = VULNERABILITY_DATA;
    else data = ALL_DATA;

    let filtered = data.filter(item => item.label.toLowerCase().includes(searchTerm.toLowerCase()));

    if (appliedFilters.length > 0) {
      filtered = filtered.filter(item => {
        if (!item.category) return false;
        if (appliedFilters.includes('suggested') && item.category === 'suggested') {
          return item.associations && item.associations.length > 0;
        }
        return appliedFilters.includes(item.category);
      });
    }

    return filtered;
  };

  const filteredData = getFilteredData();
  const filteredHealthData = filteredData.filter(item => item.type === 'health');
  const filteredVulnerabilityData = filteredData.filter(item => item.type === 'vulnerability');
  const selectedData = ALL_DATA.filter(item => selectedItems.includes(item.id));

  // Filter button text
  const getFilterButtonText = () => {
    if (appliedFilters.length === 0) {
      if (activeTab === 'all') return 'Health area / vulnerability domain';
      if (activeTab === 'health') return 'Health area';
      return 'Vulnerability domain';
    }
    if (appliedFilters.length === 1) {
      const all = [...HEALTH_CATEGORIES, ...VULNERABILITY_CATEGORIES];
      const f = all.find(c => c.id === appliedFilters[0]);
      return f ? f.label : '';
    }
    return `${appliedFilters.length} selected`;
  };

  // List header count text
  const getListCountText = () => {
    if (activeTab === 'all') return `All data (${ALL_DATA.length})`;
    if (activeTab === 'health') return `Health outcomes and behaviours (${HEALTH_DATA.length})`;
    return `Vulnerability factors (${VULNERABILITY_DATA.length})`;
  };

  // Render vulnerability items grouped by domain
  const renderVulnerabilityByDomain = (items: DataItem[]) => (
    <>
      {VULNERABILITY_DOMAINS.map(domain => {
        const domainItems = items.filter(item => item.domain === domain.id);
        if (domainItems.length === 0) return null;
        return (
          <div key={domain.id}>
            <div className="add-data-modal__domain-bar" data-domain-id={domain.id}>{domain.label}</div>
            {domainItems.map(item => (
              <DataRow
                key={item.id}
                item={item}
                isSelected={selectedItems.includes(item.id)}
                onToggle={() => toggleItem(item.id)}
                searchTerm={searchTerm}
                hoveredInfoIcon={hoveredInfoIcon}
                setHoveredInfoIcon={setHoveredInfoIcon}
              />
            ))}
          </div>
        );
      })}
    </>
  );

  return (
    <>
      {/* Overlay */}
      <div className="add-data-modal__overlay" onClick={onClose}>
        {/* Modal */}
        <div className="add-data-modal" onClick={e => e.stopPropagation()}>

          {/* Close Button */}
          <button className="add-data-modal__close" onClick={onClose}>
            <CancelIcon className="add-data-modal__close-icon" />
          </button>

          {/* Two-Column Layout */}
          <div className="add-data-modal__layout">

            {/* Left Column */}
            <div className="add-data-modal__left">

              {/* Title + Search */}
              <div className="add-data-modal__header">
                <h2 className="add-data-modal__title">Select data to compare</h2>
                <div className="add-data-modal__search">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search for anything"
                    className="add-data-modal__search-input"
                  />
                  <SearchIcon className="add-data-modal__search-icon" />
                </div>
              </div>

              {/* Tab Buttons */}
              <div className="add-data-modal__tabs">
                <button
                  className={`add-data-modal__tab${activeTab === 'all' ? ' add-data-modal__tab--active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  All data
                </button>
                <button
                  className={`add-data-modal__tab${activeTab === 'health' ? ' add-data-modal__tab--active' : ''}`}
                  onClick={() => {
                    setActiveTab('health');
                    setAppliedFilters(prev => prev.filter(f => !VULNERABILITY_CATEGORIES.map(c => c.id).includes(f)));
                  }}
                >
                  Health outcomes and behaviours
                </button>
                <button
                  className={`add-data-modal__tab${activeTab === 'vulnerability' ? ' add-data-modal__tab--active' : ''}`}
                  onClick={() => {
                    setActiveTab('vulnerability');
                    setAppliedFilters(prev => prev.filter(f => !HEALTH_CATEGORIES.map(c => c.id).includes(f)));
                  }}
                >
                  Vulnerability factors
                </button>
              </div>

              {/* List Container */}
              <div className="add-data-modal__list-container">

                {/* List Header */}
                <div className="add-data-modal__list-header">
                  <span className="add-data-modal__list-count">{getListCountText()}</span>
                  <div className="add-data-modal__filter-area">
                    <FilterListIcon />
                    <span className="add-data-modal__filter-label">Filter:</span>
                    <button
                      ref={filterButtonRef}
                      className="add-data-modal__filter-button"
                      onClick={handleFilterButtonClick}
                    >
                      <span className="add-data-modal__filter-button-text">{getFilterButtonText()}</span>
                      <span className={`add-data-modal__filter-chevron${isFilterMenuOpen ? ' add-data-modal__filter-chevron--open' : ''}`}>
                        <ChevronDownIcon />
                      </span>
                    </button>
                    <FilterMenu
                      isOpen={isFilterMenuOpen}
                      activeTab={activeTab}
                      tempFilters={tempFilters}
                      setTempFilters={setTempFilters}
                      onApply={handleApplyFilters}
                      onClearAll={handleClearAllFilters}
                      onClose={() => setIsFilterMenuOpen(false)}
                      filterButtonRef={filterButtonRef}
                    />
                  </div>
                </div>

                {/* Scrollable List */}
                <div className="add-data-modal__scroll">
                  {activeTab === 'all' && (
                    <>
                      {filteredHealthData.length > 0 && (
                        <div>
                          <div className="add-data-modal__section-header">
                            <span className="add-data-modal__section-header-text">
                              Health outcomes and behaviours ({filteredHealthData.length})
                            </span>
                          </div>
                          {filteredHealthData.map(item => (
                            <DataRow
                              key={item.id}
                              item={item}
                              isSelected={selectedItems.includes(item.id)}
                              onToggle={() => toggleItem(item.id)}
                              searchTerm={searchTerm}
                              hoveredInfoIcon={hoveredInfoIcon}
                              setHoveredInfoIcon={setHoveredInfoIcon}
                            />
                          ))}
                        </div>
                      )}
                      {filteredVulnerabilityData.length > 0 && (
                        <div>
                          <div className="add-data-modal__section-header">
                            <span className="add-data-modal__section-header-text">
                              Vulnerability factors ({filteredVulnerabilityData.length})
                            </span>
                          </div>
                          {renderVulnerabilityByDomain(filteredVulnerabilityData)}
                        </div>
                      )}
                    </>
                  )}

                  {activeTab === 'health' && (
                    <>
                      {filteredData.map(item => (
                        <DataRow
                          key={item.id}
                          item={item}
                          isSelected={selectedItems.includes(item.id)}
                          onToggle={() => toggleItem(item.id)}
                          searchTerm={searchTerm}
                          hoveredInfoIcon={hoveredInfoIcon}
                          setHoveredInfoIcon={setHoveredInfoIcon}
                        />
                      ))}
                    </>
                  )}

                  {activeTab === 'vulnerability' && renderVulnerabilityByDomain(filteredData)}
                </div>
              </div>

              {/* Significance Key */}
              <div className="add-data-modal__significance">
                <div className="add-data-modal__info" style={{ width: 16, height: 16 }}>
                  <InfoIcon className="add-data-modal__info-icon" style={{ width: 16, height: 16 }} />
                </div>
                <span className="add-data-modal__significance-label">Significance levels:</span>
                <div className="add-data-modal__significance-levels">
                  <span className="add-data-modal__significance-item">* p&lt;0.05</span>
                  <span className="add-data-modal__significance-item">** p&lt;0.01</span>
                  <span className="add-data-modal__significance-item">*** p&lt;0.001</span>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="add-data-modal__right">
              <div>
                <div className="add-data-modal__selected-header">
                  <h3 className="add-data-modal__selected-title">
                    Selected data {selectedItems.length > 0 && `(${selectedItems.length})`}
                  </h3>
                  {selectedItems.length > 0 && (
                    <button className="add-data-modal__selected-clear" onClick={clearAll}>Clear all</button>
                  )}
                </div>
                <div className="add-data-modal__selected-box">
                  {selectedData.length === 0 ? (
                    <div className="add-data-modal__selected-empty">No data selected</div>
                  ) : (
                    <div className="add-data-modal__selected-items">
                      {selectedData.map(item => (
                        <div key={item.id} className="add-data-modal__selected-chip">
                          <span className="add-data-modal__selected-chip-label">{item.label}</span>
                          <button className="add-data-modal__selected-chip-remove" onClick={() => toggleItem(item.id)}>
                            <CloseSmallIcon />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Compare Button */}
              <button className="add-data-modal__compare-button" onClick={() => { onConfirm?.(selectedItems); onClose(); }}>
                <span className="add-data-modal__compare-button-text">Compare</span>
                <ArrowForwardIcon className="add-data-modal__compare-button-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
