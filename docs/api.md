# API Reference

## Authentication

### OAuth Flow

#### Initiate Notion OAuth
```
GET /api/auth/notion
```

Redirects user to Notion OAuth consent page.

#### OAuth Callback
```
GET /api/auth/callback/notion?code={code}
```

Handles OAuth callback and exchanges code for access token.

## Datasets

### List Datasets
```
GET /api/datasets
```

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20)

**Response:**
```json
{
  "datasets": [
    {
      "id": "uuid",
      "name": "Sales Dashboard",
      "databaseId": "notion-db-id",
      "isActive": true,
      "lastRefreshedAt": "2024-01-01T00:00:00Z",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50
  }
}
```

### Create Dataset
```
POST /api/datasets
```

**Request Body:**
```json
{
  "connectionId": "uuid",
  "name": "Sales Dashboard",
  "databaseId": "notion-db-id",
  "config": {
    "groupBy": "status",
    "aggregateField": "amount",
    "aggregationType": "sum"
  },
  "refreshIntervalMinutes": 60
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Sales Dashboard",
  "databaseId": "notion-db-id",
  "config": { ... },
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Get Dataset
```
GET /api/datasets/:id
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Sales Dashboard",
  "databaseId": "notion-db-id",
  "config": { ... },
  "isActive": true,
  "charts": [
    {
      "id": "uuid",
      "type": "bar",
      "publicKey": "abc123"
    }
  ]
}
```

### Update Dataset
```
PATCH /api/datasets/:id
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "isActive": false,
  "config": { ... }
}
```

### Delete Dataset
```
DELETE /api/datasets/:id
```

**Response:**
```json
{
  "success": true
}
```

## Charts

### List Charts
```
GET /api/charts?datasetId={uuid}
```

**Response:**
```json
{
  "charts": [
    {
      "id": "uuid",
      "datasetId": "uuid",
      "type": "bar",
      "publicKey": "abc123",
      "viewCount": 1234,
      "isPublic": true,
      "embedCode": "<iframe src=\"...\"></iframe>"
    }
  ]
}
```

### Create Chart
```
POST /api/charts
```

**Request Body:**
```json
{
  "datasetId": "uuid",
  "type": "bar",
  "metadata": {
    "title": "Sales by Status",
    "xAxisLabel": "Status",
    "yAxisLabel": "Amount"
  },
  "isPublic": true
}
```

**Response:**
```json
{
  "id": "uuid",
  "datasetId": "uuid",
  "type": "bar",
  "publicKey": "abc123",
  "embedCode": "<iframe src=\"https://app.notionchartkit.com/e/abc123\" width=\"600\" height=\"400\"></iframe>",
  "isPublic": true
}
```

### Get Chart Data
```
GET /api/charts/:id/data
```

**Response:**
```json
{
  "type": "bar",
  "data": [
    { "name": "In Progress", "value": 12500 },
    { "name": "Completed", "value": 45000 },
    { "name": "Pending", "value": 8500 }
  ],
  "metadata": {
    "title": "Sales by Status",
    "xAxisLabel": "Status",
    "yAxisLabel": "Amount"
  }
}
```

### Update Chart
```
PATCH /api/charts/:id
```

**Request Body:**
```json
{
  "metadata": {
    "title": "Updated Title"
  },
  "isPublic": false
}
```

### Delete Chart
```
DELETE /api/charts/:id
```

## Public Embeds

### Get Embed Chart
```
GET /e/:publicKey
```

Renders a public embed page with the chart.

**Query Parameters:**
- `theme` (string, optional): `light` or `dark`
- `width` (number, optional): Chart width
- `height` (number, optional): Chart height

## Error Responses

All errors follow this format:

```json
{
  "error": "Error code",
  "message": "Human-readable error message",
  "details": { ... }
}
```

**Common Error Codes:**
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

## Rate Limits

- **Authenticated requests**: 1000 requests/hour
- **Public embeds**: 10000 requests/hour per IP
- **Chart data**: Cached for 5 minutes

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640000000
```
