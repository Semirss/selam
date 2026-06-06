"use client";

import { useLocale } from 'next-intl';
import { Sidebar } from '@/components/layout/Sidebar';
import { ToastProvider } from '@/components/ui/Toast';
import { ChatInterface } from '@/components/features/ChatInterface';
import { MoodLogger } from '@/components/features/MoodLogger';
import { MoodChart } from '@/components/features/MoodChart';
import { Tabs } from '@/components/ui/Tabs';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { MoodLog } from '@/types';
import { Skeleton } from '@/components/ui/Skeleton';

export default function WellnessPage() {
  const locale = useLocale();
  const [moods, setMoods] = useState<MoodLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayLogged, setTodayLogged] = useState(false);

  const fetchMoods = () => {
    fetch('/api/mood').then(r => r.json()).then(data => {
      const list: MoodLog[] = data.moods || [];
      setMoods(list);
      const today = new Date().toDateString();
      setTodayLogged(list.some(m => new Date(m.created_at).toDateString() === today));
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchMoods(); }, []);

  const avgMood = moods.length ? (moods.reduce((a, m) => a + m.score, 0) / moods.length).toFixed(1) : '—';
  const streak = moods.length;

  return (
    <ToastProvider>
      <div className="flex h-screen bg-off-white overflow-hidden">
        <Sidebar role="client" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display text-2xl font-bold text-navy mb-6">Wellness Center</h1>

            <Tabs tabs={[
              {
                id: 'chat',
                label: 'AI Chat',
                content: (
                  <Card className="p-5 h-[580px] flex flex-col">
                    <ChatInterface locale={locale} />
                    <div className="mt-4 pt-4 border-t border-gray-light flex justify-center">
                      <Button variant="secondary" size="sm">Talk to a Professional</Button>
                    </div>
                  </Card>
                ),
              },
              {
                id: 'mood',
                label: 'Mood Log',
                content: (
                  <div className="space-y-6">
                    <Card className="p-6">
                      <h2 className="font-semibold text-navy mb-5">
                        {todayLogged ? "Today's Mood — Logged ✓" : "Log Today's Mood"}
                      </h2>
                      {todayLogged ? (
                        <p className="text-sm text-teal text-center py-6">
                          Great job tracking your wellness! Come back tomorrow.
                        </p>
                      ) : loading ? (
                        <Skeleton className="h-40 w-full" />
                      ) : (
                        <MoodLogger onLogged={() => { setTodayLogged(true); fetchMoods(); }} />
                      )}
                    </Card>

                    {/* Calendar heatmap (simplified) */}
                    <Card className="p-6">
                      <h2 className="font-semibold text-navy mb-4">30-Day Overview</h2>
                      <div className="grid grid-cols-7 gap-1.5">
                        {Array.from({ length: 30 }, (_, i) => {
                          const d = new Date();
                          d.setDate(d.getDate() - (29 - i));
                          const dateStr = d.toDateString();
                          const mood = moods.find(m => new Date(m.created_at).toDateString() === dateStr);
                          const intensity = mood ? mood.score / 10 : 0;
                          const bg = mood ? `rgba(26, 158, 122, ${0.2 + intensity * 0.8})` : '#F3F4F6';
                          return (
                            <div
                              key={i}
                              title={mood ? `Score: ${mood.score}` : 'No entry'}
                              className="h-7 rounded-sm cursor-pointer"
                              style={{ backgroundColor: bg }}
                            />
                          );
                        })}
                      </div>
                      <p className="text-xs text-gray mt-2">Each cell = one day (greener = higher mood)</p>
                    </Card>
                  </div>
                ),
              },
              {
                id: 'progress',
                label: 'Progress',
                content: (
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: 'Avg Mood', value: avgMood },
                        { label: 'Sessions Logged', value: streak },
                        { label: 'Days Active', value: moods.length },
                      ].map(stat => (
                        <Card key={stat.label} className="p-4 text-center">
                          <p className="text-3xl font-bold text-teal font-display">{stat.value}</p>
                          <p className="text-xs text-gray mt-1">{stat.label}</p>
                        </Card>
                      ))}
                    </div>
                    <Card className="p-6">
                      <h2 className="font-semibold text-navy mb-4">Mood Trend</h2>
                      {loading ? <Skeleton className="h-48 w-full" /> : <MoodChart moods={moods} />}
                    </Card>
                  </div>
                ),
              },
            ]} />
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
