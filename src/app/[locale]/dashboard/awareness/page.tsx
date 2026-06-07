"use client";

import { useLocale } from 'next-intl';
import { Sidebar } from '@/components/layout/Sidebar';
import { ToastProvider } from '@/components/ui/Toast';
import { AwarenessFeed } from '@/components/features/AwarenessFeed';

export default function AwarenessPage() {
  const locale = useLocale();

  return (
    <ToastProvider>
      <div className="flex h-screen bg-off-white overflow-hidden">
        <Sidebar role="client" />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-8">
            <h1 className="font-display text-2xl font-bold text-navy mb-6">Health Awareness</h1>
            <AwarenessFeed locale={locale} />
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
