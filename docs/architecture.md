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

## Future Enhancements

- [ ] WebSocket support for real-time updates
- [ ] Multi-tenancy support
- [ ] Advanced chart customization
- [ ] Export to PNG/SVG
- [ ] Collaborative features
- [ ] Analytics dashboard
