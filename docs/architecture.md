# NotionChartKit Architecture

## Overview

NotionChartKit is a full-stack application that enables users to create embeddable charts from Notion databases. The system is built as a monorepo using Turborepo, with clear separation between frontend, backend, worker processes, and shared packages.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
├─────────────────────────────────────────────────────────────┤
│  Next.js App Router (React)  │  Public Embed Pages          │
│  - Dashboard UI              │  - /e/:publicKey             │
│  - Dataset Management        │  - Chart Rendering           │
│  - Chart Configuration       │  - Recharts Integration      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Layer (Next.js)                      │
├─────────────────────────────────────────────────────────────┤
│  API Routes                  │  Middleware                  │
│  - /api/auth                 │  - Authentication            │
│  - /api/datasets             │  - Rate Limiting             │
│  - /api/charts               │  - CORS                      │
│  - /api/connections          │  - Validation (Zod)          │
└─────────────────────────────────────────────────────────────┘
                              │
            ┌─────────────────┼─────────────────┐
            ▼                 ▼                 ▼
┌──────────────────┐  ┌──────────────┐  ┌──────────────┐
│   Redis Cache    │  │  PostgreSQL  │  │ Notion API   │
│                  │  │              │  │              │
│ - Chart Data     │  │ - Users      │  │ - OAuth 2.0  │
│ - Rate Limits    │  │ - Datasets   │  │ - Databases  │
│ - Sessions       │  │ - Charts     │  │ - Query      │
└──────────────────┘  └──────────────┘  └──────────────┘
            ▲                 ▲
            └─────────────────┘
                     │
                     ▼
         ┌─────────────────────────┐
         │   Background Worker     │
         ├─────────────────────────┤
         │  - Dataset Refresh CRON │
         │  - Cache Invalidation   │
         │  - Data Synchronization │
         └─────────────────────────┘
```

## Technology Stack

### Frontend
- **Next.js 14** (App Router) - React framework with SSR/SSG
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Chart rendering

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - ORM for PostgreSQL
- **Zod** - Runtime schema validation
- **NextAuth.js** - Authentication (Notion OAuth)

### Data Layer
- **PostgreSQL** (Neon) - Relational database
- **Redis** (Upstash) - Caching and rate limiting

### Infrastructure
- **Turborepo** - Monorepo build system
- **pnpm** - Package manager
- **Docker Compose** - Local development
- **GitHub Actions** - CI/CD

## Monorepo Structure

```
/apps
  /web       → Next.js frontend + API routes
  /worker    → Background job processor

/packages
  /core      → Notion API integration & data transformation
  /contracts → Zod schemas & OpenAPI specs
  /db        → Prisma schema & client

