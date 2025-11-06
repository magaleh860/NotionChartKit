# NotionChartKit Infrastructure

This directory contains infrastructure configuration for local development and testing.

## Docker Compose

### Services

- **postgres**: PostgreSQL 16 database
- **redis**: Redis 7 for caching and rate limiting
- **redis-commander** (optional): Web UI for Redis
- **pgadmin** (optional): Web UI for PostgreSQL

### Quick Start

Start core services (Postgres + Redis):
```bash
docker-compose up -d
```

Start with management tools:
```bash
docker-compose --profile tools up -d
```

Stop all services:
```bash
docker-compose down
```

Stop and remove volumes:
```bash
docker-compose down -v
```

### Service URLs

- **Postgres**: `localhost:5432`
  - User: `postgres`
  - Password: `postgres`
  - Database: `notionchartkit`

- **Redis**: `localhost:6379`

- **pgAdmin** (optional): http://localhost:8080
  - Email: `admin@notionchartkit.com`
  - Password: `admin`

- **Redis Commander** (optional): http://localhost:8081

### Environment Variables

The services use default credentials for local development. For production, make sure to:

1. Use strong passwords
2. Configure SSL/TLS
3. Set up proper network isolation
4. Configure backup strategies

## Monitoring (Future)

Planned additions:
- Grafana for metrics visualization
- Prometheus for metrics collection
- Loki for log aggregation
