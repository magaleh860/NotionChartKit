# @notionchartkit/worker

Background worker service for periodic data synchronization and cache management.

> 📖 For system architecture, see [docs/architecture.md](../../docs/architecture.md)

## Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Database
DATABASE_URL="postgresql://..."

# Redis
REDIS_URL="redis://..."

# Worker Configuration
REFRESH_INTERVAL="300000"    # 5 minutes in milliseconds
CLEANUP_INTERVAL="3600000"   # 1 hour in milliseconds
```

## Jobs

### Dataset Refresh (`refresh-datasets.ts`)

**Purpose**: Keeps chart data fresh by periodically fetching updates from Notion.

**How it works**:
1. Queries all active datasets
2. Checks Notion's `last_edited_time` for changes
3. Fetches and processes updated data
4. Updates Redis cache
5. Updates `lastRefreshedAt` timestamp

**Schedule**: Every 5 minutes (configurable)

### Cache Cleanup (`cleanup-cache.ts`)

**Purpose**: Removes expired and unused cached data.

**How it works**:
1. Scans Redis for expired keys
2. Removes stale chart data
3. Cleans up orphaned cache entries

**Schedule**: Every 1 hour (configurable)

## Development

```bash
# Install dependencies (from root)
pnpm install

# Start worker in development mode
cd apps/worker
pnpm dev

# Or from root
pnpm --filter @notionchartkit/worker dev
```

## Build

```bash
# Build for production
pnpm build

# Run production worker
pnpm start
```

## Docker

Build and run the worker in a container:

```bash
# Build image
docker build -t notionchartkit-worker .

# Run container
docker run -d \
  --name worker \
  --env-file .env \
  notionchartkit-worker
```

## Adding New Jobs

1. Create a new file in `src/jobs/`:

```typescript
// src/jobs/my-job.ts
export async function myJob() {
  console.log('Running my job...');
  // Job logic here
}
```

2. Register the job in `src/index.ts`:

```typescript
import { myJob } from './jobs/my-job';

// Schedule the job
setInterval(async () => {
  await myJob();
}, 60000); // Every minute
```

## Dependencies

- **@notionchartkit/core**: Core business logic
- **@notionchartkit/contracts**: Zod schemas
- **@notionchartkit/db**: Prisma database client

## Monitoring

Monitor worker health and job execution:

```bash
# View logs
docker logs -f worker

# Check worker status
docker ps | grep worker
```

## Documentation

- **[Architecture](../../docs/architecture.md)** - Worker design and data flow
- **[Deployment](../../docs/deployment.md)** - Production deployment
- **[Runbooks](../../docs/runbooks.md)** - Operations and troubleshooting
