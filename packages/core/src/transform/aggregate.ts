import type { AggregationConfig } from '../types.js';

export function aggregateData(
  // biome-ignore lint/suspicious/noExplicitAny: Normalized data has dynamic property values
  data: Array<Record<string, any>>,
  config: AggregationConfig
): Array<{ name: string; value: number }> {
  const { groupBy, aggregateField, aggregationType = 'count' } = config;

  if (!groupBy) {
    // No grouping, return single aggregate
    const value = calculateAggregate(data, aggregateField, aggregationType);
    return [{ name: 'Total', value }];
  }

  // Group data by field
  // biome-ignore lint/suspicious/noExplicitAny: Group data has dynamic property values
  const groups = new Map<string, any[]>();

  for (const row of data) {
    const groupValue = String(row[groupBy] || 'Unknown');
    if (!groups.has(groupValue)) {
      groups.set(groupValue, []);
    }
    groups.get(groupValue)?.push(row);
  }

  // Calculate aggregate for each group
  const result: Array<{ name: string; value: number }> = [];

  for (const [name, groupData] of groups.entries()) {
    const value = calculateAggregate(groupData, aggregateField, aggregationType);
    result.push({ name, value });
  }

  return result.sort((a, b) => b.value - a.value);
}

function calculateAggregate(
  // biome-ignore lint/suspicious/noExplicitAny: Normalized data has dynamic property values
  data: Array<Record<string, any>>,
  field: string | undefined,
  type: 'sum' | 'count' | 'avg' | 'min' | 'max'
): number {
  if (type === 'count') {
    return data.length;
  }

  if (!field) {
    throw new Error('Aggregate field required for non-count aggregations');
  }

  const values = data.map((row) => row[field]).filter((val) => typeof val === 'number');

  if (values.length === 0) return 0;

  switch (type) {
    case 'sum':
      return values.reduce((acc, val) => acc + val, 0);
    case 'avg':
      return values.reduce((acc, val) => acc + val, 0) / values.length;
    case 'min':
      return Math.min(...values);
    case 'max':
      return Math.max(...values);
    default:
      return 0;
  }
}
