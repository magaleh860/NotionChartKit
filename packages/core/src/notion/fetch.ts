import { Client } from '@notionhq/client';
import type { NotionDataConfig, NormalizedRow } from '../types.js';

export async function fetchNotionData(
  accessToken: string,
  databaseId: string,
  config: NotionDataConfig
): Promise<NormalizedRow[]> {
  const notion = new Client({ auth: accessToken });

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: config.filters,
      sorts: config.sorts,
    });

    return response.results.map((page: any) => ({
      id: page.id,
      properties: page.properties,
      createdTime: page.created_time,
      lastEditedTime: page.last_edited_time,
    }));
  } catch (error) {
    console.error('Failed to fetch Notion data:', error);
    throw new Error('Failed to fetch data from Notion');
  }
}

export async function getNotionDatabase(accessToken: string, databaseId: string) {
  const notion = new Client({ auth: accessToken });

  try {
    const database = await notion.databases.retrieve({
      database_id: databaseId,
    });

    return database;
  } catch (error) {
    console.error('Failed to fetch Notion database:', error);
    throw new Error('Failed to fetch database from Notion');
  }
}
