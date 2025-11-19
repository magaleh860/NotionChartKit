'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface NotionDatabase {
  id: string;
  title: string;
  icon?: {
    type: string;
    emoji?: string;
  };
  lastEditedTime: string;
  url: string;
}

export function DatasetCreationForm() {
  const { data: session } = useSession();
  const [databases, setDatabases] = useState<NotionDatabase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Form state
  const [selectedDatabaseId, setSelectedDatabaseId] = useState('');
  const [datasetName, setDatasetName] = useState('');

  // Fetch user's Notion databases
  useEffect(() => {
    async function fetchDatabases() {
      try {
        setLoading(true);
        const response = await fetch('/api/notion/databases');

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch databases');
        }

        const data = await response.json();
        setDatabases(data.databases);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load databases');
        console.error('Error fetching databases:', err);
      } finally {
        setLoading(false);
      }
    }

    if (session?.user) {
      fetchDatabases();
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDatabaseId || !datasetName) {
      setError('Please select a database and enter a name');
      return;
    }

    try {
      setCreating(true);
      setError(null);

      const response = await fetch('/api/datasets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: datasetName,
          databaseId: selectedDatabaseId,
          connectionId: session?.user?.connectionId,
          userId: session?.user?.dbUserId,
          config: {
            databaseId: selectedDatabaseId,
          },
          refreshIntervalMinutes: 60,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create dataset');
      }

      // Success - reset form
      setDatasetName('');
      setSelectedDatabaseId('');
      alert('Dataset created successfully!');

      // Optionally reload the page to show the new dataset
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create dataset');
      console.error('Error creating dataset:', err);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 border rounded-lg bg-white">
        <p className="text-gray-600">Loading your Notion databases...</p>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-lg bg-white">
      <h2 className="text-2xl font-bold mb-4">Create New Dataset</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Database Selector */}
        <div>
          <label htmlFor="database" className="block text-sm font-medium text-gray-700 mb-1">
            Select Notion Database
          </label>
          <select
            id="database"
            value={selectedDatabaseId}
            onChange={(e) => setSelectedDatabaseId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={creating}
          >
            <option value="">Choose a database...</option>
            {databases.map((db) => (
              <option key={db.id} value={db.id}>
                {db.icon?.emoji && `${db.icon.emoji} `}
                {db.title}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-500">
            {databases.length} database{databases.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Dataset Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Dataset Name
          </label>
          <input
            type="text"
            id="name"
            value={datasetName}
            onChange={(e) => setDatasetName(e.target.value)}
            placeholder="e.g., Sales Pipeline Q4 2024"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={creating}
          />
          <p className="mt-1 text-sm text-gray-500">Give your dataset a descriptive name</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={creating || !selectedDatabaseId || !datasetName}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {creating ? 'Creating...' : 'Create Dataset'}
        </button>
      </form>
    </div>
  );
}
