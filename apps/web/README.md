# @notionchartkit/web

Next.js 14 web application with App Router for creating and managing embeddable charts from Notion databases.

> 📖 For system architecture and design decisions, see [docs/architecture.md](../../docs/architecture.md)

## Quick Start

## Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Database
DATABASE_URL="postgresql://..."

# Redis
REDIS_URL="redis://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-secret-key"

# Notion OAuth
NOTION_CLIENT_ID="your-notion-client-id"
NOTION_CLIENT_SECRET="your-notion-client-secret"
NOTION_REDIRECT_URI="http://localhost:3001/api/auth/callback/notion"
```

## Development

```bash
# Install dependencies (from root)
pnpm install

# Start dev server
pnpm dev

# Or run only web app
cd apps/web
pnpm dev
```

The app will be available at http://localhost:3001

## Build

```bash
# Production build
pnpm build

# Start production server
pnpm start
```

## Key Routes

- `/dashboard` - User dashboard
- `/charts/create` - Create new chart
- `/charts/[id]/edit` - Edit chart
- `/e/[publicKey]` - Public embed page

API endpoints are documented in [docs/api.md](../../docs/api.md)

## Dependencies

- **Next.js 14**: React framework with App Router
- **NextAuth.js**: Authentication
- **Recharts**: Chart rendering
- **Tailwind CSS**: Styling
- **@notionchartkit/core**: Core business logic
- **@notionchartkit/contracts**: Zod schemas
- **@notionchartkit/db**: Prisma database client

## Testing

```bash
# Run tests
pnpm test

# Run type check
pnpm type-check

# Run linter
pnpm lint
```

## Documentation

- **[Architecture](../../docs/architecture.md)** - System design and data flow
- **[API Reference](../../docs/api.md)** - API endpoint documentation
- **[Deployment](../../docs/deployment.md)** - Production deployment guide
- **[Runbooks](../../docs/runbooks.md)** - Operational procedures
