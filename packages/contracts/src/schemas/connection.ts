import { z } from 'zod';

export const NotionConnectionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  accessToken: z.string(),
  workspaceName: z.string().optional(),
  workspaceIcon: z.string().optional(),
  botId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateNotionConnectionSchema = z.object({
  code: z.string(),
  redirectUri: z.string().url(),
});

export type NotionConnection = z.infer<typeof NotionConnectionSchema>;
export type CreateNotionConnection = z.infer<typeof CreateNotionConnectionSchema>;