/infra       → Docker Compose configurations
/docs        → Architecture & runbooks
```

## Detailed Project Structure

```
notionchartkit/
├─── apps/
│    ├─── web/                          # Next.js web application
│    │    ├─── src/
│    │    │    ├─── app/
│    │    │    │    ├─── api/           # API routes
│    │    │    │    │    ├─── datasets/ # Dataset CRUD endpoints
│    │    │    │    │    └─── charts/   # Chart endpoints
│    │    │    │    ├─── dashboard/     # Dashboard page
│    │    │    │    ├─── e/[publicKey]/ # Public embed pages
│    │    │    │    ├─── layout.tsx     # Root layout
│    │    │    │    ├─── page.tsx       # Home page
│    │    │    │    └─── globals.css    # Global styles
│    │    │    └─── lib/                # Utilities
│    │    │         └─── redis.ts       # Redis client
│    │    ├─── .env.example             # Environment template
│    │    ├─── next.config.js           # Next.js config
│    │    ├─── tailwind.config.js       # Tailwind config
│    │    ├─── postcss.config.js        # PostCSS config
│    │    └─── package.json
│    │
│    └─── worker/                       # Background worker
│         ├─── src/
│         │    ├─── jobs/
│         │    │    ├─── refresh-datasets.ts  # Data refresh job
│         │    │    └─── cleanup-cache.ts     # Cache cleanup job
│         │    └─── index.ts            # Worker entry point
│         ├─── .env.example
│         ├─── Dockerfile
│         └─── package.json
│
├─── packages/
│    ├─── core/                         # Core Notion logic
│    │    ├─── src/
│    │    │    ├─── notion/
│    │    │    │    └─── fetch.ts       # Notion API client
│    │    │    ├─── transform/
│    │    │    │    ├─── normalize.ts   # Data normalization
│    │    │    │    └─── aggregate.ts   # Data aggregation
│    │    │    ├─── charts/
│    │    │    │    └─── generator.ts   # Chart data generator
│    │    │    ├─── types.ts            # Type definitions
│    │    │    └─── index.ts
│    │    └─── package.json
│    │
│    ├─── contracts/                    # Zod schemas
│    │    ├─── src/
│    │    │    ├─── schemas/
│    │    │    │    ├─── user.ts        # User schema
│    │    │    │    ├─── connection.ts  # Connection schema
│    │    │    │    ├─── dataset.ts     # Dataset schema
│    │    │    │    ├─── chart.ts       # Chart schema
│    │    │    │    └─── common.ts      # Common schemas
│    │    │    ├─── openapi/
│    │    │    │    └─── generate.ts    # OpenAPI generator
│    │    │    └─── index.ts
│    │    └─── package.json
│    │
│    └─── db/                           # Prisma database
│         ├─── prisma/
│         │    ├─── schema.prisma       # Database schema
│         │    └─── seed.ts             # Database seeder
│         ├─── src/
│         │    └─── index.ts            # Prisma client export
│         ├─── .env.example
│         └─── package.json
│
├─── infra/
│    ├─── docker-compose.yml            # Local infrastructure
│    └─── README.md                     # Infrastructure docs
│
├─── docs/
│    ├─── architecture.md               # System architecture
│    ├─── api.md                        # API reference
│    ├─── runbooks.md                   # Operational guides
│    ├─── deployment.md                 # Deployment guide
│    └─── biome-setup.md                # Biome linting/formatting guide
│
├─── .github/
│    └─── workflows/
│         ├─── ci.yml                   # Continuous integration
│         ├─── deploy.yml               # Deployment workflow
│         ├─── release.yml              # Release workflow
│         └─── dependency-review.yml    # Dependency checks
│
├─── .vscode/
│    ├─── extensions.json               # Recommended extensions
│    └─── settings.json                 # VS Code settings
│
├─── .gitignore
├─── biome.json                         # Biome config (linting + formatting)
├─── .biomeignore                       # Biome ignore patterns
├─── .npmrc                             # pnpm config
├─── .dockerignore
├─── package.json                       # Root package.json
├─── pnpm-workspace.yaml                # pnpm workspace config
├─── turbo.json                         # Turborepo config
├─── tsconfig.json                      # TypeScript config
├─── README.md                          # Main documentation
├─── QUICKSTART.md                      # Quick start guide
├─── CONTRIBUTING.md                    # Contribution guidelines
├─── CHANGELOG.md                       # Version history
└─── LICENSE                            # MIT License
```

### Key Files & Their Purpose

#### Root Configuration
- **package.json**: Monorepo scripts and dependencies
- **turbo.json**: Build pipeline configuration
- **pnpm-workspace.yaml**: Workspace package definitions
- **tsconfig.json**: Base TypeScript configuration
- **biome.json**: Linting and formatting configuration (replaces ESLint + Prettier)

#### Web Application (apps/web)
- **src/app/api/**: RESTful API endpoints
- **src/app/dashboard/**: User dashboard
- **src/app/e/[publicKey]/**: Public chart embeds
- **next.config.js**: Next.js settings
- **tailwind.config.js**: UI styling configuration

#### Worker (apps/worker)
- **src/index.ts**: Main worker loop
- **src/jobs/refresh-datasets.ts**: Periodic data refresh
- **src/jobs/cleanup-cache.ts**: Cache management
- **Dockerfile**: Container configuration

#### Core Package (packages/core)
- **notion/fetch.ts**: Notion API integration
- **transform/normalize.ts**: Data transformation
- **transform/aggregate.ts**: Data aggregation
- **charts/generator.ts**: Chart data formatting

#### Contracts Package (packages/contracts)
- **schemas/**: Zod validation schemas
- **openapi/generate.ts**: OpenAPI spec generator

#### Database Package (packages/db)
- **prisma/schema.prisma**: Database schema definition
- **src/index.ts**: Prisma client singleton

#### Infrastructure (infra)
- **docker-compose.yml**: PostgreSQL + Redis + GUI tools

#### Documentation (docs)
- **architecture.md**: System design
- **api.md**: API documentation
- **runbooks.md**: Operations guide
- **deployment.md**: Deployment instructions
- **biome-setup.md**: Biome usage and configuration guide

#### CI/CD (.github/workflows)
- **ci.yml**: Automated testing
- **deploy.yml**: Production deployment
- **release.yml**: Version releases

### Package Dependencies

```
apps/web
  ├─ @notionchartkit/contracts
  ├─ @notionchartkit/core
  └─ @notionchartkit/db

