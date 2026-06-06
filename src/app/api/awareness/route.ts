import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const postSchema = z.object({
  title_en: z.string().min(2),
  title_am: z.string().optional(),
  title_ti: z.string().optional(),
  title_om: z.string().optional(),
  body_en: z.string().min(10),
  body_am: z.string().optional(),
  body_ti: z.string().optional(),
  body_om: z.string().optional(),
  category: z.string().min(1),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const lang = searchParams.get('lang') || 'en';
  const category = searchParams.get('category');
  const limit = 10;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('awareness_posts')
    .select('*')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) query = query.eq('category', category);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ posts: data || [] });
}

export async function POST(req: NextRequest) {
  const role = req.headers.get('x-user-role');
  const userId = req.headers.get('x-user-id');

  if (role !== 'agent' || !userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const { data, error } = await supabase
    .from('awareness_posts')
    .insert({ ...parsed.data, author_id: userId })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ post: data }, { status: 201 });
}
