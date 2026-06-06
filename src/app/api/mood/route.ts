import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const moodSchema = z.object({
  score: z.number().int().min(1).max(10),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = moodSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  // Check if already logged today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { data: existing } = await supabase
    .from('mood_logs')
    .select('id')
    .eq('user_id', userId)
    .gte('created_at', today.toISOString())
    .single();

  if (existing) {
    return NextResponse.json({ error: 'Already logged mood for today' }, { status: 409 });
  }

  const { data, error } = await supabase
    .from('mood_logs')
    .insert({ user_id: userId, ...parsed.data })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ mood: data }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data } = await supabase
    .from('mood_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(30);

  return NextResponse.json({ moods: data || [] });
}
