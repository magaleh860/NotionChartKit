'use client';

import { useEffect, useState } from 'react';

interface Dataset {
  id: string;
  name: string;
  databaseId: string;
  createdAt: string;
  lastRefreshedAt: string | null;
  isActive: boolean;
  connection: {
    workspaceName: string;
    workspaceIcon: string | null;
  };
  _count?: {
    charts: number;
  };
}

export function DatasetList() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDatasets() {
      try {
        setLoading(true);
        const response = await fetch('/api/datasets');

        if (!response.ok) {
          throw new Error('Failed to fetch datasets');
        }

        const data = await response.json();
        setDatasets(data.datasets);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load datasets');
        console.error('Error fetching datasets:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDatasets();
  }, []);

  if (loading) {
    return (
      <div className="p-6 border rounded-lg bg-white">
        <p className="text-gray-600">Loading datasets...</p>
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

  if (datasets.length === 0) {
    return (
      <div className="p-6 border rounded-lg bg-white text-center">
        <p className="text-gray-600 mb-2">No datasets yet</p>
        <p className="text-sm text-gray-500">Create your first dataset to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Datasets</h2>

      <div className="grid gap-4">
        {datasets.map((dataset) => (
          <div
            key={dataset.id}
            className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{dataset.name}</h3>

                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Workspace:</span>{' '}
                    {dataset.connection.workspaceIcon && `${dataset.connection.workspaceIcon} `}
                    {dataset.connection.workspaceName}
                  </p>

                  <p>
                    <span className="font-medium">Created:</span>{' '}
                    {new Date(dataset.createdAt).toLocaleDateString()}
                  </p>

                  {dataset.lastRefreshedAt && (
                    <p>
                      <span className="font-medium">Last refreshed:</span>{' '}
                      {new Date(dataset.lastRefreshedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="ml-4 flex flex-col items-end gap-2">
                {dataset.isActive ? (
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                    Active
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                    Inactive
                  </span>
                )}

                {dataset._count && (
                  <span className="text-sm text-gray-500">
                    {dataset._count.charts} chart{dataset._count.charts !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                onClick={() => {
                  // TODO: Navigate to dataset details
                  alert(`View dataset: ${dataset.name}`);
                }}
              >
                View Details
              </button>
              <button
                type="button"
                className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                onClick={() => {
                  // TODO: Navigate to create chart from this dataset
                  alert(`Create chart from: ${dataset.name}`);
                }}
              >
                Create Chart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
