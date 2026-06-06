"use client";

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ToastProvider } from '@/components/ui/Toast';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Activity } from 'lucide-react';

export default function AgentAnalyticsPage() {
  const [moodData, setMoodData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Build last 8 weeks of mock aggregated data (in prod this would be an API)
    const weeks = Array.from({ length: 8 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (7 - i) * 7);
      return {
        week: `W${i + 1}`,
        avgMood: +(4.5 + Math.random() * 3).toFixed(1),
        sessions: Math.floor(20 + Math.random() * 60),
      };
    });
    setMoodData(weeks);
    setLoading(false);
  }, []);

  const totalSessions = moodData.reduce((a, d) => a + d.sessions, 0);
  const avgMood = moodData.length
    ? (moodData.reduce((a, d) => a + d.avgMood, 0) / moodData.length).toFixed(1)
    : '—';

  return (
    <ToastProvider>
      <div className="flex h-screen bg-off-white overflow-hidden">
        <Sidebar role="agent" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="font-display text-2xl font-bold text-navy">Population Wellness Analytics</h1>
            <p className="text-sm text-gray">Aggregated and anonymised data across all Selam users.</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Users, label: 'Total Sessions (8w)', value: totalSessions },
                { icon: Activity, label: 'Avg Mood Score', value: `${avgMood}/10` },
                { icon: TrendingUp, label: 'Trend', value: '↑ Improving' },
              ].map(s => (
                <Card key={s.label} className="p-4 text-center">
                  <s.icon className="h-6 w-6 text-teal mx-auto mb-2" />
                  <p className="text-2xl font-bold text-navy font-display">{s.value}</p>
                  <p className="text-xs text-gray">{s.label}</p>
                </Card>
              ))}
            </div>

            {/* Mood Chart */}
            <Card className="p-6">
              <h2 className="font-semibold text-navy mb-5">Average Weekly Mood Score</h2>
              {loading ? <Skeleton className="h-64 w-full" /> : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={moodData} margin={{ top: 5, right: 16, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: '1px solid #F3F4F6' }}
                    />
                    <Bar dataKey="avgMood" fill="#1A9E7A" radius={[6, 6, 0, 0]} name="Avg Mood" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>

            {/* Sessions Chart */}
            <Card className="p-6">
              <h2 className="font-semibold text-navy mb-5">Weekly Wellness Sessions</h2>
              {loading ? <Skeleton className="h-64 w-full" /> : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={moodData} margin={{ top: 5, right: 16, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #F3F4F6' }} />
                    <Bar dataKey="sessions" fill="#2C4A6E" radius={[6, 6, 0, 0]} name="Sessions" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
