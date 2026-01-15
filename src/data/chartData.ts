import type { ChartDataSet, StackedChartDataSet } from '../types/chartData';

// Data categorical colors from design tokens
const categoryColors = {
  cat1: '#88c0fd', // data-categorical-1
  cat2: '#af73c8', // data-categorical-2
  cat3: '#66c2a5', // data-categorical-3
  cat4: '#fb8585', // data-categorical-4
  cat5: '#ffd92f', // data-categorical-5
  cat6: '#8da0cb'  // data-categorical-6
};

export const chartDataSets: Record<string, ChartDataSet | StackedChartDataSet> = {
  'any-child-no-fever-cough-care': {
    title: 'Any child no fever/cough care',
    subtitle: 'Sample median',
    denominator: 'Children under 5 with fever/cough',
    description:
      'The percentage of children under 5 years with fever or cough symptoms who did not receive any medical care or treatment from a healthcare provider.',
    data: [
      { segment: 'U1', value: 45, label: '45%' },
      { segment: 'U2', value: 38, label: '38%' },
      { segment: 'U3', value: 52, label: '52%' },
      { segment: 'U4', value: 61, label: '61%' },
      { segment: 'R2', value: 42, label: '42%' },
      { segment: 'R3.1', value: 58, label: '58%' },
      { segment: 'R3.2', value: 64, label: '64%' },
      { segment: 'R4', value: 72, label: '72%' }
    ],
    medianLine: 52
  },
  'no-pnc-newborn': {
    title: 'Woman had a health check after last birth',
    subtitle: 'Sample median',
    denominator: 'Women aged 15-49',
    description:
      'The percentage of women who received a comprehensive postnatal health assessment by a healthcare provider within 6-8 weeks after giving birth. This check monitors physical and mental recovery, screens for complications, and assesses overall wellbeing.',
    data: [
      { segment: 'U1', value: 68, label: '68%' },
      { segment: 'U2', value: 52, label: '52%' },
      { segment: 'U3', value: 23, label: '23%' },
      { segment: 'U4', value: 10, label: '10%' },
      { segment: 'R2', value: 51, label: '51%' },
      { segment: 'R3.1', value: 10, label: '10%' },
      { segment: 'R3.2', value: 15, label: '15%' },
      { segment: 'R4', value: 8, label: '8%' }
    ],
    medianLine: 29
  },
  'pregnancy-ends-stillbirth': {
    title: 'Pregnancy ends at still birth',
    subtitle: 'Sample median',
    denominator: 'Women aged 15-49',
    description:
      'The percentage of pregnancies that result in stillbirth, where the baby dies before or during delivery after 20 weeks of gestation.',
    data: [
      { segment: 'U1', value: 5, label: '5%' },
      { segment: 'U2', value: 8, label: '8%' },
      { segment: 'U3', value: 12, label: '12%' },
      { segment: 'U4', value: 15, label: '15%' },
      { segment: 'R2', value: 9, label: '9%' },
      { segment: 'R3.1', value: 14, label: '14%' },
      { segment: 'R3.2', value: 18, label: '18%' },
      { segment: 'R4', value: 22, label: '22%' }
    ],
    medianLine: 12
  },
  'death-child-5yrs': {
    title: 'Death of a child before 5 years',
    subtitle: 'Sample median',
    denominator: 'Children born in last 5 years',
    description:
      'The under-five mortality rate, measuring the probability of a child dying between birth and their fifth birthday.',
    data: [
      { segment: 'U1', value: 20, label: '20%' },
      { segment: 'U2', value: 28, label: '28%' },
      { segment: 'U3', value: 35, label: '35%' },
      { segment: 'U4', value: 42, label: '42%' },
      { segment: 'R2', value: 31, label: '31%' },
      { segment: 'R3.1', value: 39, label: '39%' },
      { segment: 'R3.2', value: 45, label: '45%' },
      { segment: 'R4', value: 52, label: '52%' }
    ],
    medianLine: 35
  },
  'cough-2-weeks-last': {
    title: 'Cough 2 weeks last',
    subtitle: 'Sample median',
    denominator: 'Children under 5',
    description: 'The percentage of children under 5 who experienced cough in the last 2 weeks.',
    data: [
      { segment: 'U1', value: 32, label: '32%' },
      { segment: 'U2', value: 28, label: '28%' },
      { segment: 'U3', value: 35, label: '35%' },
      { segment: 'U4', value: 41, label: '41%' },
      { segment: 'R2', value: 30, label: '30%' },
      { segment: 'R3.1', value: 38, label: '38%' },
      { segment: 'R3.2', value: 43, label: '43%' },
      { segment: 'R4', value: 48, label: '48%' }
    ],
    medianLine: 35
  },
  'death-child-1yr': {
    title: 'Death of a child before 1 yr',
    subtitle: 'Sample median',
    denominator: 'Children born in last year',
    description: 'The infant mortality rate, measuring deaths in the first year of life.',
    data: [
      { segment: 'U1', value: 12, label: '12%' },
      { segment: 'U2', value: 18, label: '18%' },
      { segment: 'U3', value: 24, label: '24%' },
      { segment: 'U4', value: 31, label: '31%' },
      { segment: 'R2', value: 20, label: '20%' },
      { segment: 'R3.1', value: 27, label: '27%' },
      { segment: 'R3.2', value: 33, label: '33%' },
      { segment: 'R4', value: 39, label: '39%' }
    ],
    medianLine: 24
  },
  'diarrhea-2-weeks-last': {
    title: 'Diarrhea 2 weeks last',
    subtitle: 'Sample median',
    denominator: 'Children under 5',
    description: 'The percentage of children under 5 who experienced diarrhea in the last 2 weeks.',
    data: [
      { segment: 'U1', value: 25, label: '25%' },
      { segment: 'U2', value: 22, label: '22%' },
      { segment: 'U3', value: 29, label: '29%' },
      { segment: 'U4', value: 36, label: '36%' },
      { segment: 'R2', value: 24, label: '24%' },
      { segment: 'R3.1', value: 32, label: '32%' },
      { segment: 'R3.2', value: 38, label: '38%' },
      { segment: 'R4', value: 44, label: '44%' }
    ],
    medianLine: 29
  },
  'fever-2-weeks-last': {
    title: 'Fever 2 weeks last',
    subtitle: 'Sample median',
    denominator: 'Children under 5',
    description: 'The percentage of children under 5 who experienced fever in the last 2 weeks.',
    data: [
      { segment: 'U1', value: 30, label: '30%' },
      { segment: 'U2', value: 26, label: '26%' },
      { segment: 'U3', value: 33, label: '33%' },
      { segment: 'U4', value: 40, label: '40%' },
      { segment: 'R2', value: 28, label: '28%' },
      { segment: 'R3.1', value: 36, label: '36%' },
      { segment: 'R3.2', value: 42, label: '42%' },
      { segment: 'R4', value: 47, label: '47%' }
    ],
    medianLine: 33
  },
  'low-birth-weight-last': {
    title: 'Low birth weight last',
    subtitle: 'Sample median',
    denominator: 'Live births in last 5 years',
    description: 'The percentage of newborns with birth weight less than 2500 grams.',
    data: [
      { segment: 'U1', value: 8, label: '8%' },
      { segment: 'U2', value: 11, label: '11%' },
      { segment: 'U3', value: 15, label: '15%' },
      { segment: 'U4', value: 19, label: '19%' },
      { segment: 'R2', value: 12, label: '12%' },
      { segment: 'R3.1', value: 17, label: '17%' },
      { segment: 'R3.2', value: 21, label: '21%' },
      { segment: 'R4', value: 25, label: '25%' }
    ],
    medianLine: 15
  },
  'child-not-immunized-polio': {
    title: 'Child not immunized - polio',
    subtitle: 'Sample median',
    denominator: 'Children aged 12-23 months',
    description: 'The percentage of children who have not received any polio vaccination.',
    data: [
      { segment: 'U1', value: 5, label: '5%' },
      { segment: 'U2', value: 8, label: '8%' },
      { segment: 'U3', value: 12, label: '12%' },
      { segment: 'U4', value: 17, label: '17%' },
      { segment: 'R2', value: 9, label: '9%' },
      { segment: 'R3.1', value: 14, label: '14%' },
      { segment: 'R3.2', value: 19, label: '19%' },
      { segment: 'R4', value: 24, label: '24%' }
    ],
    medianLine: 12
  },
  'no-routine-vaccination': {
    title: 'No routine vaccination',
    subtitle: 'Sample median',
    denominator: 'Children aged 12-23 months',
    description: 'The percentage of children who have not received any routine vaccinations.',
    data: [
      { segment: 'U1', value: 7, label: '7%' },
      { segment: 'U2', value: 11, label: '11%' },
      { segment: 'U3', value: 16, label: '16%' },
      { segment: 'U4', value: 22, label: '22%' },
      { segment: 'R2', value: 12, label: '12%' },
      { segment: 'R3.1', value: 18, label: '18%' },
      { segment: 'R3.2', value: 24, label: '24%' },
      { segment: 'R4', value: 30, label: '30%' }
    ],
    medianLine: 16
  },
  'number-not-immunized-mmr': {
    title: 'Number not immunized - MMR',
    subtitle: 'Sample median',
    denominator: 'Children aged 12-23 months',
    description: 'The percentage of children who have not received MMR vaccination.',
    data: [
      { segment: 'U1', value: 10, label: '10%' },
      { segment: 'U2', value: 14, label: '14%' },
      { segment: 'U3', value: 19, label: '19%' },
      { segment: 'U4', value: 25, label: '25%' },
      { segment: 'R2', value: 15, label: '15%' },
      { segment: 'R3.1', value: 21, label: '21%' },
      { segment: 'R3.2', value: 27, label: '27%' },
      { segment: 'R4', value: 33, label: '33%' }
    ],
    medianLine: 19
  },
  'vaccination-documentation': {
    title: 'Vaccination documentation',
    subtitle: 'Sample median',
    denominator: 'Children aged 12-23 months',
    description: 'The percentage of children with documented proof of vaccination.',
    data: [
      { segment: 'U1', value: 75, label: '75%' },
      { segment: 'U2', value: 68, label: '68%' },
      { segment: 'U3', value: 62, label: '62%' },
      { segment: 'U4', value: 55, label: '55%' },
      { segment: 'R2', value: 67, label: '67%' },
      { segment: 'R3.1', value: 60, label: '60%' },
      { segment: 'R3.2', value: 53, label: '53%' },
      { segment: 'R4', value: 47, label: '47%' }
    ],
    medianLine: 62
  },
  'zero-dose-child': {
    title: 'Zero-dose child',
    subtitle: 'Sample median',
    denominator: 'Children aged 12-23 months',
    description: 'The percentage of children who have not received any vaccine doses.',
    data: [
      { segment: 'U1', value: 6, label: '6%' },
      { segment: 'U2', value: 10, label: '10%' },
      { segment: 'U3', value: 15, label: '15%' },
      { segment: 'U4', value: 21, label: '21%' },
      { segment: 'R2', value: 11, label: '11%' },
      { segment: 'R3.1', value: 17, label: '17%' },
      { segment: 'R3.2', value: 23, label: '23%' },
      { segment: 'R4', value: 29, label: '29%' }
    ],
    medianLine: 15
  },
  'latest-birth-delivered-home': {
    title: 'Latest birth delivered at home',
    subtitle: 'Sample median',
    denominator: 'Women with births in last 5 years',
    description: 'The percentage of births that took place at home rather than in a health facility.',
    data: [
      { segment: 'U1', value: 15, label: '15%' },
      { segment: 'U2', value: 22, label: '22%' },
      { segment: 'U3', value: 35, label: '35%' },
      { segment: 'U4', value: 48, label: '48%' },
      { segment: 'R2', value: 28, label: '28%' },
      { segment: 'R3.1', value: 42, label: '42%' },
      { segment: 'R3.2', value: 54, label: '54%' },
      { segment: 'R4', value: 65, label: '65%' }
    ],
    medianLine: 35
  },
  'less-than-4-anc-visits-last': {
    title: 'Less than 4 ANC visits last',
    subtitle: 'Sample median',
    denominator: 'Women with births in last 5 years',
    description: 'The percentage of women who had fewer than 4 antenatal care visits during their last pregnancy.',
    data: [
      { segment: 'U1', value: 25, label: '25%' },
      { segment: 'U2', value: 32, label: '32%' },
      { segment: 'U3', value: 41, label: '41%' },
      { segment: 'U4', value: 52, label: '52%' },
      { segment: 'R2', value: 35, label: '35%' },
      { segment: 'R3.1', value: 46, label: '46%' },
      { segment: 'R3.2', value: 56, label: '56%' },
      { segment: 'R4', value: 64, label: '64%' }
    ],
    medianLine: 41
  },
  'no-anc-1st-trimester-last': {
    title: 'No ANC 1st trimester last',
    subtitle: 'Sample median',
    denominator: 'Women with births in last 5 years',
    description: 'The percentage of women who did not receive antenatal care in the first trimester of their last pregnancy.',
    data: [
      { segment: 'U1', value: 30, label: '30%' },
      { segment: 'U2', value: 38, label: '38%' },
      { segment: 'U3', value: 47, label: '47%' },
      { segment: 'U4', value: 58, label: '58%' },
      { segment: 'R2', value: 41, label: '41%' },
      { segment: 'R3.1', value: 52, label: '52%' },
      { segment: 'R3.2', value: 61, label: '61%' },
      { segment: 'R4', value: 69, label: '69%' }
    ],
    medianLine: 47
  },
  'received-pnc': {
    title: 'Received PNC',
    subtitle: 'Sample median',
    denominator: 'Women with births in last 5 years',
    description: 'The percentage of women who received postnatal care within 48 hours of delivery.',
    data: [
      { segment: 'U1', value: 72, label: '72%' },
      { segment: 'U2', value: 65, label: '65%' },
      { segment: 'U3', value: 58, label: '58%' },
      { segment: 'U4', value: 48, label: '48%' },
      { segment: 'R2', value: 63, label: '63%' },
      { segment: 'R3.1', value: 54, label: '54%' },
      { segment: 'R3.2', value: 46, label: '46%' },
      { segment: 'R4', value: 38, label: '38%' }
    ],
    medianLine: 58
  },
  'any-child-not-immediately-breastfed': {
    title: 'Any child not immediately breastfed',
    subtitle: 'Sample median',
    denominator: 'Children born in last 2 years',
    description: 'The percentage of newborns who were not put to the breast within one hour of birth.',
    data: [
      { segment: 'U1', value: 18, label: '18%' },
      { segment: 'U2', value: 24, label: '24%' },
      { segment: 'U3', value: 32, label: '32%' },
      { segment: 'U4', value: 41, label: '41%' },
      { segment: 'R2', value: 27, label: '27%' },
      { segment: 'R3.1', value: 36, label: '36%' },
      { segment: 'R3.2', value: 44, label: '44%' },
      { segment: 'R4', value: 52, label: '52%' }
    ],
    medianLine: 32
  },
  'child-not-exclusively-breastfed': {
    title: 'Child not exclusively breastfed',
    subtitle: 'Sample median',
    denominator: 'Children aged 0-5 months',
    description: 'The percentage of infants under 6 months who are not exclusively breastfed.',
    data: [
      { segment: 'U1', value: 35, label: '35%' },
      { segment: 'U2', value: 42, label: '42%' },
      { segment: 'U3', value: 51, label: '51%' },
      { segment: 'U4', value: 62, label: '62%' },
      { segment: 'R2', value: 45, label: '45%' },
      { segment: 'R3.1', value: 56, label: '56%' },
      { segment: 'R3.2', value: 65, label: '65%' },
      { segment: 'R4', value: 73, label: '73%' }
    ],
    medianLine: 51
  },
  'stunted-child': {
    title: 'Stunted child',
    subtitle: 'Sample median',
    denominator: 'Children under 5',
    description: 'The percentage of children under 5 whose height-for-age is below -2 standard deviations from the median.',
    data: [
      { segment: 'U1', value: 22, label: '22%' },
      { segment: 'U2', value: 28, label: '28%' },
      { segment: 'U3', value: 36, label: '36%' },
      { segment: 'U4', value: 45, label: '45%' },
      { segment: 'R2', value: 31, label: '31%' },
      { segment: 'R3.1', value: 40, label: '40%' },
      { segment: 'R3.2', value: 48, label: '48%' },
      { segment: 'R4', value: 56, label: '56%' }
    ],
    medianLine: 36
  },
  'wasted-child': {
    title: 'Wasted child',
    subtitle: 'Sample median',
    denominator: 'Children under 5',
    description: 'The percentage of children under 5 whose weight-for-height is below -2 standard deviations from the median.',
    data: [
      { segment: 'U1', value: 8, label: '8%' },
      { segment: 'U2', value: 12, label: '12%' },
      { segment: 'U3', value: 16, label: '16%' },
      { segment: 'U4', value: 22, label: '22%' },
      { segment: 'R2', value: 14, label: '14%' },
      { segment: 'R3.1', value: 19, label: '19%' },
      { segment: 'R3.2', value: 24, label: '24%' },
      { segment: 'R4', value: 29, label: '29%' }
    ],
    medianLine: 16
  },
  'woman-underweight': {
    title: 'Woman is underweight',
    subtitle: 'Sample median',
    denominator: 'Women aged 15-49',
    description: 'The percentage of women whose BMI is below 18.5.',
    data: [
      { segment: 'U1', value: 12, label: '12%' },
      { segment: 'U2', value: 16, label: '16%' },
      { segment: 'U3', value: 21, label: '21%' },
      { segment: 'U4', value: 28, label: '28%' },
      { segment: 'R2', value: 18, label: '18%' },
      { segment: 'R3.1', value: 24, label: '24%' },
      { segment: 'R3.2', value: 30, label: '30%' },
      { segment: 'R4', value: 36, label: '36%' }
    ],
    medianLine: 21
  },
  'never-tested-hiv': {
    title: 'Never tested for HIV',
    subtitle: 'Sample median',
    denominator: 'Women aged 15-49',
    description: 'The percentage of women who have never been tested for HIV.',
    data: [
      { segment: 'U1', value: 25, label: '25%' },
      { segment: 'U2', value: 32, label: '32%' },
      { segment: 'U3', value: 42, label: '42%' },
      { segment: 'U4', value: 54, label: '54%' },
      { segment: 'R2', value: 36, label: '36%' },
      { segment: 'R3.1', value: 48, label: '48%' },
      { segment: 'R3.2', value: 58, label: '58%' },
      { segment: 'R4', value: 67, label: '67%' }
    ],
    medianLine: 42
  },
  'never-used-modern-fp-method': {
    title: 'Never used modern FP method',
    subtitle: 'Sample median',
    denominator: 'Women aged 15-49',
    description: 'The percentage of women who have never used a modern family planning method.',
    data: [
      { segment: 'U1', value: 28, label: '28%' },
      { segment: 'U2', value: 35, label: '35%' },
      { segment: 'U3', value: 45, label: '45%' },
      { segment: 'U4', value: 57, label: '57%' },
      { segment: 'R2', value: 38, label: '38%' },
      { segment: 'R3.1', value: 50, label: '50%' },
      { segment: 'R3.2', value: 60, label: '60%' },
      { segment: 'R4', value: 69, label: '69%' }
    ],
    medianLine: 45
  },
  'non-use-modern-fp-method': {
    title: 'Non-use of modern FP method',
    subtitle: 'Sample median',
    denominator: 'Women aged 15-49',
    description: 'The percentage of women currently not using any modern family planning method.',
    data: [
      { segment: 'U1', value: 32, label: '32%' },
      { segment: 'U2', value: 39, label: '39%' },
      { segment: 'U3', value: 48, label: '48%' },
      { segment: 'U4', value: 59, label: '59%' },
      { segment: 'R2', value: 42, label: '42%' },
      { segment: 'R3.1', value: 53, label: '53%' },
      { segment: 'R3.2', value: 62, label: '62%' },
      { segment: 'R4', value: 71, label: '71%' }
    ],
    medianLine: 48
  },
  'sti-last-12-months': {
    title: 'STI in the last 12 months',
    subtitle: 'Sample median',
    denominator: 'Women aged 15-49',
    description: 'The percentage of women who reported having a sexually transmitted infection in the last 12 months.',
    data: [
      { segment: 'U1', value: 5, label: '5%' },
      { segment: 'U2', value: 7, label: '7%' },
      { segment: 'U3', value: 10, label: '10%' },
      { segment: 'U4', value: 14, label: '14%' },
      { segment: 'R2', value: 8, label: '8%' },
      { segment: 'R3.1', value: 12, label: '12%' },
      { segment: 'R3.2', value: 15, label: '15%' },
      { segment: 'R4', value: 19, label: '19%' }
    ],
    medianLine: 10
  },

  // ============================================
  // VULNERABILITY FACTORS
  // ============================================

  // Woman and her past experiences
  'any-media-exposure': {
    title: 'Any media exposure',
    subtitle: 'Sample median',
    denominator: 'Women aged 15-49',
    description: 'The percentage of women who have been exposed to any form of media (radio, TV, newspapers) at least once a week.',
    data: [
      { segment: 'U1', value: 78, label: '78%' },
      { segment: 'U2', value: 72, label: '72%' },
      { segment: 'U3', value: 65, label: '65%' },
      { segment: 'U4', value: 58, label: '58%' },
      { segment: 'R2', value: 52, label: '52%' },
      { segment: 'R3.1', value: 45, label: '45%' },
      { segment: 'R3.2', value: 38, label: '38%' },
      { segment: 'R4', value: 32, label: '32%' }
    ],
    medianLine: 55
  },
  'female-circumcision': {
    title: 'Female circumcision',
    subtitle: 'Sample median',
    denominator: 'Women aged 15-49',
    description: 'The percentage of women who have undergone female genital mutilation/cutting.',
    data: [
      { segment: 'U1', value: 12, label: '12%' },
      { segment: 'U2', value: 18, label: '18%' },
      { segment: 'U3', value: 25, label: '25%' },
      { segment: 'U4', value: 32, label: '32%' },
      { segment: 'R2', value: 28, label: '28%' },
      { segment: 'R3.1', value: 35, label: '35%' },
      { segment: 'R3.2', value: 42, label: '42%' },
      { segment: 'R4', value: 48, label: '48%' }
    ],
    medianLine: 30
  },
  'media-exposure-internet': {
    title: 'Media exposure: internet',
    subtitle: 'Sample median',
    denominator: 'Women aged 15-49',
    description: 'The percentage of women who have used the internet in the last month.',
    data: [
      { segment: 'U1', value: 65, label: '65%' },
      { segment: 'U2', value: 52, label: '52%' },
      { segment: 'U3', value: 38, label: '38%' },
      { segment: 'U4', value: 25, label: '25%' },
      { segment: 'R2', value: 32, label: '32%' },
      { segment: 'R3.1', value: 18, label: '18%' },
      { segment: 'R3.2', value: 12, label: '12%' },
      { segment: 'R4', value: 8, label: '8%' }
    ],
    medianLine: 28
  },
  'age-at-first-birth': {
    title: 'Age at first birth',
    subtitle: 'Distribution by age group',
    denominator: 'Women aged 15-49 with at least one birth',
    description: 'Distribution of women by their age at first birth, showing the proportion in each age category.',
    chartType: 'stacked',
    categories: [
      { key: 'under20', label: 'Less than 20 years old', color: categoryColors.cat1 },
      { key: 'age20to29', label: '20 to 29 years old', color: categoryColors.cat2 },
      { key: 'age30plus', label: '30 years old or more', color: categoryColors.cat3 }
    ],
    data: [
      { segment: 'U1', under20: 25, age20to29: 55, age30plus: 20 },
      { segment: 'U2', under20: 32, age20to29: 52, age30plus: 16 },
      { segment: 'U3', under20: 38, age20to29: 48, age30plus: 14 },
      { segment: 'U4', under20: 45, age20to29: 44, age30plus: 11 },
      { segment: 'R2', under20: 42, age20to29: 46, age30plus: 12 },
      { segment: 'R3.1', under20: 48, age20to29: 42, age30plus: 10 },
      { segment: 'R3.2', under20: 52, age20to29: 40, age30plus: 8 },
      { segment: 'R4', under20: 58, age20to29: 36, age30plus: 6 }
    ]
  } as StackedChartDataSet,

  // Health mental models
  'hw-visit-last-yr': {
    title: 'HW visit in last yr',
    subtitle: 'Sample median',
    denominator: 'Women aged 15-49',
    description: 'The percentage of women who were visited by a health worker in the last 12 months.',
    data: [
      { segment: 'U1', value: 42, label: '42%' },
      { segment: 'U2', value: 38, label: '38%' },
      { segment: 'U3', value: 32, label: '32%' },
      { segment: 'U4', value: 28, label: '28%' },
      { segment: 'R2', value: 35, label: '35%' },
      { segment: 'R3.1', value: 25, label: '25%' },
      { segment: 'R3.2', value: 22, label: '22%' },
      { segment: 'R4', value: 18, label: '18%' }
    ],
    medianLine: 30
  },
  'access-problem-travel-alone': {
    title: 'Access problem: travel alone',
    subtitle: 'Sample median',
    denominator: 'Women aged 15-49',
    description: 'The percentage of women who report difficulty accessing healthcare due to having to travel alone.',
    data: [
      { segment: 'U1', value: 15, label: '15%' },
      { segment: 'U2', value: 22, label: '22%' },
      { segment: 'U3', value: 28, label: '28%' },
      { segment: 'U4', value: 35, label: '35%' },
      { segment: 'R2', value: 32, label: '32%' },
      { segment: 'R3.1', value: 42, label: '42%' },
      { segment: 'R3.2', value: 48, label: '48%' },
      { segment: 'R4', value: 55, label: '55%' }
    ],
    medianLine: 35
  },
  'preferred-birth-interval': {
    title: 'Preferred next birth interval',
    subtitle: 'Distribution by preference',
    denominator: 'Women aged 15-49',
    description: 'Distribution of women by their preferred interval before next birth.',
    chartType: 'stacked',
    categories: [
      { key: 'lessThan2', label: 'Less than two years (<2)', color: categoryColors.cat1 },
      { key: 'twoToFour', label: 'Two to four years (2-4)', color: categoryColors.cat2 },
      { key: 'fivePlus', label: 'Five or more years (5+)', color: categoryColors.cat3 },
      { key: 'noMore', label: 'No more children', color: categoryColors.cat4 },
      { key: 'dontKnow', label: 'Do not know', color: categoryColors.cat5 }
    ],
    data: [
      { segment: 'U1', lessThan2: 8, twoToFour: 35, fivePlus: 22, noMore: 28, dontKnow: 7 },
      { segment: 'U2', lessThan2: 10, twoToFour: 32, fivePlus: 20, noMore: 30, dontKnow: 8 },
      { segment: 'U3', lessThan2: 12, twoToFour: 30, fivePlus: 18, noMore: 32, dontKnow: 8 },
      { segment: 'U4', lessThan2: 15, twoToFour: 28, fivePlus: 15, noMore: 32, dontKnow: 10 },
      { segment: 'R2', lessThan2: 14, twoToFour: 28, fivePlus: 16, noMore: 34, dontKnow: 8 },
      { segment: 'R3.1', lessThan2: 18, twoToFour: 25, fivePlus: 14, noMore: 33, dontKnow: 10 },
      { segment: 'R3.2', lessThan2: 20, twoToFour: 24, fivePlus: 12, noMore: 32, dontKnow: 12 },
      { segment: 'R4', lessThan2: 22, twoToFour: 22, fivePlus: 10, noMore: 34, dontKnow: 12 }
    ]
  } as StackedChartDataSet,
  'partner-opposition-fp': {
    title: 'Partner opposition to FP use',
    subtitle: 'Distribution by partner attitude',
    denominator: 'Women aged 15-49 in union',
    description: 'Distribution of women by whether their partner opposes family planning use.',
    chartType: 'stacked',
    categories: [
      { key: 'opposes', label: 'Partner opposes', color: categoryColors.cat1 },
      { key: 'notOpposes', label: 'Partner does not oppose', color: categoryColors.cat2 },
      { key: 'noNeed', label: 'No identified need', color: categoryColors.cat3 }
    ],
    data: [
      { segment: 'U1', opposes: 12, notOpposes: 68, noNeed: 20 },
      { segment: 'U2', opposes: 18, notOpposes: 60, noNeed: 22 },
      { segment: 'U3', opposes: 25, notOpposes: 52, noNeed: 23 },
      { segment: 'U4', opposes: 32, notOpposes: 45, noNeed: 23 },
      { segment: 'R2', opposes: 28, notOpposes: 48, noNeed: 24 },
      { segment: 'R3.1', opposes: 35, notOpposes: 42, noNeed: 23 },
      { segment: 'R3.2', opposes: 40, notOpposes: 38, noNeed: 22 },
      { segment: 'R4', opposes: 45, notOpposes: 32, noNeed: 23 }
    ]
  } as StackedChartDataSet,

  // Household relationships
  'not-living-with-partner': {
    title: 'Not living w/ partner',
    subtitle: 'Sample median',
    denominator: 'Women aged 15-49 in union',
    description: 'The percentage of women who are not currently living with their partner.',
    data: [
      { segment: 'U1', value: 18, label: '18%' },
      { segment: 'U2', value: 22, label: '22%' },
      { segment: 'U3', value: 25, label: '25%' },
      { segment: 'U4', value: 28, label: '28%' },
      { segment: 'R2', value: 24, label: '24%' },
      { segment: 'R3.1', value: 30, label: '30%' },
      { segment: 'R3.2', value: 32, label: '32%' },
      { segment: 'R4', value: 35, label: '35%' }
    ],
    medianLine: 27
  },
  'decision-maker-fp': {
    title: 'Decision maker: family planning',
    subtitle: 'Distribution by decision maker',
    denominator: 'Women aged 15-49',
    description: 'Distribution of women by who makes decisions about family planning in their household.',
    chartType: 'stacked',
    categories: [
      { key: 'respondent', label: 'Respondent alone', color: categoryColors.cat1 },
      { key: 'partner', label: 'Husband / partner alone', color: categoryColors.cat2 },
      { key: 'joint', label: 'Respondent and husband/partner', color: categoryColors.cat3 },
      { key: 'pregnant', label: 'Currently pregnant', color: categoryColors.cat4 },
      { key: 'other', label: 'Other', color: categoryColors.cat5 },
      { key: 'noPartner', label: 'No partner', color: categoryColors.cat6 }
    ],
    data: [
      { segment: 'U1', respondent: 22, partner: 8, joint: 48, pregnant: 5, other: 2, noPartner: 15 },
      { segment: 'U2', respondent: 18, partner: 12, joint: 45, pregnant: 6, other: 3, noPartner: 16 },
      { segment: 'U3', respondent: 15, partner: 18, joint: 40, pregnant: 7, other: 4, noPartner: 16 },
      { segment: 'U4', respondent: 12, partner: 22, joint: 38, pregnant: 8, other: 5, noPartner: 15 },
      { segment: 'R2', respondent: 14, partner: 20, joint: 40, pregnant: 7, other: 4, noPartner: 15 },
      { segment: 'R3.1', respondent: 10, partner: 25, joint: 35, pregnant: 8, other: 6, noPartner: 16 },
      { segment: 'R3.2', respondent: 8, partner: 28, joint: 32, pregnant: 9, other: 7, noPartner: 16 },
      { segment: 'R4', respondent: 6, partner: 32, joint: 28, pregnant: 10, other: 8, noPartner: 16 }
    ]
  } as StackedChartDataSet,
  'decision-maker-hh-purchases': {
    title: 'Decision maker: HH purchases',
    subtitle: 'Distribution by decision maker',
    denominator: 'Women aged 15-49',
    description: 'Distribution of women by who makes decisions about large household purchases.',
    chartType: 'stacked',
    categories: [
      { key: 'respondent', label: 'Respondent alone', color: categoryColors.cat1 },
      { key: 'partner', label: 'Husband / partner alone', color: categoryColors.cat2 },
      { key: 'joint', label: 'Respondent and husband/partner', color: categoryColors.cat3 },
      { key: 'someoneElse', label: 'Someone else', color: categoryColors.cat4 },
      { key: 'other', label: 'Other', color: categoryColors.cat5 },
      { key: 'noPartner', label: 'No partner', color: categoryColors.cat6 }
    ],
    data: [
      { segment: 'U1', respondent: 18, partner: 15, joint: 45, someoneElse: 5, other: 2, noPartner: 15 },
      { segment: 'U2', respondent: 14, partner: 20, joint: 42, someoneElse: 6, other: 3, noPartner: 15 },
      { segment: 'U3', respondent: 12, partner: 25, joint: 38, someoneElse: 7, other: 4, noPartner: 14 },
      { segment: 'U4', respondent: 10, partner: 30, joint: 34, someoneElse: 8, other: 5, noPartner: 13 },
      { segment: 'R2', respondent: 11, partner: 28, joint: 36, someoneElse: 8, other: 4, noPartner: 13 },
      { segment: 'R3.1', respondent: 8, partner: 32, joint: 32, someoneElse: 10, other: 5, noPartner: 13 },
      { segment: 'R3.2', respondent: 6, partner: 35, joint: 28, someoneElse: 12, other: 6, noPartner: 13 },
      { segment: 'R4', respondent: 5, partner: 38, joint: 25, someoneElse: 14, other: 6, noPartner: 12 }
    ]
  } as StackedChartDataSet,
  'decision-maker-own-income': {
    title: 'Decision maker: own income',
    subtitle: 'Distribution by decision maker',
    denominator: 'Women aged 15-49 with earnings',
    description: 'Distribution of women by who makes decisions about how their earnings are used.',
    chartType: 'stacked',
    categories: [
      { key: 'respondent', label: 'Respondent alone', color: categoryColors.cat1 },
      { key: 'partner', label: 'Husband / partner alone', color: categoryColors.cat2 },
      { key: 'joint', label: 'Respondent and husband/partner', color: categoryColors.cat3 },
      { key: 'someoneElse', label: 'Someone else', color: categoryColors.cat4 },
      { key: 'other', label: 'Other', color: categoryColors.cat5 },
      { key: 'noPartner', label: 'No partner', color: categoryColors.cat6 }
    ],
    data: [
      { segment: 'U1', respondent: 35, partner: 8, joint: 38, someoneElse: 3, other: 2, noPartner: 14 },
      { segment: 'U2', respondent: 30, partner: 12, joint: 38, someoneElse: 4, other: 2, noPartner: 14 },
      { segment: 'U3', respondent: 25, partner: 16, joint: 36, someoneElse: 5, other: 3, noPartner: 15 },
      { segment: 'U4', respondent: 20, partner: 20, joint: 34, someoneElse: 7, other: 4, noPartner: 15 },
      { segment: 'R2', respondent: 22, partner: 18, joint: 35, someoneElse: 6, other: 4, noPartner: 15 },
      { segment: 'R3.1', respondent: 18, partner: 22, joint: 32, someoneElse: 8, other: 5, noPartner: 15 },
      { segment: 'R3.2', respondent: 15, partner: 25, joint: 30, someoneElse: 10, other: 5, noPartner: 15 },
      { segment: 'R4', respondent: 12, partner: 28, joint: 28, someoneElse: 12, other: 5, noPartner: 15 }
    ]
  } as StackedChartDataSet,
  'sex-head-of-hh': {
    title: 'Sex of the head of HH',
    subtitle: 'Distribution by sex',
    denominator: 'All households',
    description: 'Distribution of households by the sex of the household head.',
    chartType: 'stacked',
    categories: [
      { key: 'male', label: 'Male', color: categoryColors.cat1 },
      { key: 'female', label: 'Female', color: categoryColors.cat2 }
    ],
    data: [
      { segment: 'U1', male: 68, female: 32 },
      { segment: 'U2', male: 72, female: 28 },
      { segment: 'U3', male: 75, female: 25 },
      { segment: 'U4', male: 78, female: 22 },
      { segment: 'R2', male: 76, female: 24 },
      { segment: 'R3.1', male: 80, female: 20 },
      { segment: 'R3.2', male: 82, female: 18 },
      { segment: 'R4', male: 85, female: 15 }
    ]
  } as StackedChartDataSet,

  // Household economics and living conditions
  'bank-account-woman': {
    title: 'Bank account (woman)',
    subtitle: 'Sample median',
    denominator: 'Women aged 15-49',
    description: 'The percentage of women who have a bank account in their own name.',
    data: [
      { segment: 'U1', value: 62, label: '62%' },
      { segment: 'U2', value: 48, label: '48%' },
      { segment: 'U3', value: 35, label: '35%' },
      { segment: 'U4', value: 22, label: '22%' },
      { segment: 'R2', value: 28, label: '28%' },
      { segment: 'R3.1', value: 18, label: '18%' },
      { segment: 'R3.2', value: 12, label: '12%' },
      { segment: 'R4', value: 8, label: '8%' }
    ],
    medianLine: 28
  },
  'hh-clean-cooking-fuel': {
    title: 'HH clean cooking fuel',
    subtitle: 'Sample median',
    denominator: 'All households',
    description: 'The percentage of households using clean cooking fuel (electricity, LPG, natural gas, or biogas).',
    data: [
      { segment: 'U1', value: 72, label: '72%' },
      { segment: 'U2', value: 58, label: '58%' },
      { segment: 'U3', value: 42, label: '42%' },
      { segment: 'U4', value: 28, label: '28%' },
      { segment: 'R2', value: 22, label: '22%' },
      { segment: 'R3.1', value: 15, label: '15%' },
      { segment: 'R3.2', value: 10, label: '10%' },
      { segment: 'R4', value: 5, label: '5%' }
    ],
    medianLine: 28
  },
  'hh-electricity': {
    title: 'HH electricity',
    subtitle: 'Sample median',
    denominator: 'All households',
    description: 'The percentage of households with access to electricity.',
    data: [
      { segment: 'U1', value: 95, label: '95%' },
      { segment: 'U2', value: 88, label: '88%' },
      { segment: 'U3', value: 78, label: '78%' },
      { segment: 'U4', value: 65, label: '65%' },
      { segment: 'R2', value: 58, label: '58%' },
      { segment: 'R3.1', value: 45, label: '45%' },
      { segment: 'R3.2', value: 35, label: '35%' },
      { segment: 'R4', value: 22, label: '22%' }
    ],
    medianLine: 58
  },
  'hh-motor-transport': {
    title: 'HH motor transport',
    subtitle: 'Sample median',
    denominator: 'All households',
    description: 'The percentage of households owning a car, truck, or motorcycle.',
    data: [
      { segment: 'U1', value: 48, label: '48%' },
      { segment: 'U2', value: 38, label: '38%' },
      { segment: 'U3', value: 28, label: '28%' },
      { segment: 'U4', value: 18, label: '18%' },
      { segment: 'R2', value: 22, label: '22%' },
      { segment: 'R3.1', value: 15, label: '15%' },
      { segment: 'R3.2', value: 12, label: '12%' },
      { segment: 'R4', value: 8, label: '8%' }
    ],
    medianLine: 22
  },
  'hh-member-savings-club': {
    title: 'HH member of savings club',
    subtitle: 'Sample median',
    denominator: 'All households',
    description: 'The percentage of households with at least one member belonging to a savings club or group.',
    data: [
      { segment: 'U1', value: 32, label: '32%' },
      { segment: 'U2', value: 28, label: '28%' },
      { segment: 'U3', value: 25, label: '25%' },
      { segment: 'U4', value: 22, label: '22%' },
      { segment: 'R2', value: 35, label: '35%' },
      { segment: 'R3.1', value: 38, label: '38%' },
      { segment: 'R3.2', value: 40, label: '40%' },
      { segment: 'R4', value: 42, label: '42%' }
    ],
    medianLine: 32
  },

  // Social support
  'hh-member-without-insurance': {
    title: 'HH member w/o insurance',
    subtitle: 'Sample median',
    denominator: 'All households',
    description: 'The percentage of households with at least one member without health insurance coverage.',
    data: [
      { segment: 'U1', value: 35, label: '35%' },
      { segment: 'U2', value: 45, label: '45%' },
      { segment: 'U3', value: 55, label: '55%' },
      { segment: 'U4', value: 68, label: '68%' },
      { segment: 'R2', value: 62, label: '62%' },
      { segment: 'R3.1', value: 72, label: '72%' },
      { segment: 'R3.2', value: 78, label: '78%' },
      { segment: 'R4', value: 85, label: '85%' }
    ],
    medianLine: 62
  },

  // Human and natural systems
  'mobile-phone-finances': {
    title: 'Mobile phone used for finances',
    subtitle: 'Sample median',
    denominator: 'Women aged 15-49 with mobile phone',
    description: 'The percentage of women who have used a mobile phone for financial transactions.',
    data: [
      { segment: 'U1', value: 58, label: '58%' },
      { segment: 'U2', value: 48, label: '48%' },
      { segment: 'U3', value: 38, label: '38%' },
      { segment: 'U4', value: 28, label: '28%' },
      { segment: 'R2', value: 32, label: '32%' },
      { segment: 'R3.1', value: 22, label: '22%' },
      { segment: 'R3.2', value: 18, label: '18%' },
      { segment: 'R4', value: 12, label: '12%' }
    ],
    medianLine: 30
  },
  'hh-slum-residence': {
    title: 'HH slum residence (UN definition)',
    subtitle: 'Distribution by residence type',
    denominator: 'All households',
    description: 'Distribution of households by urban/rural residence and slum status.',
    chartType: 'stacked',
    categories: [
      { key: 'rural', label: 'Rural', color: categoryColors.cat1 },
      { key: 'urbanSlum', label: 'Urban', color: categoryColors.cat2 },
      { key: 'urbanNonSlum', label: 'Urban non-slum', color: categoryColors.cat3 }
    ],
    data: [
      { segment: 'U1', rural: 0, urbanSlum: 15, urbanNonSlum: 85 },
      { segment: 'U2', rural: 0, urbanSlum: 28, urbanNonSlum: 72 },
      { segment: 'U3', rural: 0, urbanSlum: 42, urbanNonSlum: 58 },
      { segment: 'U4', rural: 0, urbanSlum: 58, urbanNonSlum: 42 },
      { segment: 'R2', rural: 100, urbanSlum: 0, urbanNonSlum: 0 },
      { segment: 'R3.1', rural: 100, urbanSlum: 0, urbanNonSlum: 0 },
      { segment: 'R3.2', rural: 100, urbanSlum: 0, urbanNonSlum: 0 },
      { segment: 'R4', rural: 100, urbanSlum: 0, urbanNonSlum: 0 }
    ]
  } as StackedChartDataSet,
  'hh-water-source-interrupted': {
    title: 'HH water source interrupted',
    subtitle: 'Distribution by interruption status',
    denominator: 'All households',
    description: 'Distribution of households by whether their water source has been interrupted.',
    chartType: 'stacked',
    categories: [
      { key: 'yes', label: 'Yes', color: categoryColors.cat1 },
      { key: 'no', label: 'No', color: categoryColors.cat2 },
      { key: 'notPiped', label: 'Water not piped', color: categoryColors.cat3 }
    ],
    data: [
      { segment: 'U1', yes: 18, no: 72, notPiped: 10 },
      { segment: 'U2', yes: 25, no: 58, notPiped: 17 },
      { segment: 'U3', yes: 28, no: 45, notPiped: 27 },
      { segment: 'U4', yes: 32, no: 32, notPiped: 36 },
      { segment: 'R2', yes: 22, no: 38, notPiped: 40 },
      { segment: 'R3.1', yes: 18, no: 25, notPiped: 57 },
      { segment: 'R3.2', yes: 15, no: 18, notPiped: 67 },
      { segment: 'R4', yes: 12, no: 10, notPiped: 78 }
    ]
  } as StackedChartDataSet
};
