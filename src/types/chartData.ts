export interface ChartDataPoint {
  segment: string;
  value: number;
  label: string;
}

export interface ChartDataSet {
  title: string;
  subtitle: string;
  denominator: string;
  description: string;
  data: ChartDataPoint[];
  medianLine?: number;
}
