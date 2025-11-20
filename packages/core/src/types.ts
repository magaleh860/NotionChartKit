export interface NotionDataConfig {
  databaseId: string;
  // biome-ignore lint/suspicious/noExplicitAny: Notion API filter types are complex, using any for flexibility
  filters?: any;
  // biome-ignore lint/suspicious/noExplicitAny: Notion API sort types are complex, using any for flexibility
  sorts?: any;
}

export interface NormalizedRow {
  id: string;
  // biome-ignore lint/suspicious/noExplicitAny: Notion property types vary dynamically
  properties: Record<string, any>;
  createdTime: string;
  lastEditedTime: string;
}

export interface AggregationConfig {
  groupBy?: string;
  aggregateField?: string;
  aggregationType?: 'sum' | 'count' | 'avg' | 'min' | 'max';
  // Time window filtering
  timeWindow?: {
    type: 'last_7_days' | 'last_30_days' | 'last_90_days' | 'last_year' | 'custom';
    dateProperty?: string; // Which date property to filter on (defaults to 'createdTime')
    customStartDate?: string; // For custom time windows (ISO string)
    customEndDate?: string; // For custom time windows (ISO string)
  };
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'area';
  data: Array<{
    name: string;
    value: number;
    // biome-ignore lint/suspicious/noExplicitAny: Chart data can have dynamic fields
    [key: string]: any;
  }>;
  metadata: {
    title?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
  };
}

export type ChartType = 'bar' | 'line' | 'pie' | 'area';
