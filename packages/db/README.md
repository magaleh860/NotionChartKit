# @notionchartkit/db

Prisma ORM setup with PostgreSQL schema for users, connections, datasets, and charts.

> 📖 For database schema details, see [docs/architecture.md](../../docs/architecture.md)

## Environment Variables

Create a `.env` file in the package root or project root:

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/notionchartkit?schema=public"
```

For development with Docker:
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/notionchartkit?schema=public"
```

## Database Models

- **User** - User accounts with Notion OAuth
- **Connection** - Notion workspace connections
- **Dataset** - Notion database configurations
- **Chart** - Chart configurations and metadata

See `prisma/schema.prisma` for full schema definitions.

## Usage

### Prisma Client

```typescript
import { prisma } from '@notionchartkit/db';

// Query users
const users = await prisma.user.findMany();

// Create a chart
const chart = await prisma.chart.create({
  data: {
    userId: 'user-id',
    datasetId: 'dataset-id',
    title: 'My Chart',
    type: 'bar',
    configuration: {
      xProperty: 'Status',
      yProperty: 'Count',
      aggregationType: 'count'
    }
  }
});

// Update with relations
const dataset = await prisma.dataset.update({
  where: { id: 'dataset-id' },
  data: { lastRefreshedAt: new Date() },
  include: {
    charts: true,
    connection: true
  }
});
```

### Transactions

```typescript
import { prisma } from '@notionchartkit/db';

await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: { email: 'user@example.com' }
  });
  
  const connection = await tx.connection.create({
    data: {
      userId: user.id,
      notionWorkspaceId: 'workspace-id',
      notionWorkspaceName: 'My Workspace',
      accessToken: 'token',
      botId: 'bot-id'
    }
  });
});
```

## Commands

### Generate Prisma Client

```bash
pnpm db:generate
```

### Create Migration

```bash
pnpm db:migrate:dev
```

### Apply Migrations

```bash
# Development
pnpm db:push

# Production
pnpm db:migrate:deploy
```

### Seed Database

```bash
pnpm db:seed
```

### Reset Database

```bash
pnpm db:reset
```

### Open Prisma Studio

```bash
pnpm db:studio
```

## Development Workflow

1. **Modify schema**: Edit `prisma/schema.prisma`
2. **Create migration**: `pnpm db:migrate:dev --name description`
3. **Generate client**: `pnpm db:generate`
4. **Apply changes**: `pnpm db:push` (dev) or `pnpm db:migrate:deploy` (prod)

## Seeding

The `seed.ts` file populates the database with test data:

```typescript
// prisma/seed.ts
import { prisma } from '../src';

async function main() {
  // Create test user
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User'
    }
  });
  
  // Create test connection
  const connection = await prisma.connection.create({
    data: {
      userId: user.id,
      notionWorkspaceId: 'test-workspace',
      notionWorkspaceName: 'Test Workspace',
      accessToken: 'test-token',
      botId: 'test-bot'
    }
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run with: `pnpm db:seed`

## Connection Pooling

Prisma automatically handles connection pooling. Configure in `schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Optional: Configure connection pool
  // relationMode = "prisma"
}
```

## Tips

- Use transactions for multi-step operations
- Only include relations when needed
- Run `pnpm db:generate` after schema changes
- See [docs/runbooks.md](../../docs/runbooks.md) for troubleshooting
