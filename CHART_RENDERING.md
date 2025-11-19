# Chart Rendering Feature

## Overview
The Chart Rendering feature visualizes Notion data using Chart.js. It provides real-time chart rendering with support for bar, line, pie, and area charts.

## Components

### 1. Chart Data API Endpoint
**File:** `apps/web/src/app/api/charts/[id]/data/route.ts`

Processes chart data from Notion and formats it for Chart.js:
- Fetches chart configuration from database
- Retrieves data from Notion using the dataset's access token
- Normalizes Notion data to a consistent format
- Aggregates data based on chart configuration
- Formats data for Chart.js consumption
- Returns chart data, metadata, and chart type

**Response Format:**
```json
{
  "chartData": {
    "labels": ["Label 1", "Label 2"],
    "datasets": [{
      "label": "Dataset Name",
      "data": [10, 20],
      "backgroundColor": "rgba(54, 162, 235, 0.2)",
      "borderColor": "rgba(54, 162, 235, 1)",
      "borderWidth": 1
    }]
  },
  "metadata": {
    "title": "Chart Title",
    "xAxisLabel": "X-Axis",
    "yAxisLabel": "Y-Axis"
  },
  "type": "bar"
}
```

### 2. ChartRenderer Component
**File:** `apps/web/src/components/chart-renderer.tsx`

Reusable React component that renders charts using Chart.js:
- Fetches chart data from the API endpoint
- Displays loading state while data is being fetched
- Renders appropriate chart type (bar, line, pie, area)
- Handles errors gracefully
- Configurable height and title display

**Usage:**
```tsx
<ChartRenderer 
  chartId="chart-id" 
  height={400} 
  showTitle={true} 
/>
```

**Props:**
- `chartId` (string): The ID of the chart to render
- `height` (number, optional): Height of the chart in pixels (default: 300)
- `showTitle` (boolean, optional): Whether to show the chart title (default: true)

### 3. Public Embed Page
**File:** `apps/web/src/app/e/[publicKey]/page.tsx`

Public page for viewing and embedding charts:
- Accessible via `/e/[publicKey]` URL
- Fetches chart by public key
- Increments view count on each visit
- Displays chart with metadata and statistics
- Shows chart title, type, views, and last updated date

**Features:**
- Clean, embeddable design
- View count tracking
- Chart metadata display
- Responsive layout

### 4. Dashboard Chart Previews
**File:** `apps/web/src/components/chart-list.tsx`

Updated dashboard component with live chart previews:
- Displays chart preview thumbnails in grid layout
- Shows chart metadata (title, type, views, created date)
- Provides quick access to view and share charts
- Copy chart URL to clipboard functionality

## Chart Types Supported

1. **Bar Chart**: Vertical bars for comparing categories
2. **Line Chart**: Connected points showing trends over time
3. **Pie Chart**: Circular segments showing proportions
4. **Area Chart**: Line chart with filled area below the line

## Data Flow

```
Notion Database 
  ↓
fetchNotionData() (from @notionchartkit/core)
  ↓
normalizeData() (standardize format)
  ↓
aggregateData() (count, sum, avg, etc.)
  ↓
Format for Chart.js
  ↓
ChartRenderer component
  ↓
Display to user
```

## Technologies Used

- **Chart.js 4.x**: Canvas-based charting library
- **react-chartjs-2**: React wrapper for Chart.js
- **@notionchartkit/core**: Core data processing functions
- **Next.js 14 App Router**: Server-side rendering and API routes
- **TypeScript**: Type-safe development

## Next Steps

1. **Test the feature**: Create a chart and verify it renders correctly
2. **Add caching**: Implement Redis caching for improved performance
3. **Enhance aggregations**: Add more aggregation options (sum, avg, min, max)
4. **Customize styles**: Add theme customization for charts
5. **Export functionality**: Allow users to download charts as images

## Testing

To test the chart rendering feature:

1. Ensure you have a Notion connection set up
2. Create a dataset from a Notion database
3. Configure a chart for the dataset
4. Navigate to the dashboard to see the chart preview
5. Click "View" to see the full chart on the embed page
6. Share the public URL with others

## Development Server

The dev server is running on: http://localhost:3001

## Files Modified/Created

### Created:
- `apps/web/src/app/api/charts/[id]/data/route.ts`
- `apps/web/src/components/chart-renderer.tsx`

### Modified:
- `apps/web/package.json` (added Chart.js dependencies)
- `apps/web/src/app/e/[publicKey]/page.tsx` (implemented chart rendering)
- `apps/web/src/components/chart-list.tsx` (added chart previews)
