export interface NotionDataConfig {
  databaseId: string;
  filters?: any;
  sorts?: any;
}

export interface NormalizedRow {
  id: string;
  properties: Record<string, any>;
  createdTime: string;
  lastEditedTime: string;
}

export interface AggregationConfig {
  groupBy?: string;
  aggregateField?: string;
  aggregationType?: 'sum' | 'count' | 'avg' | 'min' | 'max';
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'area';
  data: Array<{
    name: string;
    value: number;
    [key: string]: any;
  }>;
  metadata: {
    title?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
  };
}

export type ChartType = 'bar' | 'line' | 'pie' | 'area';
