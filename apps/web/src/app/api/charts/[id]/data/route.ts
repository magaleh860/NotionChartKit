import {
  type NotionDataConfig,
  aggregateData,
  fetchNotionData,
  normalizeData,
} from '@notionchartkit/core';
import { prisma } from '@notionchartkit/db';
import { type NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET /api/charts/:id/data - Get processed chart data
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Fetch chart with dataset and connection info
    const chart = await prisma.chart.findUnique({
      where: { id },
      include: {
        dataset: {
          include: {
            connection: true,
          },
        },
      },
    });

    if (!chart) {
      return NextResponse.json({ error: 'Chart not found' }, { status: 404 });
    }

    // Fetch raw data from Notion
    const config = chart.dataset.config as unknown as NotionDataConfig;
    const notionData = await fetchNotionData(
      chart.dataset.connection.accessToken,
      chart.dataset.databaseId,
      config
    );

    // Normalize the Notion data
    const normalizedData = normalizeData(notionData);

    // Get aggregation configuration from chart metadata
    const metadata = chart.metadata as {
      title?: string;
      xAxisLabel?: string;
      yAxisLabel?: string;
      groupByProperty?: string;
      aggregationType?: 'count' | 'sum' | 'avg' | 'min' | 'max';
      valueProperty?: string;
    } | null;

    // Apply aggregation based on chart configuration
    const aggregatedData = aggregateData(normalizedData, {
      groupBy: metadata?.groupByProperty,
      aggregationType: metadata?.aggregationType || 'count',
      aggregateField: metadata?.valueProperty,
    });

    // Format for Chart.js
    const chartData = {
      labels: aggregatedData.map((item) => item.name),
      datasets: [
        {
          label: metadata?.title || chart.dataset.name,
          data: aggregatedData.map((item) => item.value),
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    return NextResponse.json({
      chartData,
      metadata: {
        title: metadata?.title,
        xAxisLabel: metadata?.xAxisLabel,
        yAxisLabel: metadata?.yAxisLabel,
      },
      type: chart.type,
    });
  } catch (error) {
    console.error('Failed to fetch chart data:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch chart data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
