import 'dotenv/config';
import { refreshDatasets } from './jobs/refresh-datasets.js';
import { cleanupCache } from './jobs/cleanup-cache.js';

console.log('🚀 NotionChartKit Worker started');

// Main worker loop
async function main() {
  const REFRESH_INTERVAL = parseInt(process.env.REFRESH_INTERVAL || '300000'); // 5 minutes default
  const CLEANUP_INTERVAL = parseInt(process.env.CLEANUP_INTERVAL || '3600000'); // 1 hour default

  // Run refresh job
  setInterval(async () => {
    console.log('⏰ Running dataset refresh job...');
    try {
      await refreshDatasets();
      console.log('✅ Dataset refresh completed');
    } catch (error) {
      console.error('❌ Dataset refresh failed:', error);
    }
  }, REFRESH_INTERVAL);

  // Run cleanup job
  setInterval(async () => {
    console.log('🧹 Running cache cleanup job...');
    try {
      await cleanupCache();
      console.log('✅ Cache cleanup completed');
    } catch (error) {
      console.error('❌ Cache cleanup failed:', error);
    }
  }, CLEANUP_INTERVAL);

  // Initial run
  console.log('🔄 Running initial jobs...');
  await refreshDatasets();
  await cleanupCache();
  console.log('✅ Initial jobs completed');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('👋 Shutting down worker...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('👋 Shutting down worker...');
  process.exit(0);
});

main().catch((error) => {
  console.error('💥 Worker crashed:', error);
  process.exit(1);
});
