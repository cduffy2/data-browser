import './DetailedDemographics.css';

interface CategoricalSegment {
  label: string;
  percentage: number;
  color: string;
}

interface CategoricalItem {
  type: 'categorical';
  label: string;
  segments: CategoricalSegment[];
}

interface NumericItem {
  type: 'numeric';
  label: string;
  value: string;
  underline?: boolean;
}

type DemographicItem = CategoricalItem | NumericItem;

const demographicsData: [DemographicItem, DemographicItem][] = [
  [
    {
      type: 'categorical',
      label: 'Religion',
      segments: [
        { label: 'Muslim', percentage: 62, color: 'var(--data-categorical-1)' },
        { label: 'Christian', percentage: 29, color: 'var(--data-categorical-2)' },
        { label: 'No religion', percentage: 9, color: 'var(--data-categorical-3)' },
      ],
    },
    {
      type: 'categorical',
      label: 'Digital connectivity',
      segments: [
        { label: 'Owns mobile phone', percentage: 38, color: 'var(--data-categorical-1)' },
        { label: 'Uses internet', percentage: 6, color: 'var(--data-categorical-2)' },
        { label: 'No access', percentage: 56, color: 'var(--data-categorical-3)' },
      ],
    },
  ],
  [
    {
      type: 'categorical',
      label: 'Age categories',
      segments: [
        { label: '18-24', percentage: 12, color: 'var(--data-categorical-1)' },
        { label: '25 - 29', percentage: 11, color: 'var(--data-categorical-2)' },
        { label: '30 - 34', percentage: 65, color: 'var(--data-categorical-3)' },
        { label: '35 - 39', percentage: 5, color: 'var(--data-categorical-4)' },
        { label: '40 - 49', percentage: 7, color: 'var(--data-categorical-5)' },
      ],
    },
    {
      type: 'categorical',
      label: 'Education level',
      segments: [
        { label: 'No education', percentage: 87, color: 'var(--data-categorical-1)' },
        { label: 'Primary', percentage: 10, color: 'var(--data-categorical-2)' },
        { label: 'Secondary', percentage: 3, color: 'var(--data-categorical-3)' },
      ],
    },
  ],
  [
    {
      type: 'categorical',
      label: 'Partnership status',
      segments: [
        { label: 'Married', percentage: 26, color: 'var(--data-categorical-1)' },
        { label: 'Living with partner', percentage: 39, color: 'var(--data-categorical-2)' },
        { label: 'In a relationship', percentage: 12, color: 'var(--data-categorical-3)' },
        { label: 'Single', percentage: 17, color: 'var(--data-categorical-4)' },
        { label: 'Separated/Divorced', percentage: 6, color: 'var(--data-categorical-5)' },
        { label: 'Widowed', percentage: 0, color: 'var(--data-categorical-6)' },
      ],
    },
    {
      type: 'categorical',
      label: 'Occupation',
      segments: [
        { label: 'Not working', percentage: 52, color: 'var(--data-categorical-1)' },
        { label: 'Agricultural', percentage: 31, color: 'var(--data-categorical-2)' },
        { label: 'Manual labour', percentage: 17, color: 'var(--data-categorical-3)' },
      ],
    },
  ],
  [
    {
      type: 'categorical',
      label: 'Partner education',
      segments: [
        { label: 'No education', percentage: 72, color: 'var(--data-categorical-1)' },
        { label: 'Primary', percentage: 18, color: 'var(--data-categorical-2)' },
        { label: 'Secondary', percentage: 10, color: 'var(--data-categorical-3)' },
      ],
    },
    {
      type: 'categorical',
      label: 'Partner occupation',
      segments: [
        { label: 'Pastoral/farming', percentage: 48, color: 'var(--data-categorical-1)' },
        { label: 'Manual labour', percentage: 32, color: 'var(--data-categorical-2)' },
        { label: 'Not working', percentage: 20, color: 'var(--data-categorical-3)' },
      ],
    },
  ],
  [
    {
      type: 'numeric',
      label: 'Parity',
      value: '4',
    },
    {
      type: 'numeric',
      label: 'Adult:Child ratio',
      value: '1:4',
    },
  ],
];

function CategoricalBar({ item }: { item: CategoricalItem }) {
  return (
    <div className="detailed-demographics__item">
      <span className="detailed-demographics__label">{item.label}</span>
      <div className="detailed-demographics__bar">
        {item.segments.map((segment, i) => (
          <div
            key={i}
            className="detailed-demographics__bar-segment"
            style={{
              width: `${segment.percentage}%`,
              backgroundColor: segment.color,
            }}
          />
        ))}
      </div>
      <div className="detailed-demographics__legend">
        {item.segments.map((segment, i) => (
          <div key={i} className="detailed-demographics__legend-item">
            <div
              className="detailed-demographics__legend-swatch"
              style={{ backgroundColor: segment.color }}
            />
            <span className="detailed-demographics__legend-text">
              {segment.label} ({segment.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NumericValue({ item }: { item: NumericItem }) {
  return (
    <div className="detailed-demographics__item">
      <span className={`detailed-demographics__label${item.underline ? ' detailed-demographics__label--underline' : ''}`}>
        {item.label}
      </span>
      <span className="detailed-demographics__value">{item.value}</span>
    </div>
  );
}

export function DetailedDemographics() {
  return (
    <div className="detailed-demographics">
      <h2 className="detailed-demographics__title">Detailed demographics</h2>
      <div className="detailed-demographics__card">
        {demographicsData.map((row, rowIndex) => (
          <div key={rowIndex} className="detailed-demographics__row">
            {row.map((item, itemIndex) => (
              item.type === 'categorical'
                ? <CategoricalBar key={itemIndex} item={item} />
                : <NumericValue key={itemIndex} item={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
