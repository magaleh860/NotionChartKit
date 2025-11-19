'use client';

import { DatasetCreationForm } from '@/components/dataset-creation-form';
import { DatasetList } from '@/components/dataset-list';
import { signOut, useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    window.location.href = '/login';
    return null;
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{session.user.name}</p>
              <p className="text-xs text-muted-foreground">{session.user.email}</p>
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-secondary transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Dataset Creation Form */}
          <DatasetCreationForm />

          {/* Quick Stats */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-border rounded-lg bg-white">
                <h3 className="text-sm font-semibold mb-1">Charts</h3>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div className="p-4 border border-border rounded-lg bg-white">
                <h3 className="text-sm font-semibold mb-1">Embeds</h3>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dataset List */}
        <DatasetList />
      </div>
    </div>
  );
}
