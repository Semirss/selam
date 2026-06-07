"use client";

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { MoodLogger } from '@/components/features/MoodLogger';
import { MoodChart } from '@/components/features/MoodChart';
import { Button } from '@/components/ui/Button';
import { ToastProvider } from '@/components/ui/Toast';
import { Heart, CreditCard, MapPin, Newspaper, Users, MessageCircle, Menu, X, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import type { MoodLog, AwarenessPost } from '@/types';

export default function DashboardPage() {
  const locale = useLocale();
  const [user, setUser] = useState<any>(null);
  const [moods, setMoods] = useState<MoodLog[]>([]);
  const [posts, setPosts] = useState<AwarenessPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayLogged, setTodayLogged] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then(r => r.json()),
      fetch('/api/mood').then(r => r.json()),
      fetch(`/api/awareness?page=1&lang=${locale}`).then(r => r.json()),
    ]).then(([userData, moodData, postData]) => {
      setUser(userData.user);
      const fetchedMoods: MoodLog[] = moodData.moods || [];
      setMoods(fetchedMoods);
      const today = new Date().toDateString();
      setTodayLogged(fetchedMoods.some(m => new Date(m.created_at).toDateString() === today));
      setPosts((postData.posts || []).slice(0, 3));
    }).finally(() => setLoading(false));
  }, [locale]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push(`/${locale}/auth/login`);
  };

  const quickActions = [
    { href: `/${locale}/dashboard/wellness`, icon: MessageCircle, label: 'AI Wellness Chat', color: 'bg-teal' },
    { href: `/${locale}/dashboard/health-id`, icon: CreditCard, label: 'My Health ID', color: 'bg-navy' },
    { href: `/${locale}/dashboard/awareness`, icon: Newspaper, label: 'Awareness Feed', color: 'bg-purple-600' },
    { href: `/${locale}/dashboard/hospitals`, icon: MapPin, label: 'Find Hospitals', color: 'bg-orange-500' },
  ];

  const navLinks = [
    { href: `/${locale}/dashboard`, icon: Home, label: 'Home' },
    { href: `/${locale}/dashboard/wellness`, icon: Heart, label: 'Wellness' },
    { href: `/${locale}/dashboard/health-id`, icon: CreditCard, label: 'Health ID' },
    { href: `/${locale}/dashboard/awareness`, icon: Newspaper, label: 'Awareness' },
    { href: `/${locale}/dashboard/hospitals`, icon: MapPin, label: 'Hospitals' },
  ];

  return (
    <ToastProvider>
      <div className="flex h-screen bg-off-white overflow-hidden">
        <Sidebar role="client" />

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-light px-4 h-14 flex items-center justify-between shadow-sm">
          <span className="font-display font-bold text-navy text-lg">Selam</span>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-light transition-colors"
          >
            <Menu className="h-5 w-5 text-navy" />
          </button>
        </div>

        {/* Mobile Drawer Overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="md:hidden fixed inset-0 bg-black/50 z-40"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                className="md:hidden fixed top-0 left-0 bottom-0 w-72 bg-white z-50 flex flex-col shadow-2xl"
              >
                <div className="flex items-center justify-between px-4 h-14 border-b border-gray-light">
                  <span className="font-display font-bold text-navy text-lg">Selam</span>
                  <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-gray-light">
                    <X className="h-5 w-5 text-gray" />
                  </button>
                </div>
                <nav className="flex flex-col gap-1 p-3 flex-1">
                  {navLinks.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors font-medium text-sm',
                        pathname === link.href
                          ? 'bg-teal-light text-teal'
                          : 'text-gray hover:bg-gray-light hover:text-navy'
                      )}
                    >
                      <link.icon className="h-5 w-5 shrink-0" />
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </nav>
                <div className="p-3 border-t border-gray-light">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium text-gray hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 overflow-y-auto p-6 pt-20 md:pt-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Greeting */}
            <div>
              {loading ? (
                <Skeleton className="h-9 w-64" />
              ) : (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                  <h1 className="font-display text-3xl font-bold text-navy">
                    {greeting}, {user?.full_name?.split(' ')[0]} 👋
                  </h1>
                  <p className="text-gray mt-1">
                    {new Date().toLocaleDateString(locale === 'am' ? 'am-ET' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((a, i) => (
                <Link key={a.href} href={a.href}>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Card hoverLift className="p-4 flex flex-col items-center gap-3 text-center cursor-pointer">
                      <div className={`h-12 w-12 rounded-2xl ${a.color} flex items-center justify-center`}>
                        <a.icon className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-sm font-medium text-navy">{a.label}</p>
                    </Card>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Mood Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="font-semibold text-navy mb-4 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-teal" />
                  {todayLogged ? "Today's Mood" : "How are you feeling?"}
                </h2>
                {todayLogged ? (
                  <div className="text-center py-4">
                    <p className="text-teal font-medium">Mood logged for today ✓</p>
                    <p className="text-sm text-gray mt-1">Come back tomorrow.</p>
                  </div>
                ) : (
                  <MoodLogger onLogged={() => setTodayLogged(true)} />
                )}
              </Card>

              <Card className="p-6">
                <h2 className="font-semibold text-navy mb-4">7-Day Mood Trend</h2>
                {loading ? (
                  <Skeleton className="h-48 w-full" />
                ) : moods.length > 0 ? (
                  <MoodChart moods={moods.slice(0, 7)} />
                ) : (
                  <div className="h-48 flex items-center justify-center text-sm text-gray">
                    Log your mood to see trends here
                  </div>
                )}
              </Card>
            </div>

            {/* Latest Awareness Posts */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-navy">Latest Awareness</h2>
                <Link href={`/${locale}/dashboard/awareness`}>
                  <Button variant="ghost" size="sm">View all</Button>
                </Link>
              </div>
              {loading ? (
                <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
              ) : posts.length ? (
                <div className="space-y-3">
                  {posts.map(post => (
                    <div key={post.id} className="flex gap-3 p-3 rounded-radius-md bg-gray-light">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-navy truncate">
                          {(post as any)[`title_${locale}`] || post.title_en}
                        </p>
                        {post.category && <Badge variant="outline" className="mt-1">{post.category}</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray text-center py-4">No awareness posts yet</p>
              )}
            </Card>
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
