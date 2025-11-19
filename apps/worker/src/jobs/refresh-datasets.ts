import { fetchNotionData } from '@notionchartkit/core';
import { prisma } from '@notionchartkit/db';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export async function refreshDatasets() {
  try {
    // Fetch all active datasets from database
    const datasets = await prisma.dataset.findMany({
      where: {
        isActive: true,
      },
      include: {
        connection: true,
      },
    });

    console.log(`Found ${datasets.length} datasets to refresh`);

    for (const dataset of datasets) {
      try {
        // Check if dataset needs refresh based on last_edited_time
        const shouldRefresh = await checkIfNeedsRefresh(dataset.id);

        if (!shouldRefresh) {
          console.log(`Skipping dataset ${dataset.id} - no changes detected`);
          continue;
        }

        console.log(`Refreshing dataset ${dataset.id}...`);

        // Fetch fresh data from Notion
        const data = await fetchNotionData(
          dataset.connection.accessToken,
          dataset.databaseId,
          // biome-ignore lint/suspicious/noExplicitAny: Dataset config JSON type from database
          dataset.config as any
        );

        // Cache the processed data in Redis
        const cacheKey = `dataset:${dataset.id}:data`;
        await redis.setex(cacheKey, 3600, JSON.stringify(data)); // 1 hour TTL

        // Update last refresh timestamp
        await prisma.dataset.update({
          where: { id: dataset.id },
          data: { lastRefreshedAt: new Date() },
        });

        console.log(`✅ Dataset ${dataset.id} refreshed successfully`);
      } catch (error) {
        console.error(`❌ Failed to refresh dataset ${dataset.id}:`, error);
        // Continue with other datasets even if one fails
      }
    }
  } catch (error) {
    console.error('Failed to refresh datasets:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function checkIfNeedsRefresh(_datasetId: string): Promise<boolean> {
  // TODO: Implement logic to check Notion's last_edited_time
  // For now, always return true
  return true;
}
