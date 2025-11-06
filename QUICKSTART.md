# Quick Start Guide

## Prerequisites

- Node.js >= 18
- pnpm >= 8
- Docker Desktop

## Setup (5 minutes)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Infrastructure

```bash
pnpm docker:up
```

This starts PostgreSQL and Redis in Docker containers.

### 3. Setup Database

```bash
# Generate Prisma Client
pnpm db:generate

# Push schema to database
pnpm db:push

# (Optional) Seed with demo data
pnpm db:seed
```

### 4. Configure Environment

```bash
# Copy environment files
cp apps/web/.env.example apps/web/.env.local
cp apps/worker/.env.example apps/worker/.env
cp packages/db/.env.example packages/db/.env
```

### 5. Start Development Servers

```bash
pnpm dev
```

This starts:
- Web app at http://localhost:3000
- Worker in the background

## What's Next?

1. **Set up Notion OAuth**
   - Create an integration at https://www.notion.so/my-integrations
   - Add credentials to `apps/web/.env.local`

2. **Explore the app**
   - Visit http://localhost:3000
   - Check the dashboard at http://localhost:3000/dashboard

3. **View documentation**
   - Architecture: [docs/architecture.md](./docs/architecture.md)
   - API Reference: [docs/api.md](./docs/api.md)
   - Runbooks: [docs/runbooks.md](./docs/runbooks.md)

## Troubleshooting

**Port already in use?**
```bash
# Stop Docker containers
pnpm docker:down

# Restart
pnpm docker:up
```

**Database issues?**
```bash
# Reset database
pnpm db:push --force-reset
```

**Build errors?**
```bash
# Clean and reinstall
pnpm clean
rm -rf node_modules
pnpm install
```

## Need Help?

- Check [docs/runbooks.md](./docs/runbooks.md) for common tasks
- See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines
- Open an issue on GitHub
