import { z } from 'zod';

export const ChartTypeSchema = z.enum(['bar', 'line', 'pie', 'area']);

export const ChartMetadataSchema = z.object({
  title: z.string().optional(),
  xAxisLabel: z.string().optional(),
  yAxisLabel: z.string().optional(),
  colors: z.array(z.string()).optional(),
});

export const ChartDataPointSchema = z.object({
  name: z.string(),
  value: z.number(),
});

export const ChartDataSchema = z.object({
  type: ChartTypeSchema,
  data: z.array(ChartDataPointSchema),
  metadata: ChartMetadataSchema,
});

export const ChartSchema = z.object({
  id: z.string().uuid(),
  datasetId: z.string().uuid(),
  publicKey: z.string(),
  type: ChartTypeSchema,
  metadata: ChartMetadataSchema,
  embedCode: z.string(),
  viewCount: z.number().int().default(0),
  isPublic: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateChartSchema = z.object({
  datasetId: z.string().uuid(),
  type: ChartTypeSchema,
  metadata: ChartMetadataSchema.optional(),
  isPublic: z.boolean().default(true),
});

export const UpdateChartSchema = z.object({
  type: ChartTypeSchema.optional(),
  metadata: ChartMetadataSchema.optional(),
  isPublic: z.boolean().optional(),
});

export type ChartType = z.infer<typeof ChartTypeSchema>;
export type ChartMetadata = z.infer<typeof ChartMetadataSchema>;
export type ChartDataPoint = z.infer<typeof ChartDataPointSchema>;
export type ChartData = z.infer<typeof ChartDataSchema>;
export type Chart = z.infer<typeof ChartSchema>;
export type CreateChart = z.infer<typeof CreateChartSchema>;
export type UpdateChart = z.infer<typeof UpdateChartSchema>;
