'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChartRenderer } from './chart-renderer';

interface Chart {
  id: string;
  publicKey: string;
  type: string;
  metadata: {
    title?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
  };
  isPublic: boolean;
  viewCount: number;
  createdAt: string;
  dataset: {
    name: string;
  };
}

export function ChartList() {
  const router = useRouter();
  const [charts, setCharts] = useState<Chart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCharts() {
      try {
        setLoading(true);
        const response = await fetch('/api/charts');

        if (!response.ok) {
          throw new Error('Failed to fetch charts');
        }

        const data = await response.json();
        setCharts(data.charts);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load charts');
        console.error('Error fetching charts:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCharts();
  }, []);

  if (loading) {
    return (
      <div className="p-6 border rounded-lg bg-white">
        <p className="text-gray-600">Loading charts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 border rounded-lg bg-white">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (charts.length === 0) {
    return (
      <div className="p-6 border rounded-lg bg-white text-center">
        <p className="text-gray-600 mb-2">No charts yet</p>
        <p className="text-sm text-gray-500">Create a chart from one of your datasets!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Charts</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {charts.map((chart) => (
          <div
            key={chart.id}
            className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow"
          >
            {/* Chart Preview */}
            <div className="mb-3 h-48 bg-gray-50 rounded border overflow-hidden">
              <ChartRenderer chartId={chart.id} height={192} showTitle={false} />
            </div>

            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {chart.metadata.title || 'Untitled Chart'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">From: {chart.dataset.name}</p>
              </div>

              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded capitalize">
                {chart.type}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-3">
              <p>
                <span className="font-medium">Views:</span> {chart.viewCount}
              </p>
              <p>
                <span className="font-medium">Created:</span>{' '}
                {new Date(chart.createdAt).toLocaleDateString()}
              </p>
              {chart.isPublic && (
                <p>
                  <span className="inline-flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-label="Public chart"
                    >
                      <title>Public chart</title>
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Public
                  </span>
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                onClick={() => {
                  router.push(`/charts/${chart.id}/edit`);
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="flex-1 px-3 py-1.5 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                onClick={() => {
                  router.push(`/e/${chart.publicKey}`);
                }}
              >
                View
              </button>
              <button
                type="button"
                className="flex-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/e/${chart.publicKey}`);
                  alert('Chart URL copied to clipboard!');
                }}
              >
                Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
