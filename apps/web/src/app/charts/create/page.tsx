'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Dataset {
  id: string;
  name: string;
  databaseId: string;
}

type ChartType = 'bar' | 'line' | 'pie' | 'area';

export default function CreateChartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const datasetId = searchParams.get('datasetId');
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [title, setTitle] = useState('');
  const [xAxisLabel, setXAxisLabel] = useState('');
  const [yAxisLabel, setYAxisLabel] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  // Fetch dataset info
  useEffect(() => {
    async function fetchDataset() {
      if (!datasetId) {
        setError('No dataset ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/datasets');
        if (!response.ok) throw new Error('Failed to fetch datasets');

        const data = await response.json();
        const found = data.datasets.find((d: Dataset) => d.id === datasetId);

        if (!found) {
          setError('Dataset not found');
        } else {
          setDataset(found);
          setTitle(`${found.name} Chart`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dataset');
      } finally {
        setLoading(false);
      }
    }

    fetchDataset();
  }, [datasetId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!datasetId) {
      setError('No dataset selected');
      return;
    }

    try {
      setCreating(true);
      setError(null);

      const response = await fetch('/api/charts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          datasetId,
          type: chartType,
          metadata: {
            title: title || undefined,
            xAxisLabel: xAxisLabel || undefined,
            yAxisLabel: yAxisLabel || undefined,
          },
          isPublic,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create chart');
      }

      await response.json();
      alert('Chart created successfully!');

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create chart');
      console.error('Error creating chart:', err);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error && !dataset) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="text-blue-600 hover:underline mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold">Create Chart</h1>
          {dataset && (
            <p className="text-gray-600 mt-2">
              From dataset: <span className="font-semibold">{dataset.name}</span>
            </p>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 border rounded-lg space-y-6">
          {/* Chart Type */}
          <div>
            <label htmlFor="chartType" className="block text-sm font-medium text-gray-700 mb-2">
              Chart Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['bar', 'line', 'pie', 'area'] as ChartType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setChartType(type)}
                  className={`p-4 border-2 rounded-lg capitalize transition-all ${
                    chartType === type
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Chart Title (Optional)
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Sales Overview"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={creating}
            />
          </div>

          {/* X-Axis Label */}
          <div>
            <label htmlFor="xAxisLabel" className="block text-sm font-medium text-gray-700 mb-1">
              X-Axis Label (Optional)
            </label>
            <input
              type="text"
              id="xAxisLabel"
              value={xAxisLabel}
              onChange={(e) => setXAxisLabel(e.target.value)}
              placeholder="e.g., Month"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={creating}
            />
          </div>

          {/* Y-Axis Label */}
          <div>
            <label htmlFor="yAxisLabel" className="block text-sm font-medium text-gray-700 mb-1">
              Y-Axis Label (Optional)
            </label>
            <input
              type="text"
              id="yAxisLabel"
              value={yAxisLabel}
              onChange={(e) => setYAxisLabel(e.target.value)}
              placeholder="e.g., Revenue ($)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={creating}
            />
          </div>

          {/* Public Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={creating}
            />
            <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
              Make this chart public (can be embedded)
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={creating}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating || !datasetId}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {creating ? 'Creating...' : 'Create Chart'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
