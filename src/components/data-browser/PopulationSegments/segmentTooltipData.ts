export interface SegmentDemographics {
  ageMedian: number;
  ageRange: string;
  partnerAgeMedian: number;
  partnerAgeRange: string;
  householdSize: number;
  birthCount: number;
}

export interface HealthOutcome {
  label: string;
  percentage: number;
  medianPercentage: number; // Sample median for the dotted line
}

export interface SegmentTooltipData {
  demographics: SegmentDemographics;
  healthOutcomes: HealthOutcome[];
}

// Sample median values (same across all segments for comparison)
const SAMPLE_MEDIANS = {
  healthCheck: 65,
  homeDelivery: 45,
  zeroDose: 15,
  childDeath: 12,
  noPNC: 25,
};

export const segmentTooltipData: Record<string, SegmentTooltipData> = {
  r2: {
    demographics: {
      ageMedian: 31,
      ageRange: '21 ~ 41',
      partnerAgeMedian: 34,
      partnerAgeRange: '27 ~ 49',
      householdSize: 5,
      birthCount: 3,
    },
    healthOutcomes: [
      { label: 'Woman had a health check after last birth', percentage: 73, medianPercentage: SAMPLE_MEDIANS.healthCheck },
      { label: 'Latest birth delivered at home', percentage: 65, medianPercentage: SAMPLE_MEDIANS.homeDelivery },
      { label: 'Zero-dose child', percentage: 21, medianPercentage: SAMPLE_MEDIANS.zeroDose },
      { label: 'Death of a child', percentage: 9, medianPercentage: SAMPLE_MEDIANS.childDeath },
      { label: 'No PNC for mother', percentage: 19, medianPercentage: SAMPLE_MEDIANS.noPNC },
    ],
  },
  'r3.1': {
    demographics: {
      ageMedian: 28,
      ageRange: '19 ~ 38',
      partnerAgeMedian: 36,
      partnerAgeRange: '28 ~ 52',
      householdSize: 7,
      birthCount: 4,
    },
    healthOutcomes: [
      { label: 'Woman had a health check after last birth', percentage: 45, medianPercentage: SAMPLE_MEDIANS.healthCheck },
      { label: 'Latest birth delivered at home', percentage: 78, medianPercentage: SAMPLE_MEDIANS.homeDelivery },
      { label: 'Zero-dose child', percentage: 35, medianPercentage: SAMPLE_MEDIANS.zeroDose },
      { label: 'Death of a child', percentage: 18, medianPercentage: SAMPLE_MEDIANS.childDeath },
      { label: 'No PNC for mother', percentage: 42, medianPercentage: SAMPLE_MEDIANS.noPNC },
    ],
  },
  'r3.2': {
    demographics: {
      ageMedian: 29,
      ageRange: '20 ~ 39',
      partnerAgeMedian: 35,
      partnerAgeRange: '26 ~ 50',
      householdSize: 6,
      birthCount: 4,
    },
    healthOutcomes: [
      { label: 'Woman had a health check after last birth', percentage: 52, medianPercentage: SAMPLE_MEDIANS.healthCheck },
      { label: 'Latest birth delivered at home', percentage: 71, medianPercentage: SAMPLE_MEDIANS.homeDelivery },
      { label: 'Zero-dose child', percentage: 28, medianPercentage: SAMPLE_MEDIANS.zeroDose },
      { label: 'Death of a child', percentage: 15, medianPercentage: SAMPLE_MEDIANS.childDeath },
      { label: 'No PNC for mother', percentage: 35, medianPercentage: SAMPLE_MEDIANS.noPNC },
    ],
  },
  r4: {
    demographics: {
      ageMedian: 26,
      ageRange: '18 ~ 36',
      partnerAgeMedian: 38,
      partnerAgeRange: '29 ~ 55',
      householdSize: 8,
      birthCount: 5,
    },
    healthOutcomes: [
      { label: 'Woman had a health check after last birth', percentage: 32, medianPercentage: SAMPLE_MEDIANS.healthCheck },
      { label: 'Latest birth delivered at home', percentage: 85, medianPercentage: SAMPLE_MEDIANS.homeDelivery },
      { label: 'Zero-dose child', percentage: 48, medianPercentage: SAMPLE_MEDIANS.zeroDose },
      { label: 'Death of a child', percentage: 24, medianPercentage: SAMPLE_MEDIANS.childDeath },
      { label: 'No PNC for mother', percentage: 55, medianPercentage: SAMPLE_MEDIANS.noPNC },
    ],
  },
  u1: {
    demographics: {
      ageMedian: 32,
      ageRange: '23 ~ 42',
      partnerAgeMedian: 36,
      partnerAgeRange: '28 ~ 48',
      householdSize: 4,
      birthCount: 2,
    },
    healthOutcomes: [
      { label: 'Woman had a health check after last birth', percentage: 89, medianPercentage: SAMPLE_MEDIANS.healthCheck },
      { label: 'Latest birth delivered at home', percentage: 12, medianPercentage: SAMPLE_MEDIANS.homeDelivery },
      { label: 'Zero-dose child', percentage: 5, medianPercentage: SAMPLE_MEDIANS.zeroDose },
      { label: 'Death of a child', percentage: 4, medianPercentage: SAMPLE_MEDIANS.childDeath },
      { label: 'No PNC for mother', percentage: 8, medianPercentage: SAMPLE_MEDIANS.noPNC },
    ],
  },
  'u2.1': {
    demographics: {
      ageMedian: 30,
      ageRange: '22 ~ 40',
      partnerAgeMedian: 34,
      partnerAgeRange: '26 ~ 46',
      householdSize: 5,
      birthCount: 3,
    },
    healthOutcomes: [
      { label: 'Woman had a health check after last birth', percentage: 78, medianPercentage: SAMPLE_MEDIANS.healthCheck },
      { label: 'Latest birth delivered at home', percentage: 25, medianPercentage: SAMPLE_MEDIANS.homeDelivery },
      { label: 'Zero-dose child', percentage: 12, medianPercentage: SAMPLE_MEDIANS.zeroDose },
      { label: 'Death of a child', percentage: 7, medianPercentage: SAMPLE_MEDIANS.childDeath },
      { label: 'No PNC for mother', percentage: 15, medianPercentage: SAMPLE_MEDIANS.noPNC },
    ],
  },
  'u2.2': {
    demographics: {
      ageMedian: 29,
      ageRange: '21 ~ 39',
      partnerAgeMedian: 33,
      partnerAgeRange: '25 ~ 45',
      householdSize: 5,
      birthCount: 3,
    },
    healthOutcomes: [
      { label: 'Woman had a health check after last birth', percentage: 75, medianPercentage: SAMPLE_MEDIANS.healthCheck },
      { label: 'Latest birth delivered at home', percentage: 28, medianPercentage: SAMPLE_MEDIANS.homeDelivery },
      { label: 'Zero-dose child', percentage: 14, medianPercentage: SAMPLE_MEDIANS.zeroDose },
      { label: 'Death of a child', percentage: 8, medianPercentage: SAMPLE_MEDIANS.childDeath },
      { label: 'No PNC for mother', percentage: 18, medianPercentage: SAMPLE_MEDIANS.noPNC },
    ],
  },
  u4: {
    demographics: {
      ageMedian: 27,
      ageRange: '19 ~ 37',
      partnerAgeMedian: 35,
      partnerAgeRange: '27 ~ 50',
      householdSize: 6,
      birthCount: 4,
    },
    healthOutcomes: [
      { label: 'Woman had a health check after last birth', percentage: 48, medianPercentage: SAMPLE_MEDIANS.healthCheck },
      { label: 'Latest birth delivered at home', percentage: 55, medianPercentage: SAMPLE_MEDIANS.homeDelivery },
      { label: 'Zero-dose child', percentage: 32, medianPercentage: SAMPLE_MEDIANS.zeroDose },
      { label: 'Death of a child', percentage: 16, medianPercentage: SAMPLE_MEDIANS.childDeath },
      { label: 'No PNC for mother', percentage: 38, medianPercentage: SAMPLE_MEDIANS.noPNC },
    ],
  },
};
