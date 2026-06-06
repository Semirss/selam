"use client";

import { Button } from '@/components/ui/Button';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA] gap-6 text-center px-4">
        <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mb-2">
          <span className="text-4xl">⚠️</span>
        </div>
        <h1 className="text-4xl font-bold text-[#2C4A6E]">Something went wrong</h1>
        <p className="text-[#6B7280] max-w-sm">{error.message || 'An unexpected error occurred.'}</p>
        <Button onClick={reset}>Try Again</Button>
      </body>
    </html>
  );
}
