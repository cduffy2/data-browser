import { dataCategories } from '../../../data/categories';
import { chartDataSets } from '../../../data/chartData';
import './DataDictionaryPanel.css';

interface DataDictionaryPanelProps {
  dataItemId: string;
  selectedCategory: string | null;
  isOpen: boolean;
  onToggle: () => void;
  onSelectItem?: (itemId: string) => void;
}

function getItemType(dataItemId: string): 'vulnerability' | 'health-outcome' | null {
  const baseId = dataItemId.replace(/-(?:ch|im|mh|nu|sr)$/, '');
  for (const cat of dataCategories) {
    for (const sub of cat.subcategories) {
      const found = sub.items.find(i => i.id === dataItemId || i.id === baseId);
      if (found) return cat.id === 'vulnerability-factors' ? 'vulnerability' : 'health-outcome';
    }
  }
  return null;
}


function findItemIdByLabel(label: string): string | null {
  const q = label.toLowerCase();
  for (const cat of dataCategories) {
    for (const sub of cat.subcategories) {
      const found = sub.items.find(i => i.label.toLowerCase() === q);
      if (found) return found.id;
    }
  }
  return null;
}

function getCategoryInfo(categoryId: string): { label: string; parentType: 'vulnerability' | 'health-outcome' | null; itemCount: number } | null {
  for (const cat of dataCategories) {
    const sub = cat.subcategories.find(s => s.id === categoryId);
    if (sub) {
      return {
        label: sub.label,
        parentType: cat.id === 'vulnerability-factors' ? 'vulnerability' : 'health-outcome',
        itemCount: sub.items.length,
      };
    }
  }
  return null;
}

// Placeholder content for category-level views
const CATEGORY_DESCRIPTIONS: Record<string, { description: string; domainDescription?: string }> = {
  'child-health': {
    description: 'Indicators capturing health outcomes and care-seeking behaviours for children under 5, including fever management, illness treatment, and perinatal care.',
  },
  'immunisation': {
    description: 'Indicators measuring vaccination coverage and documentation for children, including routine immunisation schedules and zero-dose status.',
  },
  'maternal-health': {
    description: 'Indicators related to antenatal care, delivery practices, and postnatal care for mothers across population segments.',
  },
  'nutrition': {
    description: 'Indicators capturing nutritional status and feeding practices for women and children, including breastfeeding, stunting, and wasting.',
  },
  'sexual-reproductive-health': {
    description: 'Indicators related to family planning, contraceptive use, HIV testing, and reproductive decision-making.',
  },
  'woman-experiences': {
    description: 'Factors related to a woman\'s personal history, prior experiences with health services, and exposure to gender-based risk.',
    domainDescription: 'This domain captures how a woman\'s past experiences shape her current health behaviours and likelihood of seeking care.',
  },
  'health-mental': {
    description: 'Factors capturing a woman\'s beliefs, knowledge, and attitudes toward health services and her own body.',
    domainDescription: 'Health mental models reflect the frameworks women use to understand illness and care, which directly influence care-seeking decisions.',
  },
  'household-relationships': {
    description: 'Factors related to a woman\'s relationships within the household, including partner dynamics, autonomy, and decision-making power.',
    domainDescription: 'Household relationships shape who controls health-related decisions and whether a woman can independently seek care.',
  },
  'household-economics': {
    description: 'Factors related to the material and financial circumstances of the household, including income stability, asset ownership, and economic access to health services.',
    domainDescription: 'Economic conditions determine whether a woman can afford travel, time away, and the indirect costs of accessing health services.',
  },
  'social-support': {
    description: 'Factors capturing the presence or absence of social networks, community structures, and informal support systems that facilitate or inhibit health-seeking.',
    domainDescription: 'Social support influences whether a woman has the practical and emotional backing to seek and follow through on care.',
  },
  'human-natural': {
    description: 'Factors related to environmental conditions, natural hazards, and infrastructure that affect physical access to health services.',
    domainDescription: 'Human and natural systems shape the physical landscape in which health services must be accessed, including roads, climate, and geography.',
  },
};

