import './KeyDataPoints.css';

interface DataPoint {
  label: string;
  percentage: number;
  medianPercentage?: number;
}

interface CategoricalDataPoint {
  label: string;
  segments: { label: string; percentage: number; color: string }[];
}

interface KeyDataPointsProps {
  healthOutcomes: DataPoint[];
  vulnerabilityFactors: (DataPoint | CategoricalDataPoint)[];
}

function isCategorical(item: DataPoint | CategoricalDataPoint): item is CategoricalDataPoint {
  return 'segments' in item;
}

function DataBar({ label, percentage, medianPercentage }: DataPoint) {
  return (
    <div className="key-data-points__bar-item">
      <span className="key-data-points__bar-label">{label}</span>
      <div className="key-data-points__bar-container">
        <div className="key-data-points__bar-track">
          <div
            className="key-data-points__bar-fill"
            style={{ width: `${percentage}%` }}
          />
          {medianPercentage !== undefined && (
            <div
              className="key-data-points__bar-median"
              style={{ left: `${medianPercentage}%` }}
            />
          )}
        </div>
        <span className="key-data-points__bar-percentage">{percentage}%</span>
      </div>
    </div>
  );
}

function CategoricalBar({ label, segments }: CategoricalDataPoint) {
  return (
    <div className="key-data-points__categorical-item">
      <span className="key-data-points__bar-label">{label}</span>
      <div className="key-data-points__categorical-bar">
        {segments.map((segment, index) => (
          <div
            key={index}
            className="key-data-points__categorical-segment"
            style={{
              width: `${segment.percentage}%`,
              backgroundColor: segment.color,
            }}
          />
        ))}
      </div>
      <div className="key-data-points__categorical-legend">
        {segments.map((segment, index) => (
          <div key={index} className="key-data-points__categorical-legend-item">
            <span
              className="key-data-points__categorical-legend-color"
              style={{ backgroundColor: segment.color }}
            />
            <span className="key-data-points__categorical-legend-text">
              {segment.label} ({segment.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function KeyDataPoints({ healthOutcomes, vulnerabilityFactors }: KeyDataPointsProps) {
  return (
    <div className="key-data-points">
      <h2 className="key-data-points__title">Key data points for this segment</h2>
      <div className="key-data-points__columns">
        <div className="key-data-points__column">
          <h3 className="key-data-points__column-title">Health outcomes / behaviours</h3>
          <div className="key-data-points__list">
            {healthOutcomes.map((item, index) => (
              <DataBar key={index} {...item} />
            ))}
          </div>
        </div>
        <div className="key-data-points__column">
          <h3 className="key-data-points__column-title">Vulnerability factors</h3>
          <div className="key-data-points__list">
            {vulnerabilityFactors.map((item, index) =>
              isCategorical(item) ? (
                <CategoricalBar key={index} {...item} />
              ) : (
                <DataBar key={index} {...item} />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
