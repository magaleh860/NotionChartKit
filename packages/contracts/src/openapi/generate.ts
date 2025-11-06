import { zodToJsonSchema } from 'zod-to-json-schema';
import * as fs from 'fs';
import * as path from 'path';
import {
  UserSchema,
  NotionConnectionSchema,
  DatasetSchema,
  ChartSchema,
  CreateUserSchema,
  CreateNotionConnectionSchema,
  CreateDatasetSchema,
  CreateChartSchema,
} from '../index.js';

const schemas = {
  User: UserSchema,
  NotionConnection: NotionConnectionSchema,
  Dataset: DatasetSchema,
  Chart: ChartSchema,
  CreateUser: CreateUserSchema,
  CreateNotionConnection: CreateNotionConnectionSchema,
  CreateDataset: CreateDatasetSchema,
  CreateChart: CreateChartSchema,
};

const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'NotionChartKit API',
    version: '0.1.0',
    description: 'API for creating and managing charts from Notion databases',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  components: {
    schemas: Object.entries(schemas).reduce((acc, [name, schema]) => {
      acc[name] = zodToJsonSchema(schema, name);
      return acc;
    }, {} as Record<string, any>),
  },
  paths: {
    '/api/datasets': {
      get: {
        summary: 'List all datasets',
        responses: {
          '200': {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    datasets: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Dataset' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new dataset',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateDataset' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Dataset' },
              },
            },
          },
        },
      },
    },
    '/api/charts/{id}': {
      get: {
        summary: 'Get chart data',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Success',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Chart' },
              },
            },
          },
        },
      },
    },
  },
};

// Generate OpenAPI spec file
const outputPath = path.join(process.cwd(), 'openapi.json');
fs.writeFileSync(outputPath, JSON.stringify(openApiSpec, null, 2));
console.log(`OpenAPI spec generated at ${outputPath}`);
