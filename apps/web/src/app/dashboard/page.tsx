'use client';

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border border-border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Datasets</h2>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground mt-2">Connected datasets</p>
          </div>
          <div className="p-6 border border-border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Charts</h2>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground mt-2">Active charts</p>
          </div>
          <div className="p-6 border border-border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Embeds</h2>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground mt-2">Total embeds</p>
          </div>
        </div>
      </div>
    </div>
  );
}
