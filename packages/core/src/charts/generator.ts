import type { ChartData, ChartType } from '../types.js';

export function generateChartData(
  aggregatedData: Array<{ name: string; value: number }>,
  chartType: ChartType,
  metadata?: ChartData['metadata']
): ChartData {
  return {
    type: chartType,
    data: aggregatedData,
    metadata: metadata || {},
  };
}

export function formatChartDataForRecharts(chartData: ChartData) {
  // Transform to Recharts-compatible format
  return {
    type: chartData.type,
    data: chartData.data,
    config: {
      xKey: 'name',
      yKey: 'value',
      ...chartData.metadata,
    },
  };
}