// Associated factors for health outcome categories — labels must match categories.ts item labels exactly
const CATEGORY_FACTORS: Record<string, { negative: string[]; positive: string[] }> = {
  'child-health': {
    negative: ['HH slum residence (UN definition)', 'HH water source interrupted', 'HH clean cooking fuel'],
    positive: ['HH electricity', 'HH motor transport', 'Mobile phone used for finances'],
  },
  'immunisation': {
    negative: ['Partner opposition to FP use', 'Any media exposure', 'Media exposure: internet'],
    positive: ['HW visit in last yr', 'Access problem: travel alone', 'Any media exposure'],
  },
  'maternal-health': {
    negative: ['Not living w/ partner', 'Access problem: travel alone', 'Female circumcision'],
    positive: ['HW visit in last yr', 'Age at first birth', 'Decision maker: family planning'],
  },
  'nutrition': {
    negative: ['HH member w/o insurance', 'HH water source interrupted', 'HH clean cooking fuel'],
    positive: ['Bank account (woman)', 'Mobile phone used for finances', 'HH motor transport'],
  },
  'sexual-reproductive-health': {
    negative: ['Partner opposition to FP use', 'Never used modern FP method', 'Female circumcision'],
    positive: ['Decision maker: own income', 'Decision maker: family planning', 'Any media exposure'],
  },
};

const VULNERABILITY_PLACEHOLDER = {
  description: 'This indicator measures the degree to which a woman is exposed to this vulnerability factor within her household and community context.',
  domain: 'Household economics and living conditions',
  domainDescription: 'Factors related to the material and financial circumstances of the household, including access to resources, assets, and stable income.',
  subcategory: 'Access to resources',
  subcategoryDescription: 'Indicators that capture whether women and their households have reliable access to the economic and physical resources needed to seek and maintain health services.',
};

const HEALTH_OUTCOME_PLACEHOLDER = {
  negativeFactors: [
    'Partner opposition to FP use',
    'Not living w/ partner',
    'HH member w/o insurance',
  ],
  positiveFactors: [
    'Decision maker: own income',
    'HW visit in last yr',
    'Any media exposure',
  ],
};

