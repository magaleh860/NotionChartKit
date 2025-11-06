# Project Structure Overview

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

## Key Files & Their Purpose

### Root Configuration
- **package.json**: Monorepo scripts and dependencies
- **turbo.json**: Build pipeline configuration
- **pnpm-workspace.yaml**: Workspace package definitions
- **tsconfig.json**: Base TypeScript configuration
- **biome.json**: Linting and formatting configuration (replaces ESLint + Prettier)

### Web Application (apps/web)
- **src/app/api/**: RESTful API endpoints
- **src/app/dashboard/**: User dashboard
- **src/app/e/[publicKey]/**: Public chart embeds
- **next.config.js**: Next.js settings
- **tailwind.config.js**: UI styling configuration

### Worker (apps/worker)
- **src/index.ts**: Main worker loop
- **src/jobs/refresh-datasets.ts**: Periodic data refresh
- **src/jobs/cleanup-cache.ts**: Cache management
- **Dockerfile**: Container configuration

### Core Package (packages/core)
- **notion/fetch.ts**: Notion API integration
- **transform/normalize.ts**: Data transformation
- **transform/aggregate.ts**: Data aggregation
- **charts/generator.ts**: Chart data formatting

### Contracts Package (packages/contracts)
- **schemas/**: Zod validation schemas
- **openapi/generate.ts**: OpenAPI spec generator

### Database Package (packages/db)
- **prisma/schema.prisma**: Database schema definition
- **src/index.ts**: Prisma client singleton

### Infrastructure (infra)
- **docker-compose.yml**: PostgreSQL + Redis + GUI tools

### Documentation (docs)
- **architecture.md**: System design
- **api.md**: API documentation
- **runbooks.md**: Operations guide
- **deployment.md**: Deployment instructions
- **biome-setup.md**: Biome usage and configuration guide

### CI/CD (.github/workflows)
- **ci.yml**: Automated testing
- **deploy.yml**: Production deployment
- **release.yml**: Version releases

## Package Dependencies

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

## Environment Files

Each app/package with external dependencies has an `.env.example`:

- `apps/web/.env.example`: Web app configuration
- `apps/worker/.env.example`: Worker configuration
- `packages/db/.env.example`: Database connection

## Build Outputs

- **apps/web/.next/**: Next.js build output
- **apps/worker/dist/**: Compiled worker JavaScript
- **packages/*/dist/**: Compiled package exports
- **.turbo/**: Turborepo cache

## Development Workflow

1. **Install**: `pnpm install`
2. **Infrastructure**: `pnpm docker:up`
3. **Database**: `pnpm db:generate && pnpm db:push`
4. **Development**: `pnpm dev`
5. **Lint & Format**: `pnpm lint` or `pnpm lint:fix`
6. **Build**: `pnpm build`
7. **Test**: `pnpm test`
8. **Deploy**: Handled by GitHub Actions
