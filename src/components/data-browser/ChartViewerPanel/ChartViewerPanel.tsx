import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ReferenceLine,
  LabelList,
  ResponsiveContainer
} from 'recharts';
import { chartDataSets } from '../../../data/chartData';
import { Button } from '../../common/Button/Button';
import DownloadIcon from '../../../assets/icons/Download.svg?react';
import InfoOutlinedIcon from '../../../assets/icons/InfoOutlined.svg?react';
import './ChartViewerPanel.css';

interface ChartViewerPanelProps {
  dataItemId: string;
}

export function ChartViewerPanel({ dataItemId }: ChartViewerPanelProps) {
  const chartData = chartDataSets[dataItemId];

  if (!chartData) {
    return (
      <div className="chart-viewer-panel">
        <div className="chart-viewer-panel__empty">
          Select a data item to view the chart
        </div>
      </div>
    );
  }

  return (
    <div className="chart-viewer-panel">
      <div className="chart-viewer-panel__content">
        <div className="chart-viewer-panel__header">
          <h2 className="chart-viewer-panel__title">{chartData.title}</h2>
          <div className="chart-viewer-panel__subtitle">
            <span className="chart-viewer-panel__median-line" />
            <span>{chartData.subtitle}</span>
          </div>
        </div>

        <div className="chart-viewer-panel__chart-wrapper">
          <div className="chart-viewer-panel__chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.data} margin={{ top: 20, right: 20, bottom: -1, left: 60 }} barCategoryGap="15%">
                <defs>
                  <filter id="labelBackground" x="-50%" y="-50%" width="200%" height="200%">
                    <feFlood floodColor="#ffffff" result="bg" />
                    <feMerge>
                      <feMergeNode in="bg"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <XAxis
                  dataKey="segment"
                  axisLine={false}
                  tickLine={false}
                  tick={false}
                  padding={{ left: 0, right: 0 }}
                />
                <YAxis hide domain={[0, 100]} />
                {chartData.medianLine && (
                  <ReferenceLine
                    y={chartData.medianLine}
                    stroke="#555e68"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                    label={(props: any) => {
                      const { viewBox } = props;
                      if (!viewBox) return null;

                      return (
                        <g style={{ zIndex: 1 }}>
                          <rect
                            x={viewBox.x - 38}
                            y={viewBox.y - 10}
                            width={32}
                            height={20}
                            fill="#555e68"
                            rx={2}
                          />
                          <text
                            x={viewBox.x - 22}
                            y={viewBox.y + 4}
                            fill="#ffffff"
                            fontSize={12}
                            fontWeight={600}
                            fontFamily="Inter"
                            textAnchor="middle"
                          >
                            {chartData.medianLine}%
                          </text>
                        </g>
                      );
                    }}
                  />
                )}
                <Bar dataKey="value" fill="#88c1fd" radius={[0, 0, 0, 0]}>
                  <LabelList
                    dataKey="label"
                    position="top"
                    content={(props: any) => {
                      const { x, y, width, value } = props;
                      return (
                        <g style={{ zIndex: 100 }}>
                          <rect
                            x={x + width / 2 - 18}
                            y={y - 18}
                            width={36}
                            height={18}
                            fill="#ffffff"
                            rx={2}
                          />
                          <text
                            x={x + width / 2}
                            y={y - 4}
                            fill="#171a1c"
                            fontSize={14}
                            fontFamily="Inter"
                            fontWeight={400}
                            textAnchor="middle"
                          >
                            {value}
                          </text>
                        </g>
                      );
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-viewer-panel__x-axis">
            {chartData.data.map((item) => (
              <div key={item.segment} className="chart-viewer-panel__x-label">
                {item.segment}
              </div>
            ))}
          </div>
          <div className="chart-viewer-panel__denominator">
            <InfoOutlinedIcon className="chart-viewer-panel__info-icon" />
            <span className="chart-viewer-panel__denominator-label">Denominator:</span>
            <span className="chart-viewer-panel__denominator-value">
              {chartData.denominator}
            </span>
          </div>

          <div className="chart-viewer-panel__footer">
            <div className="chart-viewer-panel__description">
              <p className="chart-viewer-panel__description-text">{chartData.description}</p>
            </div>
            <div className="chart-viewer-panel__actions">
              <Button variant="plain">
                Download <DownloadIcon style={{ width: '14px', height: '14px' }} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