function FactorList({ factors, label, onSelectItem }: { factors: string[]; label: string; onSelectItem?: (id: string) => void }) {
  return (
    <div className="data-dictionary-panel__factor-group">
      <span className="data-dictionary-panel__factor-subheading">{label}</span>
      <ul className="data-dictionary-panel__factor-list">
        {factors.map(f => {
          const itemId = findItemIdByLabel(f);
          return (
            <li key={f} className="data-dictionary-panel__factor-item">
              <button
                className="data-dictionary-panel__factor-link"
                onClick={() => itemId && onSelectItem?.(itemId)}
                style={{ cursor: itemId && onSelectItem ? 'pointer' : 'default' }}
              >{f}</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function DataDictionaryPanel({ dataItemId, selectedCategory, isOpen, onToggle, onSelectItem }: DataDictionaryPanelProps) {
  const itemType = getItemType(dataItemId);
  const baseId = dataItemId.replace(/-(?:ch|im|mh|nu|sr)$/, '');
  const chartData = chartDataSets[dataItemId] || chartDataSets[baseId];
  const chartDescription = chartData?.description ?? null;

  const categoryInfo = selectedCategory ? getCategoryInfo(selectedCategory) : null;
  const categoryContent = selectedCategory ? CATEGORY_DESCRIPTIONS[selectedCategory] : null;
  const categoryFactors = selectedCategory ? CATEGORY_FACTORS[selectedCategory] : null;

  // Show category view if a category is selected and no specific item has been selected after it
  const showCategoryView = categoryInfo !== null && selectedCategory !== null;

  if (!isOpen) {
    return (
      <button className="data-dictionary-panel__float-btn" onClick={onToggle} aria-label="Open data dictionary">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>Data dictionary</span>
      </button>
    );
  }

  return (
    <div className="data-dictionary-panel">
      <button className="data-dictionary-panel__toggle" onClick={onToggle} aria-label="Close data dictionary">
        <span className="data-dictionary-panel__toggle-label">Data dictionary</span>
        <svg className="data-dictionary-panel__toggle-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div className="data-dictionary-panel__content">

          {/* Category-level view */}
          {showCategoryView && categoryInfo?.parentType === 'health-outcome' && (
            <>
              <div className="data-dictionary-panel__field">
                <span className="data-dictionary-panel__field-label">Category</span>
                <span className="data-dictionary-panel__field-value">{categoryInfo.label}</span>
              </div>
              {categoryContent?.description && (
                <div className="data-dictionary-panel__field">
                  <span className="data-dictionary-panel__field-label">Description</span>
                  <p className="data-dictionary-panel__field-text">{categoryContent.description}</p>
                </div>
              )}
              <div className="data-dictionary-panel__divider" />
              {categoryFactors && (
                <div className="data-dictionary-panel__field">
                  <span className="data-dictionary-panel__field-label">Vulnerability factors</span>
                  <FactorList label="Positively associated" factors={categoryFactors.positive} onSelectItem={onSelectItem} />
                  <FactorList label="Negatively associated" factors={categoryFactors.negative} onSelectItem={onSelectItem} />
                </div>
              )}
            </>
          )}

          {showCategoryView && categoryInfo?.parentType === 'vulnerability' && (
            <>
              <div className="data-dictionary-panel__field">
                <span className="data-dictionary-panel__field-label">Domain</span>
                <span className="data-dictionary-panel__field-value">{categoryInfo.label}</span>
              </div>
              {categoryContent?.description && (
                <div className="data-dictionary-panel__field">
                  <span className="data-dictionary-panel__field-label">Description</span>
                  <p className="data-dictionary-panel__field-text">{categoryContent.description}</p>
                </div>
              )}
              {categoryContent?.domainDescription && (
                <>
                  <div className="data-dictionary-panel__divider" />
                  <div className="data-dictionary-panel__field">
                    <span className="data-dictionary-panel__field-label">Domain description</span>
                    <p className="data-dictionary-panel__field-text">{categoryContent.domainDescription}</p>
                  </div>
                </>
              )}
            </>
          )}

          {/* Item-level view (shown when no category selected, or after selecting an item) */}
          {!showCategoryView && itemType === 'vulnerability' && (
            <>
              {chartDescription && (
                <div className="data-dictionary-panel__field">
                  <span className="data-dictionary-panel__field-label">Description</span>
                  <p className="data-dictionary-panel__field-text">{chartDescription}</p>
                </div>
              )}
              <div className="data-dictionary-panel__divider" />
              <div className="data-dictionary-panel__field">
                <span className="data-dictionary-panel__field-label">Domain</span>
                <span className="data-dictionary-panel__field-value">{VULNERABILITY_PLACEHOLDER.domain}</span>
              </div>
              <div className="data-dictionary-panel__field">
                <span className="data-dictionary-panel__field-label">Domain description</span>
                <p className="data-dictionary-panel__field-text">{VULNERABILITY_PLACEHOLDER.domainDescription}</p>
              </div>
              <div className="data-dictionary-panel__divider" />
              <div className="data-dictionary-panel__field">
                <span className="data-dictionary-panel__field-label">Subcategory</span>
                <span className="data-dictionary-panel__field-value">{VULNERABILITY_PLACEHOLDER.subcategory}</span>
              </div>
              <div className="data-dictionary-panel__field">
                <span className="data-dictionary-panel__field-label">Subcategory description</span>
                <p className="data-dictionary-panel__field-text">{VULNERABILITY_PLACEHOLDER.subcategoryDescription}</p>
              </div>
            </>
          )}

          {!showCategoryView && itemType === 'health-outcome' && (
            <>
              {chartDescription && (
                <div className="data-dictionary-panel__field">
                  <span className="data-dictionary-panel__field-label">Description</span>
                  <p className="data-dictionary-panel__field-text">{chartDescription}</p>
                </div>
              )}
              <div className="data-dictionary-panel__divider" />
              <div className="data-dictionary-panel__field">
                <span className="data-dictionary-panel__field-label">Vulnerability factors</span>
                <FactorList label="Positively associated" factors={HEALTH_OUTCOME_PLACEHOLDER.positiveFactors} onSelectItem={onSelectItem} />
                <FactorList label="Negatively associated" factors={HEALTH_OUTCOME_PLACEHOLDER.negativeFactors} onSelectItem={onSelectItem} />
              </div>
            </>
          )}

        </div>
      )}
    </div>
  );
}
