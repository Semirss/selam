"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { ToastProvider } from '@/components/ui/Toast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { QRScanner } from '@/components/features/QRScanner';
import { ScanLine, Users, ClipboardList, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useEffect } from 'react';

const HISTORY_KEY = 'selam_scan_history';

interface ScanEntry {
  qrUid: string;
  name: string;
  scannedAt: string;
}

export default function DoctorDashboardPage() {
  const locale = useLocale();
  const router = useRouter();
  const [scanOpen, setScanOpen] = useState(false);
  const [history, setHistory] = useState<ScanEntry[]>([]);
  const [stats, setStats] = useState({ today: 0, week: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') as ScanEntry[];
    setHistory(stored.slice(0, 10));
    const today = new Date().toDateString();
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    setStats({
      today: stored.filter(s => new Date(s.scannedAt).toDateString() === today).length,
      week: stored.filter(s => new Date(s.scannedAt).getTime() > weekAgo).length,
    });
    setLoading(false);
  }, []);

  const handleScan = (qrUid: string) => {
    setScanOpen(false);
    const entry: ScanEntry = { qrUid, name: 'Patient', scannedAt: new Date().toISOString() };
    const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') as ScanEntry[];
    localStorage.setItem(HISTORY_KEY, JSON.stringify([entry, ...stored].slice(0, 50)));
    router.push(`/${locale}/doctor/patient/${qrUid}`);
  };

  return (
    <ToastProvider>
      <div className="flex h-screen bg-off-white overflow-hidden">
        <Sidebar role="doctor" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="font-display text-2xl font-bold text-navy">Doctor Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Users, label: 'Patients Today', value: stats.today },
                { icon: ClipboardList, label: 'This Week', value: stats.week },
                { icon: Clock, label: 'Total Scans', value: history.length },
                { icon: ScanLine, label: 'Scanner', value: 'Ready' },
              ].map(s => (
                <Card key={s.label} className="p-4 text-center">
                  <s.icon className="h-6 w-6 text-teal mx-auto mb-2" />
                  <p className="text-2xl font-bold text-navy font-display">{s.value}</p>
                  <p className="text-xs text-gray">{s.label}</p>
                </Card>
              ))}
            </div>

            {/* Scan button */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="cursor-pointer"
              onClick={() => setScanOpen(true)}
            >
              <Card className="p-10 flex flex-col items-center gap-4 border-2 border-dashed border-teal bg-teal-light hover:shadow-md transition-shadow">
                <div className="h-20 w-20 rounded-full bg-teal flex items-center justify-center teal-glow">
                  <ScanLine className="h-10 w-10 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-display text-2xl font-bold text-navy">Scan Patient ID</p>
                  <p className="text-gray mt-1">Tap to open camera scanner</p>
                </div>
                <Button className="teal-glow mt-2" onClick={(e) => { e.stopPropagation(); setScanOpen(true); }}>
                  Open Scanner
                </Button>
              </Card>
            </motion.div>

            {/* Recent scans */}
            <Card className="p-6">
              <h2 className="font-semibold text-navy mb-4">Recent Scans</h2>
              {loading ? (
                <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full" />)}</div>
              ) : history.length === 0 ? (
                <p className="text-sm text-gray text-center py-6">No scans yet. Start by scanning a patient QR code.</p>
              ) : (
                <div className="space-y-2">
                  {history.map((entry, i) => (
                    <button
                      key={i}
                      onClick={() => router.push(`/${locale}/doctor/patient/${entry.qrUid}`)}
                      className="w-full flex items-center justify-between p-3 rounded-radius-md bg-gray-light hover:bg-teal-light transition-colors text-left"
                    >
                      <div>
                        <p className="font-medium text-navy text-sm font-mono">{entry.qrUid}</p>
                        <p className="text-xs text-gray">{formatDate(entry.scannedAt)}</p>
                      </div>
                      <ScanLine className="h-4 w-4 text-teal" />
                    </button>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>

      <Modal isOpen={scanOpen} onClose={() => setScanOpen(false)} title="Scan Patient QR Code">
        <QRScanner onScan={handleScan} onClose={() => setScanOpen(false)} />
      </Modal>
    </ToastProvider>
  );
}
