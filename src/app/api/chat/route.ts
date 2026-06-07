import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { streamChat, buildWellnessSystemPrompt } from '@/lib/gemini';
import { z } from 'zod';

const chatSchema = z.object({
  messages: z.array(z.object({ role: z.string(), content: z.string() })),
  locale: z.string().default('en'),
  anonymous: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = chatSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { messages, locale, anonymous } = parsed.data;
    const userId = req.headers.get('x-user-id');

    let recentMoods: number[] = [];
    let userName: string | undefined;

    if (!anonymous && userId) {
      const { data: moods } = await supabase
        .from('mood_logs')
        .select('score')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(7);
      recentMoods = (moods || []).map(m => m.score).reverse();

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single();
      userName = profile?.full_name;
    }

    const systemPrompt = buildWellnessSystemPrompt({ anonymous, userName, language: locale, recentMoods });
    const stream = await streamChat(messages, systemPrompt);

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' }
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    // Handle Gemini API quota / rate limit gracefully
    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'The AI is taking a short break due to high demand. Please try again in a moment.' },
        { status: 429 }
      );
    }
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
  }
}
