import type { DataCategory } from '../types/dataCategory';

export const dataCategories: DataCategory[] = [
  {
    id: 'health-outcomes',
    label: 'Health outcomes and behaviours',
    subcategories: [
      {
        id: 'child-health',
        label: 'Child health',
        items: [
          { id: 'any-child-no-fever-cough-care', label: 'Any child no fever/cough care' },
          { id: 'cough-2-weeks-last', label: 'Cough 2 weeks last' },
          { id: 'death-child-1yr', label: 'Death of a child before 1 yr' },
          { id: 'death-child-5yrs', label: 'Death of a child before 5 yrs' },
          { id: 'diarrhea-2-weeks-last', label: 'Diarrhea 2 weeks last' },
          { id: 'fever-2-weeks-last', label: 'Fever 2 weeks last' },
          { id: 'low-birth-weight-last', label: 'Low birth weight last' },
          { id: 'no-pnc-newborn', label: 'No PNC for newborn' }
        ]
      },
      {
        id: 'immunisation',
        label: 'Immunisation',
        items: [
          { id: 'child-not-immunized-polio', label: 'Child not immunized - polio' },
          { id: 'no-routine-vaccination', label: 'No routine vaccination' },
          { id: 'number-not-immunized-mmr', label: 'Number not immunized - MMR' },
          { id: 'vaccination-documentation', label: 'Vaccination documentation' },
          { id: 'zero-dose-child', label: 'Zero-dose child' }
        ]
      },
      {
        id: 'maternal-health',
        label: 'Maternal health',
        items: [
          { id: 'latest-birth-delivered-home', label: 'Latest birth delivered at home' },
          { id: 'less-than-4-anc-visits-last', label: 'Less than 4 ANC visits last' },
          { id: 'no-anc-1st-trimester-last', label: 'No ANC 1st trimester last' },
          { id: 'received-pnc', label: 'Received PNC' }
        ]
      },
      {
        id: 'nutrition',
        label: 'Nutrition',
        items: [
          { id: 'any-child-not-immediately-breastfed', label: 'Any child not immediately breastfed' },
          { id: 'child-not-exclusively-breastfed', label: 'Child not exclusively breastfed' },
          { id: 'stunted-child', label: 'Stunted child' },
          { id: 'wasted-child', label: 'Wasted child' },
          { id: 'woman-underweight', label: 'Woman is underweight' }
        ]
      },
      {
        id: 'sexual-reproductive',
        label: 'Sexual and reproductive health',
        items: [
          { id: 'never-tested-hiv', label: 'Never tested for HIV' },
          { id: 'never-used-modern-fp-method', label: 'Never used modern FP method' },
          { id: 'non-use-modern-fp-method', label: 'Non-use of modern FP method' },
          { id: 'sti-last-12-months', label: 'STI in the last 12 months' }
        ]
      }
    ]
  },
  {
    id: 'vulnerability-factors',
    label: 'Vulnerability factors',
    subcategories: [
      {
        id: 'woman-experiences',
        label: 'Woman and her past experiences',
        items: []
      },
      {
        id: 'health-mental',
        label: 'Health mental models',
        items: []
      },
      {
        id: 'household-relationships',
        label: 'Household relationships',
        items: []
      },
      {
        id: 'household-economics',
        label: 'Household economics and living conditions',
        items: []
      },
      {
        id: 'social-support',
        label: 'Social support',
        items: []
      },
      {
        id: 'human-natural',
        label: 'Human and natural systems',
        items: []
      }
    ]
  }
];
