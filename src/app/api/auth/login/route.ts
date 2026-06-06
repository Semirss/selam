import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { signToken } from '@/lib/auth';

const loginSchema = z.object({
  phone: z.string().min(9),
  pin: z.string().length(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { phone, pin } = parsed.data;

    // Query profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('phone', phone)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify PIN
    const isValid = await bcrypt.compare(pin, profile.pin_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create JWT
    const token = await signToken({ id: profile.id, role: profile.role, phone: profile.phone });
    
    const response = NextResponse.json({ 
      user: { id: profile.id, role: profile.role, full_name: profile.full_name, language: profile.language } 
    });
    
    response.cookies.set({
      name: 'selam_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
