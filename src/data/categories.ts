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
        id: 'sexual-reproductive-health',
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
        items: [
          { id: 'any-media-exposure', label: 'Any media exposure' },
          { id: 'female-circumcision', label: 'Female circumcision' },
          { id: 'media-exposure-internet', label: 'Media exposure: internet' },
          { id: 'age-at-first-birth', label: 'Age at first birth' }
        ]
      },
      {
        id: 'health-mental',
        label: 'Health mental models',
        items: [
          { id: 'hw-visit-last-yr', label: 'HW visit in last yr' },
          { id: 'access-problem-travel-alone', label: 'Access problem: travel alone' },
          { id: 'preferred-birth-interval', label: 'Preferred next birth interval' },
          { id: 'partner-opposition-fp', label: 'Partner opposition to FP use' }
        ]
      },
      {
        id: 'household-relationships',
        label: 'Household relationships',
        items: [
          { id: 'not-living-with-partner', label: 'Not living w/ partner' },
          { id: 'decision-maker-fp', label: 'Decision maker: family planning' },
          { id: 'decision-maker-hh-purchases', label: 'Decision maker: HH purchases' },
          { id: 'decision-maker-own-income', label: 'Decision maker: own income' },
          { id: 'sex-head-of-hh', label: 'Sex of the head of HH' }
        ]
      },
      {
        id: 'household-economics',
        label: 'Household economics and living conditions',
        items: [
          { id: 'bank-account-woman', label: 'Bank account (woman)' },
          { id: 'hh-clean-cooking-fuel', label: 'HH clean cooking fuel' },
          { id: 'hh-electricity', label: 'HH electricity' },
          { id: 'hh-motor-transport', label: 'HH motor transport' },
          { id: 'hh-member-savings-club', label: 'HH member of savings club' }
        ]
      },
      {
        id: 'social-support',
        label: 'Social support',
        items: [
          { id: 'hh-member-without-insurance', label: 'HH member w/o insurance' }
        ]
      },
      {
        id: 'human-natural',
        label: 'Human and natural systems',
        items: [
          { id: 'mobile-phone-finances', label: 'Mobile phone used for finances' },
          { id: 'hh-slum-residence', label: 'HH slum residence (UN definition)' },
          { id: 'hh-water-source-interrupted', label: 'HH water source interrupted' }
        ]
      },
      {
        id: 'child-health',
        label: 'Child health',
        items: [
          { id: 'hh-clean-cooking-fuel-ch', label: 'HH clean cooking fuel' },
          { id: 'hh-electricity-ch', label: 'HH electricity' },
          { id: 'hh-water-source-interrupted-ch', label: 'HH water source interrupted' },
          { id: 'hh-slum-residence-ch', label: 'HH slum residence (UN definition)' }
        ]
      },
      {
        id: 'immunisation',
        label: 'Immunisation',
        items: [
          { id: 'access-problem-travel-alone-im', label: 'Access problem: travel alone' },
          { id: 'hw-visit-last-yr-im', label: 'HW visit in last yr' },
          { id: 'any-media-exposure-im', label: 'Any media exposure' },
          { id: 'media-exposure-internet-im', label: 'Media exposure: internet' }
        ]
      },
      {
        id: 'maternal-health',
        label: 'Maternal health',
        items: [
          { id: 'age-at-first-birth-mh', label: 'Age at first birth' },
          { id: 'not-living-with-partner-mh', label: 'Not living w/ partner' },
          { id: 'female-circumcision-mh', label: 'Female circumcision' },
          { id: 'access-problem-travel-alone-mh', label: 'Access problem: travel alone' },
          { id: 'hw-visit-last-yr-mh', label: 'HW visit in last yr' }
        ]
      },
      {
        id: 'nutrition',
        label: 'Nutrition',
        items: [
          { id: 'bank-account-woman-nu', label: 'Bank account (woman)' },
          { id: 'mobile-phone-finances-nu', label: 'Mobile phone used for finances' },
          { id: 'hh-member-without-insurance-nu', label: 'HH member w/o insurance' },
          { id: 'hh-clean-cooking-fuel-nu', label: 'HH clean cooking fuel' },
          { id: 'hh-water-source-interrupted-nu', label: 'HH water source interrupted' }
        ]
      },
      {
        id: 'sexual-reproductive-health',
        label: 'Sexual and reproductive health',
        items: [
          { id: 'partner-opposition-fp-sr', label: 'Partner opposition to FP use' },
          { id: 'decision-maker-fp-sr', label: 'Decision maker: family planning' },
          { id: 'preferred-birth-interval-sr', label: 'Preferred next birth interval' },
          { id: 'not-living-with-partner-sr', label: 'Not living w/ partner' },
          { id: 'female-circumcision-sr', label: 'Female circumcision' },
          { id: 'any-media-exposure-sr', label: 'Any media exposure' },
          { id: 'media-exposure-internet-sr', label: 'Media exposure: internet' }
        ]
      }
    ]
  }
];
