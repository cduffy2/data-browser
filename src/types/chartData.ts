export interface ChartDataPoint {
  segment: string;
  value: number;
  label: string;
}

export interface StackedChartDataPoint {
  segment: string;
  [key: string]: string | number; // category values
}

export interface StackCategory {
  key: string;
  label: string;
  color: string;
}

export interface ChartDataSet {
  title: string;
  subtitle: string;
  denominator: string;
  description: string;
  data: ChartDataPoint[];
  medianLine?: number;
  chartType?: 'bar' | 'stacked';
}

export interface StackedChartDataSet {
  title: string;
  subtitle: string;
  denominator: string;
  description: string;
  data: StackedChartDataPoint[];
  categories: StackCategory[];
  chartType: 'stacked';
}
