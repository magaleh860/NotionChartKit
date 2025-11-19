'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Welcome to NotionChartKit</h1>
          <p className="text-muted-foreground">
            Connect your Notion workspace to start creating charts
          </p>
        </div>

        <div className="p-8 border border-border rounded-lg bg-card">
          <button
            type="button"
            onClick={() => signIn('notion', { callbackUrl: '/dashboard' })}
            className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Notion Logo</title>
              <path
                d="M6.017 4.313l55.333 -4.087c6.797 -0.583 8.543 -0.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277 -1.553 6.807 -6.99 7.193L24.467 99.967c-4.08 0.193 -6.023 -0.39 -8.16 -3.113L3.3 79.94c-2.333 -3.113 -3.3 -5.443 -3.3 -8.167V11.113c0 -3.497 1.553 -6.413 6.017 -6.8z"
                fill="currentColor"
              />
            </svg>
            Connect with Notion
          </button>

          <p className="mt-4 text-sm text-center text-muted-foreground">
            By continuing, you agree to grant access to your Notion databases
          </p>
        </div>

        <div className="text-center">
          <Link href="/" className="text-sm text-primary hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
