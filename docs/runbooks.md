# Runbooks

## Development

### Initial Setup

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd notionchartkit
   pnpm install
   ```

2. **Start Local Infrastructure**
   ```bash
   pnpm docker:up
   ```

3. **Set Up Environment Variables**
   ```bash
   # In apps/web
   cp .env.example .env.local
   
   # In apps/worker
   cp .env.example .env
   
   # In packages/db
   cp .env.example .env
   ```

4. **Generate Prisma Client**
   ```bash
   pnpm db:generate
   ```

5. **Push Database Schema**
   ```bash
   pnpm db:push
   ```

6. **Start Development Servers**
   ```bash
   pnpm dev
   ```

### Common Tasks

#### Add a New Package
```bash
mkdir -p packages/my-package
cd packages/my-package
pnpm init
# Edit package.json to set name as @notionchartkit/my-package
```

#### Add Dependency to Workspace Package
```bash
# Add to specific package
pnpm --filter @notionchartkit/web add <package-name>

# Add to all packages
pnpm add -w <package-name>
```

#### Run Tests
```bash
pnpm test
```

#### Type Check All Packages
```bash
pnpm type-check
```

#### Format Code
```bash
pnpm format
```

## Database

### Create New Migration
```bash
cd packages/db
pnpm prisma migrate dev --name <migration-name>
```

### Reset Database
```bash
cd packages/db
pnpm prisma migrate reset
```

### Open Prisma Studio
```bash
pnpm db:studio
```

### Seed Database
```bash
cd packages/db
pnpm seed
```

## Production Deployment

### Build All Packages
```bash
pnpm build
```

### Environment Variables

Ensure these are set in production:

**Web App:**
- `DATABASE_URL`
- `REDIS_URL`
- `NOTION_CLIENT_ID`
- `NOTION_CLIENT_SECRET`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_APP_URL`

**Worker:**
- `DATABASE_URL`
- `REDIS_URL`
- `REFRESH_INTERVAL`
- `CLEANUP_INTERVAL`

### Deploy to Vercel (Web App)

1. Connect repository to Vercel
2. Set environment variables
3. Configure build settings:
   - Build Command: `cd ../.. && pnpm build --filter=@notionchartkit/web`
   - Output Directory: `apps/web/.next`
   - Install Command: `pnpm install`

### Deploy Worker

**Option 1: Docker**
```bash
cd apps/worker
docker build -t notionchartkit-worker .
docker run -d --env-file .env notionchartkit-worker
```

**Option 2: Node.js Server**
```bash
cd apps/worker
pnpm build
NODE_ENV=production node dist/index.js
```

## Troubleshooting

### Database Connection Issues

**Problem:** Cannot connect to PostgreSQL

**Solution:**
```bash
# Check if Docker container is running
docker ps | grep postgres

# Restart Docker services
pnpm docker:down
pnpm docker:up

# Check connection string
echo $DATABASE_URL
```

### Redis Connection Issues

**Problem:** Cannot connect to Redis

**Solution:**
```bash
# Check if Redis is running
docker ps | grep redis

# Test Redis connection
redis-cli ping

# Check Redis logs
docker logs notionchartkit-redis
```

### Build Failures

**Problem:** Build fails with module not found

**Solution:**
```bash
# Clean all node_modules and reinstall
pnpm clean
rm -rf node_modules
pnpm install

# Rebuild all packages
pnpm build
```

### Type Errors

**Problem:** TypeScript errors in imports

**Solution:**
```bash
# Generate Prisma client
pnpm db:generate

# Build all packages
pnpm build

# Check for circular dependencies
pnpm list --depth=0
```

## Monitoring

### Check Application Health

**Web App:**
```bash
curl http://localhost:3000/api/health
```

**Worker:**
```bash
# Check worker logs
docker logs -f notionchartkit-worker
```

### Database Queries

```sql
-- Check active datasets
SELECT COUNT(*) FROM datasets WHERE "isActive" = true;

-- Check chart view counts
SELECT SUM("viewCount") FROM charts;

-- Check recent refreshes
SELECT id, name, "lastRefreshedAt" 
FROM datasets 
WHERE "lastRefreshedAt" > NOW() - INTERVAL '1 hour';
```

### Redis Inspection

```bash
# Connect to Redis CLI
redis-cli

# Check cached datasets
KEYS dataset:*

# Check cache TTL
TTL dataset:abc-123:data

# Monitor Redis operations
MONITOR
```

## Maintenance

### Clear Cache

```bash
# Clear all Redis cache
redis-cli FLUSHALL

# Clear specific dataset cache
redis-cli DEL dataset:abc-123:data
```

### Backup Database

```bash
# Create backup
docker exec notionchartkit-postgres pg_dump -U postgres notionchartkit > backup.sql

# Restore backup
docker exec -i notionchartkit-postgres psql -U postgres notionchartkit < backup.sql
```

### Update Dependencies

```bash
# Check for outdated packages
pnpm outdated

# Update all dependencies
pnpm update --latest

# Update specific package
pnpm update <package-name> --latest
```
