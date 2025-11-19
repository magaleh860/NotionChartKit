'use client';

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string | string[];
    borderColor: string | string[];
    borderWidth: number;
    fill?: boolean;
  }[];
}

interface ChartMetadata {
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

interface ChartRendererProps {
  chartId: string;
  height?: number;
  showTitle?: boolean;
}

export function ChartRenderer({ chartId, height = 300, showTitle = true }: ChartRendererProps) {
  const [data, setData] = useState<ChartData | null>(null);
  const [metadata, setMetadata] = useState<ChartMetadata | null>(null);
  const [type, setType] = useState<'bar' | 'line' | 'pie' | 'area'>('bar');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChartData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/charts/${chartId}/data`);

        if (!response.ok) {
          throw new Error('Failed to fetch chart data');
        }

        const result = await response.json();
        setData(result.chartData);
        setMetadata(result.metadata);
        setType(result.type);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchChartData();
  }, [chartId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center text-red-500" style={{ height }}>
        Error: {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center text-gray-500" style={{ height }}>
        No data available
      </div>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      title: {
        display: showTitle && !!metadata?.title,
        text: metadata?.title || '',
      },
    },
    scales:
      type !== 'pie'
        ? {
            x: {
              title: {
                display: !!metadata?.xAxisLabel,
                text: metadata?.xAxisLabel || '',
              },
            },
            y: {
              title: {
                display: !!metadata?.yAxisLabel,
                text: metadata?.yAxisLabel || '',
              },
            },
          }
        : undefined,
  };

  // Prepare data for area chart (line with fill)
  const areaData =
    type === 'area'
      ? {
          ...data,
          datasets: data.datasets.map((dataset) => ({
            ...dataset,
            fill: true,
          })),
        }
      : data;

  return (
    <div style={{ height }}>
      {type === 'bar' && <Bar data={data} options={options} />}
      {type === 'line' && <Line data={data} options={options} />}
      {type === 'area' && <Line data={areaData} options={options} />}
      {type === 'pie' && <Pie data={data} options={options} />}
    </div>
  );
}
