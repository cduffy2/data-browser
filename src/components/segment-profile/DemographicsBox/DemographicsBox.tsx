import './DemographicsBox.css';
import InfoIcon from '../../../assets/icons/InfoOutlined.svg?react';

interface DemographicItem {
  label: string;
  value: number;
  range?: string;
  showInfo?: boolean;
}

interface DemographicsBoxProps {
  demographics: DemographicItem[];
}

export function DemographicsBox({ demographics }: DemographicsBoxProps) {
  return (
    <div className="demographics-box">
      <h3 className="demographics-box__title">Key demographics</h3>
      <div className="demographics-box__items">
        {demographics.map((item, index) => (
          <div key={index} className="demographics-box__item">
            <span className="demographics-box__label">{item.label}</span>
            <div className="demographics-box__value-row">
              <span className="demographics-box__value">{item.value}</span>
              {item.range && (
                <>
                  <span className="demographics-box__separator">·</span>
                  <span className="demographics-box__range">
                    {item.range}
                    {item.showInfo && (
                      <InfoIcon className="demographics-box__info-icon" />
                    )}
                  </span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
