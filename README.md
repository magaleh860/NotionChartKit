# NotionChartKit

A full-stack charting system for Notion databases. Connect via the Notion API, normalize and aggregate database data, cache results, and serve embeddable charts that update automatically.

## Architecture

- **Framework**: Next.js (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API routes (serverless) using `@notionhq/client`
- **Cache / Queue**: Redis (Upstash) for caching datasets + rate limiting
- **Database**: Postgres (Neon) for users, connections, and dataset configs
- **Worker**: Lightweight Node script (CRON or queue) for periodic refreshes
- **Infra**: Docker Compose (Postgres + Redis) + pnpm workspace + Turborepo

## Monorepo Structure

```
/apps
  /web       → Next.js UI + API routes + public embeds
  /worker    → CRON/queue processor for background refresh
/packages
  /core      → Notion fetch + normalize + aggregate logic
  /contracts → zod schemas → OpenAPI generator
  /db        → Prisma schema + migrations
/infra       → docker-compose, Grafana, test configs
/docs        → architecture diagrams, ADRs, runbooks
```

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8
- Docker & Docker Compose

### Installation

```bash
# Install dependencies
pnpm install

# Start local infrastructure (Postgres + Redis)
pnpm docker:up

# Generate Prisma client
pnpm db:generate

# Push database schema
pnpm db:push

# Start development servers
pnpm dev
```

### Environment Variables

Copy `.env.example` to `.env.local` in `apps/web` and configure:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/notionchartkit
REDIS_URL=redis://localhost:6379
NOTION_CLIENT_ID=your_client_id
NOTION_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Packages

- **@notionchartkit/web** - Next.js frontend and API
- **@notionchartkit/worker** - Background refresh worker
- **@notionchartkit/core** - Notion data processing logic
- **@notionchartkit/contracts** - Shared Zod schemas
- **@notionchartkit/db** - Prisma database client

## Development

```bash
# Run all apps in development mode
pnpm dev

# Build all packages
pnpm build

# Run linting
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Type checking
pnpm type-check
```

## Testing

```bash
pnpm test
```

## Deployment

See [docs/deployment.md](./docs/deployment.md) for deployment instructions.

## Documentation

- [Architecture](./docs/architecture.md)
- [API Reference](./docs/api.md)
- [Runbooks](./docs/runbooks.md)

## What This Demonstrates

- Full-stack TypeScript (Next + Node + Postgres + Redis)
- OAuth 2.0, caching, background jobs, and API design
- Shared contracts and types across frontend/backend
- Real-world architecture in a clean, portable monorepo

## License

MIT
