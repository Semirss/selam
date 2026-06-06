"use client";

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { ToastProvider } from '@/components/ui/Toast';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { ScanLine, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const HISTORY_KEY = 'selam_scan_history';

interface ScanEntry {
  qrUid: string;
  name: string;
  scannedAt: string;
}

export default function DoctorHistoryPage() {
  const locale = useLocale();
  const router = useRouter();
  const [history, setHistory] = useState<ScanEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') as ScanEntry[];
    setHistory(stored);
    setLoading(false);
  }, []);

  return (
    <ToastProvider>
      <div className="flex h-screen bg-off-white overflow-hidden">
        <Sidebar role="doctor" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display text-2xl font-bold text-navy mb-6">Scan History</h1>

            <Card className="overflow-hidden">
              {loading ? (
                <div className="p-4 space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
              ) : history.length === 0 ? (
                <div className="p-12 text-center">
                  <ScanLine className="h-12 w-12 text-gray-light mx-auto mb-3" />
                  <p className="text-gray">No scan history yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--gray-light)]">
                  {history.map((entry, i) => (
                    <button
                      key={i}
                      onClick={() => router.push(`/${locale}/doctor/patient/${entry.qrUid}`)}
                      className="w-full flex items-center gap-4 p-4 hover:bg-teal-light transition-colors text-left"
                    >
                      <div className="h-10 w-10 rounded-full bg-teal-light flex items-center justify-center shrink-0">
                        <ScanLine className="h-5 w-5 text-teal" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-navy text-sm font-mono">{entry.qrUid}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3 text-gray" />
                          <p className="text-xs text-gray">{formatDate(entry.scannedAt)}</p>
                        </div>
                      </div>
                      <span className="text-xs text-teal">View →</span>
                    </button>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
