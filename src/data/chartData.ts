import type { ChartDataSet } from '../types/chartData';

export const chartDataSets: Record<string, ChartDataSet> = {
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
  }
};