apps/worker
  ├─ @notionchartkit/contracts
  ├─ @notionchartkit/core
  └─ @notionchartkit/db

packages/core
  └─ @notionchartkit/contracts

packages/contracts
  └─ (no internal deps)

packages/db
  └─ (no internal deps)
```

### Environment Files

Each app/package with external dependencies has an `.env.example`:

- `apps/web/.env.example`: Web app configuration
- `apps/worker/.env.example`: Worker configuration
- `packages/db/.env.example`: Database connection

### Build Outputs

- **apps/web/.next/**: Next.js build output
- **apps/worker/dist/**: Compiled worker JavaScript
- **packages/*/dist/**: Compiled package exports
- **.turbo/**: Turborepo cache

## Data Flow

### 1. Dataset Creation
```
User → Web UI → API (/api/datasets)
  ↓
Validate with Zod (@notionchartkit/contracts)
  ↓
Store in PostgreSQL via Prisma (@notionchartkit/db)
  ↓
Trigger initial data fetch from Notion (@notionchartkit/core)
  ↓
Cache processed data in Redis
```

### 2. Chart Rendering
```
User visits /e/:publicKey
  ↓
Check Redis cache for chart data
  ↓
If cached: Return immediately
  ↓
If not: Fetch from Notion → Process → Cache → Return
```

### 3. Background Refresh
```
Worker CRON triggers (@notionchartkit/worker)
  ↓
Query datasets needing refresh (based on last_edited_time)
  ↓
Fetch updated data from Notion
  ↓
Normalize & aggregate data
  ↓
Update Redis cache
  ↓
Update lastRefreshedAt timestamp
```

## Security Considerations

1. **Authentication**: OAuth 2.0 with Notion
2. **Rate Limiting**: Redis-based per-user limits
3. **Data Validation**: Zod schemas on all inputs
4. **CORS**: Configurable for embed domains
5. **Secret Management**: Environment variables

## Scalability

- **Horizontal Scaling**: Stateless API routes
- **Caching Strategy**: Redis with TTL
- **Database**: Connection pooling with Prisma
- **Background Jobs**: Distributed queue-based workers (future)

## Monitoring & Observability

- **Logs**: Structured logging (future: Loki)
- **Metrics**: Performance tracking (future: Prometheus)
- **Traces**: Request tracing (future: OpenTelemetry)
- **Alerts**: Error monitoring (future: Sentry)

## Development Workflow

1. **Install**: `pnpm install`
2. **Infrastructure**: `pnpm docker:up`
3. **Database**: `pnpm db:generate && pnpm db:push`
4. **Development**: `pnpm dev`
5. **Lint & Format**: `pnpm lint` or `pnpm lint:fix`
6. **Build**: `pnpm build`
7. **Test**: `pnpm test`
8. **Deploy**: Handled by GitHub Actions

## Future Enhancements

- [ ] WebSocket support for real-time updates
- [ ] Multi-tenancy support
- [ ] Advanced chart customization
- [ ] Export to PNG/SVG
- [ ] Collaborative features
- [ ] Analytics dashboard
