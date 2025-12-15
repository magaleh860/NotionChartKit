# @notionchartkit/contracts

Zod schemas and TypeScript types shared across all packages. Provides runtime validation and type-safe contracts.

## Usage

### Validating Data

```typescript
import { chartSchema, datasetSchema } from '@notionchartkit/contracts';

// Validate chart data
const result = chartSchema.safeParse(data);
if (result.success) {
  const chart = result.data;
  // Use validated chart
} else {
  console.error(result.error);
}

// Parse with error throwing
const dataset = datasetSchema.parse(data);
```

### Type Inference

```typescript
import { type Chart, type Dataset } from '@notionchartkit/contracts';

// Types are automatically inferred from schemas
const myChart: Chart = {
  id: '123',
  title: 'My Chart',
  type: 'bar',
  // ... TypeScript will validate structure
};
```

## Schemas

### Common Schemas (`common.ts`)

```typescript
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20)
});

export const timestampSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date()
});
```

### User Schema (`user.ts`)

```typescript
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(255),
  notionAccessToken: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type User = z.infer<typeof userSchema>;
```

### Connection Schema (`connection.ts`)

```typescript
export const connectionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  notionWorkspaceId: z.string(),
  notionWorkspaceName: z.string(),
  accessToken: z.string(),
  botId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type Connection = z.infer<typeof connectionSchema>;
```

### Dataset Schema (`dataset.ts`)

```typescript
export const datasetSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  connectionId: z.string().uuid(),
  notionDatabaseId: z.string(),
  notionDatabaseName: z.string(),
  refreshInterval: z.number().int().positive().default(300000),
  lastRefreshedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type Dataset = z.infer<typeof datasetSchema>;
```

### Chart Schema (`chart.ts`)

```typescript
export const chartTypeSchema = z.enum(['bar', 'line', 'pie', 'area']);

export const chartSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  datasetId: z.string().uuid(),
  title: z.string().min(1).max(255),
  type: chartTypeSchema,
  configuration: z.object({
    xProperty: z.string(),
    yProperty: z.string(),
    aggregationType: z.enum(['count', 'sum', 'average', 'min', 'max']),
    groupBy: z.string().optional(),
    filters: z.record(z.any()).optional()
  }),
  publicKey: z.string().uuid(),
  isPublic: z.boolean().default(true),
  viewCount: z.number().int().nonnegative().default(0),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type Chart = z.infer<typeof chartSchema>;
export type ChartType = z.infer<typeof chartTypeSchema>;
```

## API Request/Response Schemas

```typescript
// Create chart request
export const createChartRequestSchema = chartSchema.pick({
  datasetId: true,
  title: true,
  type: true,
  configuration: true
});

// Update chart request
export const updateChartRequestSchema = createChartRequestSchema.partial();

// Chart response
export const chartResponseSchema = chartSchema;
```

## OpenAPI Generation

Generate OpenAPI specification from Zod schemas:

```typescript
import { generateOpenAPISpec } from '@notionchartkit/contracts';

const spec = generateOpenAPISpec();
// Use spec for API documentation
```

## Validation Helpers

```typescript
import { validateOrThrow, validateSafe } from '@notionchartkit/contracts';

// Throw on validation error
const chart = validateOrThrow(chartSchema, data);

// Return result object
const result = validateSafe(chartSchema, data);
if (result.success) {
  const chart = result.data;
}
```

## Adding New Schemas

1. Create schema file in `src/schemas/`
2. Export from `src/index.ts`
3. Use in your application with type inference
