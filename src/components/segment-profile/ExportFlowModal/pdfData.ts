// ── PDF dummy data ──
// Each entry maps a data item ID (from AddDataModal) to the chart data
// needed to render it in the PDF export.

export type BinaryChartData = {
  chartType: 'binary';
  value: number;       // segment % (0–100)
  median: number;      // national median % (0–100)
  color: string;
};

export type CategoricalChartData = {
  chartType: 'categorical';
  segments: { label: string; value: number; color: string }[];
};

export type PdfChartData = BinaryChartData | CategoricalChartData;

export interface PdfDataItem {
  id: string;
  label: string;
  type: 'health' | 'vulnerability';
  category: string;        // human-readable section label
  data: PdfChartData;
}

// ── Colours ──
const C1 = '#88c1fd'; // categorical-1 blue
const C2 = '#af73c8'; // categorical-2 purple
const C3 = '#66c2a5'; // categorical-3 teal
const C4 = '#fb8686'; // categorical-4 red
const C5 = '#ffd92f'; // categorical-5 yellow
const C6 = '#8da0cb'; // categorical-6 slate (vulnerability bars)

// ── Health outcomes section label ──
export const HEALTH_SECTION_LABEL = 'Health outcomes and behaviours';
export const VULNERABILITY_SECTION_LABEL = 'Vulnerability factors';

