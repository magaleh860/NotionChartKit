'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full text-center">
        <h1 className="text-6xl font-bold mb-6">NotionChartKit</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Create and embed beautiful charts from your Notion databases
        </p>

        <div className="flex gap-4 justify-center mb-12">
          <Link
            href={session ? '/dashboard' : '/login'}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
          >
            {session ? 'Go to Dashboard' : 'Get Started'}
          </Link>
          <Link
            href="/docs"
            className="px-6 py-3 border border-border rounded-lg hover:bg-secondary transition"
          >
            Documentation
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 border border-border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">🔗 Notion Integration</h3>
            <p className="text-sm text-muted-foreground">
              Connect seamlessly with Notion OAuth 2.0
            </p>
          </div>
          <div className="p-6 border border-border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">📊 Multiple Chart Types</h3>
            <p className="text-sm text-muted-foreground">
              Bar, line, pie, and area charts ready to embed
            </p>
          </div>
          <div className="p-6 border border-border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">⚡ Auto-Refresh</h3>
            <p className="text-sm text-muted-foreground">
              Background workers keep your data up to date
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
