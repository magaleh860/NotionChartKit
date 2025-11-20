'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Chart {
  id: string;
  type: string;
  metadata: {
    title?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
    groupByProperty?: string;
    aggregationType?: 'count' | 'sum' | 'avg';
    valueProperty?: string;
    timeWindow?: {
      type: 'last_7_days' | 'last_30_days' | 'last_90_days' | 'last_year' | 'custom';
      dateProperty?: string;
      customStartDate?: string;
      customEndDate?: string;
    };
  };
  isPublic: boolean;
  dataset: {
    id: string;
    name: string;
  };
}

type ChartType = 'bar' | 'line' | 'pie' | 'area';

export default function EditChartPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [chart, setChart] = useState<Chart | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [title, setTitle] = useState('');
  const [xAxisLabel, setXAxisLabel] = useState('');
  const [yAxisLabel, setYAxisLabel] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  // Aggregation configuration
  const [groupByProperty, setGroupByProperty] = useState('');
  const [aggregationType, setAggregationType] = useState<'count' | 'sum' | 'avg'>('count');
  const [valueProperty, setValueProperty] = useState('');

  // Time window state
  const [enableTimeWindow, setEnableTimeWindow] = useState(false);
  const [timeWindowType, setTimeWindowType] = useState<
    'last_7_days' | 'last_30_days' | 'last_90_days' | 'last_year' | 'custom'
  >('last_30_days');
  const [dateProperty, setDateProperty] = useState('createdTime');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Available properties from Notion
  const [availableProperties, setAvailableProperties] = useState<
    Array<{ name: string; type: string }>
  >([]);
  const [loadingProperties, setLoadingProperties] = useState(false);

  // Fetch chart data
  useEffect(() => {
    async function fetchChart() {
      try {
        setLoading(true);
        const response = await fetch(`/api/charts/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch chart');
        }

        const data = await response.json();
        setChart(data);

        // Populate form with existing values
        setChartType(data.type as ChartType);
        setTitle(data.metadata?.title || '');
        setXAxisLabel(data.metadata?.xAxisLabel || '');
        setYAxisLabel(data.metadata?.yAxisLabel || '');
        setIsPublic(data.isPublic);
        setGroupByProperty(data.metadata?.groupByProperty || '');
        setAggregationType(data.metadata?.aggregationType || 'count');
        setValueProperty(data.metadata?.valueProperty || '');

        // Populate time window values if they exist
        if (data.metadata?.timeWindow) {
          setEnableTimeWindow(true);
          setTimeWindowType(data.metadata.timeWindow.type);
          setDateProperty(data.metadata.timeWindow.dateProperty || 'createdTime');
          setCustomStartDate(data.metadata.timeWindow.customStartDate || '');
          setCustomEndDate(data.metadata.timeWindow.customEndDate || '');
        }

        // Fetch available properties from the dataset
        if (data.dataset?.id) {
          fetchProperties(data.dataset.id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load chart');
      } finally {
        setLoading(false);
      }
    }

    fetchChart();
  }, [id]);

  // Fetch available properties from Notion database
  async function fetchProperties(datasetId: string) {
    try {
      setLoadingProperties(true);
      const response = await fetch(`/api/datasets/${datasetId}/properties`);

      if (response.ok) {
        const data = await response.json();
        setAvailableProperties(data.properties || []);
      }
    } catch (err) {
      console.error('Failed to fetch properties:', err);
    } finally {
      setLoadingProperties(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`/api/charts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: chartType,
          metadata: {
            title: title || undefined,
            xAxisLabel: xAxisLabel || undefined,
            yAxisLabel: yAxisLabel || undefined,
            groupByProperty: groupByProperty || undefined,
            aggregationType,
            valueProperty: valueProperty || undefined,
            timeWindow: enableTimeWindow
              ? {
                  type: timeWindowType,
                  dateProperty: dateProperty || 'createdTime',
                  ...(timeWindowType === 'custom'
                    ? {
                        customStartDate: customStartDate || undefined,
                        customEndDate: customEndDate || undefined,
                      }
                    : {}),
                }
              : undefined,
          },
          isPublic,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update chart');
      }

      alert('Chart updated successfully!');

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update chart');
      console.error('Error updating chart:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading chart...</p>
      </div>
    );
  }

  if (error && !chart) {
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
          <h1 className="text-4xl font-bold">Edit Chart</h1>
          {chart && (
            <p className="text-gray-600 mt-2">
              From dataset: <span className="font-semibold">{chart.dataset.name}</span>
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
              disabled={saving}
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
              disabled={saving}
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
              disabled={saving}
            />
          </div>

          {/* Data Configuration */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Data Configuration</h3>

            {/* Group By Property */}
            <div className="mb-4">
              <label
                htmlFor="groupByProperty"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Group By Property{' '}
                {loadingProperties && <span className="text-xs text-gray-400">(Loading...)</span>}
              </label>
              {availableProperties.length > 0 ? (
                <select
                  id="groupByProperty"
                  value={groupByProperty}
                  onChange={(e) => setGroupByProperty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={saving}
                >
                  <option value="">Select a property...</option>
                  {availableProperties.map((prop) => (
                    <option key={prop.name} value={prop.name}>
                      {prop.name} ({prop.type})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  id="groupByProperty"
                  value={groupByProperty}
                  onChange={(e) => setGroupByProperty(e.target.value)}
                  placeholder="e.g., Status, Category, Date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={saving}
                />
              )}
              <p className="text-xs text-gray-500 mt-1">
                Select the Notion property to group your data by
              </p>
            </div>

            {/* Aggregation Type */}
            <div className="mb-4">
              <label
                htmlFor="aggregationType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Aggregation Type
              </label>
              <select
                id="aggregationType"
                value={aggregationType}
                onChange={(e) => setAggregationType(e.target.value as 'count' | 'sum' | 'avg')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              >
                <option value="count">Count - Count number of records</option>
                <option value="sum">Sum - Add up numeric values</option>
                <option value="avg">Average - Calculate average of numeric values</option>
              </select>
            </div>

            {/* Value Property (for sum/avg) */}
            {(aggregationType === 'sum' || aggregationType === 'avg') && (
              <div>
                <label
                  htmlFor="valueProperty"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Value Property
                </label>
                {availableProperties.length > 0 ? (
                  <select
                    id="valueProperty"
                    value={valueProperty}
                    onChange={(e) => setValueProperty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={saving}
                  >
                    <option value="">Select a numeric property...</option>
                    {availableProperties
                      .filter((prop) => prop.type === 'number' || prop.type === 'relation')
                      .map((prop) => (
                        <option key={prop.name} value={prop.name}>
                          {prop.name} ({prop.type === 'relation' ? 'relation count' : prop.type})
                        </option>
                      ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    id="valueProperty"
                    value={valueProperty}
                    onChange={(e) => setValueProperty(e.target.value)}
                    placeholder="e.g., Amount, Price, Revenue"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={saving}
                  />
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Select the numeric or relation property to{' '}
                  {aggregationType === 'sum' ? 'sum' : 'average'}
                </p>
              </div>
            )}
          </div>

          {/* Time Window Filter */}
          <div className="border-t pt-6">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                id="enableTimeWindow"
                checked={enableTimeWindow}
                onChange={(e) => setEnableTimeWindow(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={saving}
              />
              <label htmlFor="enableTimeWindow" className="text-sm font-medium text-gray-700">
                Filter data by time window
              </label>
            </div>

            {enableTimeWindow && (
              <div className="ml-7 space-y-4 p-4 bg-gray-50 rounded-lg">
                {/* Time Window Type */}
                <div>
                  <label
                    htmlFor="timeWindowType"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Time Range
                  </label>
                  <select
                    id="timeWindowType"
                    value={timeWindowType}
                    onChange={(e) => setTimeWindowType(e.target.value as typeof timeWindowType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={saving}
                  >
                    <option value="last_7_days">Last 7 days</option>
                    <option value="last_30_days">Last 30 days</option>
                    <option value="last_90_days">Last 90 days</option>
                    <option value="last_year">Last year</option>
                    <option value="custom">Custom range</option>
                  </select>
                </div>

                {/* Date Property */}
                <div>
                  <label
                    htmlFor="dateProperty"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Date Property
                  </label>
                  <select
                    id="dateProperty"
                    value={dateProperty}
                    onChange={(e) => setDateProperty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={saving}
                  >
                    <option value="createdTime">Created Time</option>
                    <option value="lastEditedTime">Last Edited Time</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">Which date field to filter on</p>
                </div>

                {/* Custom Date Range */}
                {timeWindowType === 'custom' && (
                  <div className="space-y-3">
                    <div>
                      <label
                        htmlFor="customStartDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Start Date
                      </label>
                      <input
                        type="date"
                        id="customStartDate"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={saving}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="customEndDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        End Date (Optional)
                      </label>
                      <input
                        type="date"
                        id="customEndDate"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={saving}
                      />
                      <p className="mt-1 text-xs text-gray-500">Leave empty to use current date</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Public Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={saving}
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
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