// ── All PDF data items ──
export const PDF_DATA_ITEMS: PdfDataItem[] = [
  // ─ Health outcomes ─
  { id: 'h1',  label: 'Less than 4 ANC visits',             type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 52, median: 34, color: C1 } },
  { id: 'h2',  label: 'No PNC for newborn',                  type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 61, median: 28, color: C1 } },
  { id: 'h3',  label: 'Never breastfed',                     type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 14, median: 5,  color: C1 } },
  { id: 'h4',  label: 'Pregnancy ended in stillbirth',       type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 11, median: 5,  color: C1 } },
  { id: 'h5',  label: 'Death of a child before 1 yr',        type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 18, median: 8,  color: C1 } },
  { id: 'h6',  label: 'Death of a child before 5 yrs',       type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 27, median: 12, color: C1 } },
  { id: 'h7',  label: 'No current modern FP use',            type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 74, median: 48, color: C1 } },
  { id: 'h8',  label: 'Latest birth delivered at home',      type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 22, median: 14, color: C1 } },
  { id: 'h9',  label: 'Not fully immunized with DPT',        type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 38, median: 21, color: C1 } },
  { id: 'h10', label: 'Not immunized with MMR',              type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 24, median: 15, color: C1 } },
  { id: 'h11', label: 'Not immunized with polio',            type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 19, median: 10, color: C1 } },
  { id: 'h12', label: 'Zero-dose child',                     type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 29, median: 15, color: C1 } },
  { id: 'h13', label: 'Overweight child',                    type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 4,  median: 7,  color: C1 } },
  { id: 'h14', label: 'Stunted child',                       type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 43, median: 26, color: C1 } },
  { id: 'h15', label: 'Underweight child',                   type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 6,  median: 17, color: C1 } },
  { id: 'h16', label: 'Wasted child',                        type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 15, median: 9,  color: C1 } },
  { id: 'h17', label: 'No. of children who have died',       type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 31, median: 14, color: C1 } },
  { id: 'h18', label: 'No. of children who have died (3 category)', type: 'health', category: HEALTH_SECTION_LABEL,
    data: { chartType: 'categorical', segments: [
      { label: 'None',   value: 62, color: C1 },
      { label: 'One',    value: 23, color: C2 },
      { label: 'Two+',   value: 15, color: C3 },
    ]}
  },
  { id: 'h19', label: 'Death of a child',                    type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 34, median: 15, color: C1 } },
  { id: 'h20', label: 'No PNC for mother',                   type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 78, median: 41, color: C1 } },
  { id: 'h21', label: 'Diarrhea 2 weeks last',               type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 22, median: 14, color: C1 } },
  { id: 'h22', label: 'Fever 2 weeks last',                  type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 28, median: 18, color: C1 } },
  { id: 'h23', label: 'Low birth weight',                    type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 13, median: 8,  color: C1 } },
  { id: 'h24', label: 'No routine vaccination',              type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 31, median: 17, color: C1 } },
  { id: 'h25', label: 'Vaccination docs',                    type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 44, median: 62, color: C1 } },
  { id: 'h26', label: 'No ANC 1st trimester',               type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 67, median: 38, color: C1 } },
  { id: 'h27', label: 'Received PNC',                        type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 29, median: 55, color: C1 } },
  { id: 'h28', label: 'Not exclusively breastfed',           type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 41, median: 28, color: C1 } },
  { id: 'h29', label: 'Not immediately breastfed',           type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 36, median: 22, color: C1 } },
  { id: 'h30', label: 'Never tested for HIV',                type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 58, median: 31, color: C1 } },
  { id: 'h31', label: 'Never used modern FP',               type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 71, median: 42, color: C1 } },
  { id: 'h32', label: 'STI last 12 months',                  type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 8,  median: 5,  color: C1 } },
  { id: 'h33', label: 'Woman underweight',                   type: 'health', category: HEALTH_SECTION_LABEL, data: { chartType: 'binary', value: 17, median: 11, color: C1 } },

  // ─ Vulnerability factors ─
  { id: 'v1',  label: 'Any media exposure',                  type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 21, median: 47, color: C6 } },
  { id: 'v3',  label: 'Bank account (woman)',                type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 8,  median: 31, color: C6 } },
  { id: 'v4',  label: 'HH clean cooking fuel',              type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 3,  median: 22, color: C6 } },
  { id: 'v5',  label: 'HH electricity',                     type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 9,  median: 38, color: C6 } },
  { id: 'v6',  label: 'HH motor transport',                 type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 11, median: 24, color: C6 } },
  { id: 'v7',  label: 'HH member of savings club',          type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 14, median: 28, color: C6 } },
  { id: 'v8',  label: 'HW visit in last yr',                type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 33, median: 41, color: C6 } },
  { id: 'v9',  label: 'Media exposure: internet',           type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 4,  median: 19, color: C6 } },
  { id: 'v10', label: 'Access problem: travel alone',       type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 62, median: 38, color: C6 } },
  { id: 'v11', label: 'Mobile phone used for finances',     type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 7,  median: 22, color: C6 } },
  { id: 'v12', label: 'Not living w/ partner',              type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 18, median: 27, color: C6 } },
  { id: 'v13', label: 'Currently employed',                 type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 29, median: 44, color: C6 } },
  { id: 'v14', label: 'Age at first birth (3 category)',    type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL,
    data: { chartType: 'categorical', segments: [
      { label: 'Under 18', value: 48, color: C1 },
      { label: '18–24',    value: 41, color: C2 },
      { label: '25+',      value: 11, color: C3 },
    ]}
  },
  { id: 'v15', label: 'Age at first sex (4 category)',      type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL,
    data: { chartType: 'categorical', segments: [
      { label: 'Under 15', value: 31, color: C1 },
      { label: '15–17',    value: 38, color: C2 },
      { label: '18–19',    value: 19, color: C3 },
      { label: '20+',      value: 12, color: C4 },
    ]}
  },
  { id: 'v16', label: 'Decision maker: family planning',    type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL,
    data: { chartType: 'categorical', segments: [
      { label: 'Woman alone', value: 12, color: C1 },
      { label: 'Jointly',     value: 29, color: C2 },
      { label: 'Partner',     value: 51, color: C3 },
      { label: 'Other',       value: 8,  color: C4 },
    ]}
  },
  { id: 'v17', label: 'Decision maker: HH purchases',      type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL,
    data: { chartType: 'categorical', segments: [
      { label: 'Woman alone', value: 9,  color: C1 },
      { label: 'Jointly',     value: 34, color: C2 },
      { label: 'Partner',     value: 54, color: C3 },
      { label: 'Other',       value: 3,  color: C4 },
    ]}
  },
  { id: 'v18', label: 'Decision maker: own income',        type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL,
    data: { chartType: 'categorical', segments: [
      { label: 'Woman alone', value: 22, color: C1 },
      { label: 'Jointly',     value: 41, color: C2 },
      { label: 'Partner',     value: 37, color: C3 },
    ]}
  },
  { id: 'v19', label: 'Educational attainment',            type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL,
    data: { chartType: 'categorical', segments: [
      { label: 'No school',                  value: 58, color: C1 },
      { label: 'Incomplete primary/primary', value: 29, color: C2 },
      { label: 'Secondary',                  value: 11, color: C3 },
      { label: 'Higher',                     value: 2,  color: C5 },
    ]}
  },
  { id: 'v20', label: 'Preferred next birth interval',     type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL,
    data: { chartType: 'categorical', segments: [
      { label: 'Soon',    value: 18, color: C1 },
      { label: '1–2 yrs', value: 31, color: C2 },
      { label: '3+ yrs',  value: 51, color: C3 },
    ]}
  },
  { id: 'v21', label: 'Partner opposition to FP use',      type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 44, median: 22, color: C6 } },
  { id: 'v22', label: 'Sex of the head of HH',             type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL,
    data: { chartType: 'categorical', segments: [
      { label: 'Female', value: 28, color: C1 },
      { label: 'Male',   value: 72, color: C2 },
    ]}
  },
  { id: 'v23', label: 'HH received money',                 type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 19, median: 31, color: C6 } },
  { id: 'v24', label: 'HH slum residence (UN definition)', type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 6,  median: 14, color: C6 } },
  { id: 'v25', label: 'HH water source interrupted',       type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 38, median: 21, color: C6 } },
  { id: 'v26', label: 'Joint decision making index',       type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 24, median: 41, color: C6 } },
  { id: 'v27', label: 'HH in malaria zone',                type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 71, median: 48, color: C6 } },
  { id: 'v28', label: 'Marital status',                    type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL,
    data: { chartType: 'categorical', segments: [
      { label: 'Married',         value: 67, color: C1 },
      { label: 'In relationship', value: 11, color: C2 },
      { label: 'Widowed',         value: 9,  color: C3 },
      { label: 'Other',           value: 13, color: C4 },
    ]}
  },
  { id: 'v29', label: 'No. <5 yrs in HH (4 category)',    type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL,
    data: { chartType: 'categorical', segments: [
      { label: '0',    value: 22, color: C1 },
      { label: '1',    value: 31, color: C2 },
      { label: '2',    value: 28, color: C3 },
      { label: '3+',   value: 19, color: C4 },
    ]}
  },
  { id: 'v30', label: 'Total lifetime sex partners',       type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 33, median: 27, color: C6 } },
  { id: 'v31', label: 'Wife rank',                         type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL,
    data: { chartType: 'categorical', segments: [
      { label: '1st wife',  value: 61, color: C1 },
      { label: '2nd wife',  value: 27, color: C2 },
      { label: '3rd+ wife', value: 12, color: C3 },
    ]}
  },
  { id: 'v32', label: 'Employment continuity',             type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 27, median: 41, color: C6 } },
  { id: 'v33', label: 'Education level (partner)',         type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL,
    data: { chartType: 'categorical', segments: [
      { label: 'No school',  value: 41, color: C1 },
      { label: 'Primary',    value: 33, color: C2 },
      { label: 'Secondary',  value: 19, color: C3 },
      { label: 'Higher',     value: 7,  color: C5 },
    ]}
  },
  { id: 'v34', label: 'Employment status',                 type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL,
    data: { chartType: 'categorical', segments: [
      { label: 'Not employed',  value: 54, color: C1 },
      { label: 'Part-time',     value: 22, color: C2 },
      { label: 'Full-time',     value: 24, color: C3 },
    ]}
  },
  { id: 'v35', label: 'IPV justification',                 type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 58, median: 34, color: C6 } },
  { id: 'v36', label: 'Religion',                          type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL,
    data: { chartType: 'categorical', segments: [
      { label: 'Islam',       value: 71, color: C1 },
      { label: 'Christianity', value: 22, color: C2 },
      { label: 'Other',       value: 7,  color: C3 },
    ]}
  },
  { id: 'v37', label: 'Age at first cohabitation (3 category)', type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL,
    data: { chartType: 'categorical', segments: [
      { label: 'Under 18', value: 44, color: C1 },
      { label: '18–24',    value: 43, color: C2 },
      { label: '25+',      value: 13, color: C3 },
    ]}
  },
  { id: 'v38', label: 'Age at first birth',                type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 48, median: 28, color: C6 } },
  { id: 'v39', label: 'Age at first cohabitation',         type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 44, median: 31, color: C6 } },
  { id: 'v40', label: 'Age at first sex',                  type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 36, median: 22, color: C6 } },
  { id: 'v41', label: 'Child given beans/peas/lentils',    type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 44, median: 58, color: C6 } },
  { id: 'v42', label: 'Child given fortified food',        type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 18, median: 33, color: C6 } },
  { id: 'v43', label: 'Child given meat',                  type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 31, median: 47, color: C6 } },
  { id: 'v44', label: 'Child given solid/soft food',       type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 62, median: 71, color: C6 } },
  { id: 'v45', label: 'Child given sweet snacks',          type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 28, median: 41, color: C6 } },
  { id: 'v46', label: 'Decision maker: family visits',     type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL,
    data: { chartType: 'categorical', segments: [
      { label: 'Woman alone', value: 14, color: C1 },
      { label: 'Jointly',     value: 37, color: C2 },
      { label: 'Partner',     value: 49, color: C3 },
    ]}
  },
  { id: 'v47', label: 'Child treated for diarrhea',        type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 41, median: 54, color: C6 } },
  { id: 'v48', label: 'HH member w/ disability',           type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 32, median: 21, color: C6 } },
  { id: 'v49', label: 'Earnings relative to partner',      type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL,
    data: { chartType: 'categorical', segments: [
      { label: 'Less',   value: 58, color: C1 },
      { label: 'Same',   value: 27, color: C2 },
      { label: 'More',   value: 15, color: C3 },
    ]}
  },
  { id: 'v50', label: 'At least primary education',        type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 13, median: 44, color: C6 } },
  { id: 'v51', label: 'Educational attainment (binary)',   type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 13, median: 44, color: C6 } },
  { id: 'v52', label: 'Fertility preference',              type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL,
    data: { chartType: 'categorical', segments: [
      { label: 'Wants more',   value: 61, color: C1 },
      { label: 'Undecided',    value: 14, color: C2 },
      { label: 'No more',      value: 25, color: C3 },
    ]}
  },
  { id: 'v53', label: 'Media exposure: news/journal',      type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 4,  median: 17, color: C6 } },
  { id: 'v54', label: 'Media exposure: radio',             type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 28, median: 44, color: C6 } },
  { id: 'v58', label: 'HH received other state support',   type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 11, median: 19, color: C6 } },
  { id: 'v59', label: 'HH car',                            type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 3,  median: 12, color: C6 } },
  { id: 'v60', label: 'HH animal-drawn cart',              type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 8,  median: 6,  color: C6 } },
  { id: 'v61', label: 'HH internet',                       type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 4,  median: 14, color: C6 } },
  { id: 'v62', label: 'HH child to woman ratio',           type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 41, median: 28, color: C6 } },
  { id: 'v63', label: 'HH motorcycle or scooter',          type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 14, median: 21, color: C6 } },
  { id: 'v64', label: 'Age at first birth (5 category)',   type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL,
    data: { chartType: 'categorical', segments: [
      { label: 'Under 15', value: 18, color: C1 },
      { label: '15–17',    value: 30, color: C2 },
      { label: '18–19',    value: 27, color: C3 },
      { label: '20–24',    value: 19, color: C4 },
      { label: '25+',      value: 6,  color: C5 },
    ]}
  },
  { id: 'v66', label: 'HH rudimentary or natural floor',   type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 74, median: 41, color: C6 } },
  { id: 'v67', label: 'Any birth registered/declared',     type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 22, median: 47, color: C6 } },
  { id: 'v68', label: 'HH water not treated',              type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 68, median: 44, color: C6 } },
  { id: 'v69', label: 'HH radio',                          type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 31, median: 48, color: C6 } },
  { id: 'v70', label: 'Condom use during last sex',        type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 7,  median: 18, color: C6 } },
  { id: 'v71', label: "Decision maker: woman's health",    type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL,
    data: { chartType: 'categorical', segments: [
      { label: 'Woman alone', value: 17, color: C1 },
      { label: 'Jointly',     value: 38, color: C2 },
      { label: 'Partner',     value: 45, color: C3 },
    ]}
  },
  { id: 'v72', label: 'HH refrigerator',                   type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 4,  median: 21, color: C6 } },
  { id: 'v73', label: 'HH sanitation (3 category)',        type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL,
    data: { chartType: 'categorical', segments: [
      { label: 'None/open', value: 48, color: C1 },
      { label: 'Unimproved', value: 31, color: C2 },
      { label: 'Improved',   value: 21, color: C3 },
    ]}
  },
  { id: 'v74', label: "Provider for woman's PNC",          type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL,
    data: { chartType: 'categorical', segments: [
      { label: 'None',        value: 42, color: C1 },
      { label: 'Traditional', value: 28, color: C2 },
      { label: 'Skilled',     value: 30, color: C3 },
    ]}
  },
  { id: 'v75', label: 'HH member sends money',             type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 18, median: 27, color: C6 } },
  { id: 'v76', label: 'HH shares toilet',                  type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 54, median: 38, color: C6 } },
  { id: 'v77', label: 'HH stove',                          type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 22, median: 44, color: C6 } },
  { id: 'v78', label: 'HH television',                     type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 6,  median: 31, color: C6 } },
  { id: 'v82', label: 'Media exposure: TV',                type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 6,  median: 28, color: C6 } },
  { id: 'v83', label: 'Phone ownership (woman)',           type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 28, median: 47, color: C6 } },
  { id: 'v84', label: 'HH highest education',              type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL,
    data: { chartType: 'categorical', segments: [
      { label: 'No school',  value: 37, color: C1 },
      { label: 'Primary',    value: 34, color: C2 },
      { label: 'Secondary',  value: 21, color: C3 },
      { label: 'Higher',     value: 8,  color: C5 },
    ]}
  },
  { id: 'v85', label: 'HH owns animals',                   type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 58, median: 42, color: C6 } },
  { id: 'v86', label: 'Bank account (household)',          type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 11, median: 34, color: C6 } },
  { id: 'v87', label: 'HH bicycle',                        type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 17, median: 28, color: C6 } },
  { id: 'v88', label: 'Fecundity status',                  type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 44, median: 38, color: C6 } },
  { id: 'v89', label: 'Family security grants',            type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 14, median: 22, color: C6 } },
  { id: 'v90', label: 'HH computer',                       type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 2,  median: 9,  color: C6 } },
  { id: 'v91', label: 'Home ownership',                    type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 44, median: 51, color: C6 } },
  { id: 'v92', label: 'Land ownership',                    type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 18, median: 31, color: C6 } },
  { id: 'v93', label: 'HH cooks food inside',              type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 41, median: 33, color: C6 } },
  { id: 'v94', label: 'HH unimproved toilet',              type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 67, median: 44, color: C6 } },
  { id: 'v95', label: 'Child <15yrs lives away',           type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 14, median: 11, color: C6 } },
  { id: 'v96', label: 'Age at first birth (partner)',      type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 38, median: 28, color: C6 } },
  { id: 'v108', label: 'HH highest education: 7+',         type: 'vulnerability', category: VULNERABILITY_SECTION_LABEL, data: { chartType: 'binary', value: 21, median: 44, color: C6 } },
];

export const PDF_DATA_MAP = new Map<string, PdfDataItem>(
  PDF_DATA_ITEMS.map(item => [item.id, item])
);
