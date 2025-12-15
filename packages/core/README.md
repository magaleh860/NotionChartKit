# @notionchartkit/core

Core business logic for Notion API integration, data transformation, and chart generation.

> 📖 For system architecture and data flow, see [docs/architecture.md](../../docs/architecture.md)

## Usage

### Fetching Notion Data

```typescript
import { fetchNotionDatabase } from '@notionchartkit/core';

const data = await fetchNotionDatabase({
  databaseId: 'notion-database-id',
  accessToken: 'notion-access-token',
  filters: {
    // Optional Notion filters
  }
});
```

### Normalizing Data

```typescript
import { normalizeNotionData } from '@notionchartkit/core';

const normalized = normalizeNotionData(notionResponse, {
  xProperty: 'Status',
  yProperty: 'Count',
  propertyTypes: {
    Status: 'select',
    Count: 'number'
  }
});
```

### Aggregating Data

```typescript
import { aggregateData } from '@notionchartkit/core';

const aggregated = aggregateData(normalizedData, {
  groupBy: 'Status',
  aggregationType: 'count', // 'count' | 'sum' | 'average' | 'min' | 'max'
  valueField: 'Count'
});
```

### Generating Chart Data

```typescript
import { generateChartData } from '@notionchartkit/core';

const chartData = generateChartData({
  data: aggregatedData,
  chartType: 'bar', // 'bar' | 'line' | 'pie' | 'area'
  title: 'Task Status Distribution',
  xAxisLabel: 'Status',
  yAxisLabel: 'Count'
});
```

## API Reference

### `fetchNotionDatabase(options)`

Fetches data from a Notion database.

**Parameters**:
- `databaseId` (string): Notion database ID
- `accessToken` (string): Notion API access token
- `filters` (object, optional): Notion query filters

**Returns**: Promise<NotionDatabaseResponse>

### `normalizeNotionData(data, config)`

Converts Notion API response to normalized format.

**Parameters**:
- `data` (NotionDatabaseResponse): Raw Notion response
- `config` (object): Normalization configuration
  - `xProperty` (string): Property for X-axis
  - `yProperty` (string): Property for Y-axis
  - `propertyTypes` (object): Property type mapping

**Returns**: NormalizedData[]

### `aggregateData(data, config)`

Aggregates normalized data.

**Parameters**:
- `data` (NormalizedData[]): Normalized data
- `config` (object): Aggregation configuration
  - `groupBy` (string): Field to group by
  - `aggregationType` ('count' | 'sum' | 'average' | 'min' | 'max')
  - `valueField` (string): Field to aggregate

**Returns**: AggregatedData[]

### `generateChartData(options)`

Generates Chart.js-compatible data structure.

**Parameters**:
- `data` (AggregatedData[]): Aggregated data
- `chartType` ('bar' | 'line' | 'pie' | 'area'): Chart type
- `title` (string): Chart title
- `xAxisLabel` (string, optional): X-axis label
- `yAxisLabel` (string, optional): Y-axis label

**Returns**: ChartData

## Dependencies

- `@notionchartkit/contracts` - Type definitions and validation
- `@notionhq/client` - Official Notion SDK
