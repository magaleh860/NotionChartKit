# Deployment Guide

## Vercel (Web App)

### Prerequisites
- Vercel account
- PostgreSQL database (Neon recommended)
- Redis instance (Upstash recommended)
- Notion OAuth app credentials

### Steps

1. **Install Vercel CLI**
   ```bash
   pnpm add -g vercel
   ```

2. **Link Project**
   ```bash
   cd apps/web
   vercel link
   ```

3. **Set Environment Variables**
   
   In Vercel Dashboard:
   - `DATABASE_URL` - PostgreSQL connection string
   - `REDIS_URL` - Redis connection string
   - `NOTION_CLIENT_ID` - From Notion OAuth app
   - `NOTION_CLIENT_SECRET` - From Notion OAuth app
   - `NEXTAUTH_URL` - Your production URL
   - `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
   - `NEXT_PUBLIC_APP_URL` - Your production URL

4. **Deploy**
   ```bash
   vercel --prod
   ```

### Build Configuration

In Vercel project settings:
- **Framework Preset**: Next.js
- **Root Directory**: `apps/web`
- **Build Command**: `cd ../.. && pnpm build --filter=@notionchartkit/web`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`
- **Node.js Version**: 18.x

## Railway (Worker)

### Prerequisites
- Railway account
- Same database and Redis as web app

### Steps

1. **Create New Project**
   ```bash
   railway login
   railway init
   ```

2. **Set Environment Variables**
   ```bash
   railway variables set DATABASE_URL="..."
   railway variables set REDIS_URL="..."
   railway variables set REFRESH_INTERVAL="300000"
   railway variables set CLEANUP_INTERVAL="3600000"
   ```

3. **Deploy**
   ```bash
   railway up
   ```

### Dockerfile (apps/worker/Dockerfile)

```dockerfile
FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable pnpm && pnpm build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 worker

COPY --from=builder --chown=worker:nodejs /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER worker

CMD ["node", "dist/index.js"]
```

## Database Setup (Neon)

1. **Create Project**
   - Go to https://neon.tech
   - Create new project
   - Copy connection string

2. **Run Migrations**
   ```bash
   cd packages/db
   DATABASE_URL="..." pnpm prisma migrate deploy
   ```

3. **Seed Database (Optional)**
   ```bash
   DATABASE_URL="..." pnpm seed
   ```

## Redis Setup (Upstash)

1. **Create Database**
   - Go to https://upstash.com
   - Create new Redis database
   - Copy connection URL

2. **Configure**
   - Add URL to environment variables
   - No migration needed

## Notion OAuth Setup

1. **Create Integration**
   - Go to https://www.notion.so/my-integrations
   - Create new integration
   - Set redirect URI: `https://yourdomain.com/api/auth/callback/notion`

2. **Get Credentials**
   - Copy Client ID
   - Copy Client Secret
   - Add to environment variables

## CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm build --filter=@notionchartkit/web
      
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: apps/web

  deploy-worker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm build --filter=@notionchartkit/worker
      
      - uses: bensadeh/railway-deploy@v1
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: worker
```

## Post-Deployment Checklist

- [ ] Verify database connection
- [ ] Verify Redis connection
- [ ] Test Notion OAuth flow
- [ ] Create test dataset
- [ ] Generate test chart
- [ ] Test public embed
- [ ] Monitor error logs
- [ ] Set up uptime monitoring
- [ ] Configure custom domain
- [ ] Set up SSL certificate
