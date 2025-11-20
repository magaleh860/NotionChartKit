import type { AggregationConfig } from '../types.js';

export function aggregateData(
  // biome-ignore lint/suspicious/noExplicitAny: Normalized data has dynamic property values
  data: Array<Record<string, any>>,
  config: AggregationConfig
): Array<{ name: string; value: number }> {
  const { groupBy, aggregateField, aggregationType = 'count', timeWindow } = config;

  // Apply time window filter if specified
  let filteredData = data;
  if (timeWindow) {
    filteredData = filterByTimeWindow(data, timeWindow);
  }

  if (!groupBy) {
    // No grouping, return single aggregate
    const value = calculateAggregate(filteredData, aggregateField, aggregationType);
    return [{ name: 'Total', value }];
  }

  // Group data by field
  // biome-ignore lint/suspicious/noExplicitAny: Group data has dynamic property values
  const groups = new Map<string, any[]>();

  for (const row of filteredData) {
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

  // If grouping by date and using time window, fill missing dates with zeros
  const shouldFillDates = timeWindow && isDateField(groupBy, filteredData);
  if (shouldFillDates && timeWindow) {
    return fillMissingDates(result, timeWindow);
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

function filterByTimeWindow(
  // biome-ignore lint/suspicious/noExplicitAny: Normalized data has dynamic property values
  data: Array<Record<string, any>>,
  timeWindow: NonNullable<AggregationConfig['timeWindow']>
  // biome-ignore lint/suspicious/noExplicitAny: Return type matches input type with dynamic properties
): Array<Record<string, any>> {
  const dateProperty = timeWindow.dateProperty || 'createdTime';
  const now = new Date();
  let startDate: Date;

  // Calculate start date based on time window type
  switch (timeWindow.type) {
    case 'last_7_days':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'last_30_days':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'last_90_days':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case 'last_year':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    case 'custom':
      if (!timeWindow.customStartDate) {
        return data; // No filter if custom start date not provided
      }
      startDate = new Date(timeWindow.customStartDate);
      break;
    default:
      return data;
  }

  const endDate =
    timeWindow.type === 'custom' && timeWindow.customEndDate
      ? new Date(timeWindow.customEndDate)
      : now;

  // Filter data by date range
  return data.filter((row) => {
    const rowDate = row[dateProperty];
    if (!rowDate) return false;

    const date = new Date(rowDate);
    return date >= startDate && date <= endDate;
  });
}

// Check if a field contains date values
function isDateField(
  fieldName: string,
  // biome-ignore lint/suspicious/noExplicitAny: Normalized data has dynamic property values
  data: Array<Record<string, any>>
): boolean {
  // Always treat common date field names as dates
  const dateFieldNames = [
    'createdTime',
    'lastEditedTime',
    'created_time',
    'last_edited_time',
    'date',
    'Date',
  ];
  if (dateFieldNames.includes(fieldName)) {
    return true;
  }

  if (data.length === 0) return false;

  // Check a sample of the data to see if the field contains date strings
  for (const row of data.slice(0, 10)) {
    const value = row[fieldName];
    if (value) {
      // Try to parse as date - if it's a valid ISO date string, consider it a date field
      const parsed = new Date(value);
      if (
        !Number.isNaN(parsed.getTime()) &&
        typeof value === 'string' &&
        (value.includes('-') || value.includes('/'))
      ) {
        return true;
      }
    }
  }
  return false;
}

// Fill in missing dates with zero values
function fillMissingDates(
  data: Array<{ name: string; value: number }>,
  timeWindow: NonNullable<AggregationConfig['timeWindow']>
): Array<{ name: string; value: number }> {
  if (data.length === 0) {
    // If no data at all, return empty array
    return [];
  }

  const now = new Date();
  let startDate: Date;

  // Calculate start date based on time window type
  switch (timeWindow.type) {
    case 'last_7_days':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'last_30_days':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'last_90_days':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case 'last_year':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    case 'custom':
      if (!timeWindow.customStartDate) {
        return data; // Can't fill dates without a start date
      }
      startDate = new Date(timeWindow.customStartDate);
      break;
    default:
      return data;
  }

  const endDate =
    timeWindow.type === 'custom' && timeWindow.customEndDate
      ? new Date(timeWindow.customEndDate)
      : now;

  // Detect the date format from existing data
  // Normalize all dates to YYYY-MM-DD format for consistent comparison
  const dataMap = new Map<string, number>();
  for (const item of data) {
    // Parse the date and convert to YYYY-MM-DD
    const parsedDate = new Date(item.name);
    if (!Number.isNaN(parsedDate.getTime())) {
      const normalizedDate = parsedDate.toISOString().split('T')[0];
      dataMap.set(normalizedDate, item.value);
    } else {
      // If it's not a valid date, keep as-is
      dataMap.set(item.name, item.value);
    }
  }

  // Generate all dates in the range
  const result: Array<{ name: string; value: number }> = [];
  const currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    result.push({
      name: dateStr,
      value: dataMap.get(dateStr) || 0,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
}
