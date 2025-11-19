import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export async function cleanupCache() {
  try {
    console.log('Starting cache cleanup...');

    // Get all dataset keys
    const keys = await redis.keys('dataset:*:data');

    let cleaned = 0;
    for (const key of keys) {
      const ttl = await redis.ttl(key);

      // Remove expired or very old cache entries
      if (ttl < 0 || ttl > 7200) {
        // older than 2 hours
        await redis.del(key);
        cleaned++;
      }
    }

    console.log(`Cleaned up ${cleaned} cache entries`);
  } catch (error) {
    console.error('Failed to cleanup cache:', error);
    throw error;
  } finally {
    await redis.quit();
  }
}
