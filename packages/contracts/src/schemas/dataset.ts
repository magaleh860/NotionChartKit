import { z } from 'zod';

export const DatasetConfigSchema = z.object({
  databaseId: z.string(),
  filters: z.any().optional(),
  sorts: z.any().optional(),
  groupBy: z.string().optional(),
  aggregateField: z.string().optional(),
  aggregationType: z.enum(['sum', 'count', 'avg', 'min', 'max']).optional(),
});

export const DatasetSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  connectionId: z.string().uuid(),
  name: z.string(),
  databaseId: z.string(),
  config: DatasetConfigSchema,
  isActive: z.boolean().default(true),
  refreshIntervalMinutes: z.number().int().positive().default(60),
  lastRefreshedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateDatasetSchema = z.object({
  connectionId: z.string().uuid(),
  name: z.string().min(1).max(255),
  databaseId: z.string(),
  config: DatasetConfigSchema,
  refreshIntervalMinutes: z.number().int().positive().default(60),
});

export const UpdateDatasetSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  config: DatasetConfigSchema.optional(),
  isActive: z.boolean().optional(),
  refreshIntervalMinutes: z.number().int().positive().optional(),
});

export type Dataset = z.infer<typeof DatasetSchema>;
export type DatasetConfig = z.infer<typeof DatasetConfigSchema>;
export type CreateDataset = z.infer<typeof CreateDatasetSchema>;
export type UpdateDataset = z.infer<typeof UpdateDatasetSchema>;
