"use client";

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Sidebar } from '@/components/layout/Sidebar';
import { ToastProvider, useToast } from '@/components/ui/Toast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Edit2, BarChart2, Newspaper, Globe } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { AwarenessPost } from '@/types';

const postSchema = z.object({
  title_en: z.string().min(2), title_am: z.string().optional(),
  title_ti: z.string().optional(), title_om: z.string().optional(),
  body_en: z.string().min(10), body_am: z.string().optional(),
  body_ti: z.string().optional(), body_om: z.string().optional(),
  category: z.string().min(1),
});
type PostForm = z.infer<typeof postSchema>;

const CATEGORIES = ['Mental Health', 'Nutrition', 'Maternal', 'HIV/AIDS', 'Malaria', 'Hygiene', 'General'];
const LANG_TABS = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'am', label: 'አማርኛ', flag: '🇪🇹' },
  { code: 'ti', label: 'ትግርኛ', flag: '🇪🇷' },
  { code: 'om', label: 'Oromoo', flag: '🇪🇹' },
];

function AgentContent() {
  const { toast } = useToast();
  const locale = useLocale();
  const [posts, setPosts] = useState<AwarenessPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('en');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
  });

  const fetchPosts = () => {
    fetch('/api/awareness?page=1&lang=en&limit=50')
      .then(r => r.json())
      .then(d => setPosts(d.posts || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, []);

  const onSubmit = async (data: PostForm) => {
    const res = await fetch('/api/awareness', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast('Post published!', 'success');
      reset();
      setShowModal(false);
      fetchPosts();
    } else {
      toast('Failed to publish', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Newspaper, label: 'Posts Published', value: posts.length },
          { icon: Globe, label: 'Languages Covered', value: 4 },
          { icon: BarChart2, label: 'Active Campaigns', value: posts.filter(p => p.category).length },
        ].map(s => (
          <Card key={s.label} className="p-4 text-center">
            <s.icon className="h-6 w-6 text-teal mx-auto mb-2" />
            <p className="text-3xl font-bold text-navy font-display">{s.value}</p>
            <p className="text-xs text-gray">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Publish button */}
      <div className="flex justify-end">
        <Button onClick={() => setShowModal(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Publish New Post
        </Button>
      </div>

      {/* Posts table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-light">
          <h2 className="font-semibold text-navy">Published Posts</h2>
        </div>
        {loading ? (
          <div className="p-4 space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full" />)}</div>
        ) : posts.length === 0 ? (
          <p className="text-sm text-gray text-center p-8">No posts yet. Publish your first awareness post!</p>
        ) : (
          <div className="divide-y divide-[var(--gray-light)]">
            {posts.map(post => (
              <div key={post.id} className="flex items-center gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-navy truncate">{post.title_en}</p>
                  <p className="text-xs text-gray">{formatDate(post.published_at)}</p>
                </div>
                {post.category && <Badge variant="outline">{post.category}</Badge>}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Post Form Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); reset(); }} title="Create Awareness Post" className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-navy block mb-1.5">Category</label>
            <select {...register('category')} className="w-full h-11 px-3 rounded-radius-md border border-gray-light text-sm focus:outline-none focus:ring-2 focus:ring-teal">
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-xs text-danger mt-1">Category is required</p>}
          </div>

          {/* Language tabs */}
          <div className="border border-gray-light rounded-radius-lg overflow-hidden">
            <div className="flex border-b border-gray-light bg-gray-light">
              {LANG_TABS.map(t => (
                <button
                  key={t.code}
                  type="button"
                  onClick={() => setActiveTab(t.code)}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors ${activeTab === t.code ? 'bg-white text-teal border-b-2 border-teal' : 'text-gray hover:text-navy'}`}
                >
                  {t.flag} {t.label}
                </button>
              ))}
            </div>
            <div className="p-4 space-y-3">
              {LANG_TABS.map(t => (
                <div key={t.code} className={t.code === activeTab ? 'block' : 'hidden'}>
                  <Input
                    label={`Title (${t.label})`}
                    error={(errors as any)[`title_${t.code}`]?.message}
                    {...register(`title_${t.code}` as keyof PostForm)}
                    placeholder={`Post title in ${t.label}`}
                  />
                  <div className="mt-3">
                    <label className="text-sm font-medium text-navy block mb-1.5">Body ({t.label})</label>
                    <textarea
                      {...register(`body_${t.code}` as keyof PostForm)}
                      rows={5}
                      placeholder={`Post content in ${t.label}`}
                      className="w-full px-3 py-2 rounded-radius-md border border-gray-light text-sm focus:outline-none focus:ring-2 focus:ring-teal resize-none"
                    />
                    {(errors as any)[`body_${t.code}`] && (
                      <p className="text-xs text-danger mt-1">{(errors as any)[`body_${t.code}`]?.message}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" isLoading={isSubmitting} className="flex-1">Publish Post</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function AgentDashboardPage() {
  return (
    <ToastProvider>
      <div className="flex h-screen bg-off-white overflow-hidden">
        <Sidebar role="agent" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="font-display text-2xl font-bold text-navy mb-6">NGO Agent Dashboard</h1>
            <AgentContent />
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
