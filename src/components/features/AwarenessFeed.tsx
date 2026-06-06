"use client";

import { useState, useEffect } from 'react';
import { AwarenessPost } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { Search } from 'lucide-react';

interface AwarenessFeedProps {
  locale: string;
}

const CATEGORIES = ['All', 'Mental Health', 'Nutrition', 'Maternal', 'HIV/AIDS', 'Malaria', 'Hygiene'];

export function AwarenessFeed({ locale }: AwarenessFeedProps) {
  const [posts, setPosts] = useState<AwarenessPost[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (reset = false) => {
    setLoading(true);
    const p = reset ? 1 : page;
    const cat = category !== 'All' ? `&category=${encodeURIComponent(category)}` : '';
    const res = await fetch(`/api/awareness?page=${p}&lang=${locale}${cat}`);
    const data = await res.json();
    const fetched: AwarenessPost[] = data.posts || [];
    setPosts(prev => reset ? fetched : [...prev, ...fetched]);
    setHasMore(fetched.length === 10);
    if (reset) setPage(2); else setPage(p + 1);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(true); }, [category, locale]);

  const getTitle = (post: AwarenessPost) =>
    (post as any)[`title_${locale}`] || post.title_en || 'Untitled';
  const getBody = (post: AwarenessPost) =>
    (post as any)[`body_${locale}`] || post.body_en || '';

  const filtered = posts.filter(p =>
    getTitle(p).toLowerCase().includes(search.toLowerCase()) ||
    getBody(p).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search articles..."
          className="w-full h-11 pl-10 pr-4 rounded-md border border-gray-light text-sm focus:outline-none focus:ring-2 focus:ring-teal"
        />
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              category === cat
                ? 'bg-teal text-white'
                : 'bg-gray-light text-gray hover:text-navy'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {loading && posts.length === 0
          ? Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-5 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </Card>
            ))
          : filtered.map(post => (
              <Card key={post.id} hoverLift className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-navy leading-snug">{getTitle(post)}</h3>
                  {post.category && <Badge variant="outline">{post.category}</Badge>}
                </div>
                <p className="text-sm text-gray line-clamp-3">{getBody(post)}</p>
                <p className="text-xs text-gray mt-3">{formatDate(post.published_at)}</p>
              </Card>
            ))}
      </div>

      {hasMore && !loading && (
        <Button variant="ghost" onClick={() => fetchPosts()} className="w-full">
          Load more
        </Button>
      )}
    </div>
  );
}
