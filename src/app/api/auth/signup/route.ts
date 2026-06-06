import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { signToken } from '@/lib/auth';

const signupSchema = z.object({
  phone: z.string().min(9),
  pin: z.string().length(6),
  full_name: z.string().min(2),
  role: z.enum(['client', 'doctor', 'agent']),
  language: z.string().default('en'),
  blood_type: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.issues }, { status: 400 });
    }

    const { phone, pin, full_name, role, language, blood_type } = parsed.data;

    // Check if phone exists
    const { data: existingUser } = await supabase.from('profiles').select('id').eq('phone', phone).single();
    if (existingUser) {
      return NextResponse.json({ error: 'Phone number already registered' }, { status: 409 });
    }

    const pin_hash = await bcrypt.hash(pin, 12);

    // Insert profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({ phone, pin_hash, full_name, role, language, blood_type })
      .select()
      .single();

    if (profileError || !profile) {
      console.error(profileError);
      return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
    }

    // Initialize patient_records for clients and doctors
    if (role === 'client' || role === 'doctor') {
      const qr_uid = Math.random().toString(36).substring(2, 14); // basic nanoid equivalent
      await supabase.from('patient_records').insert({
        user_id: profile.id,
        qr_uid,
        blood_type: blood_type || null
      });
    }

    // Add free subscription
    await supabase.from('subscriptions').insert({
      user_id: profile.id,
      plan: 'free',
      status: 'active'
    });

    // Create JWT
    const token = await signToken({ id: profile.id, role: profile.role, phone: profile.phone });
    
    const response = NextResponse.json({ user: { id: profile.id, role: profile.role, full_name: profile.full_name, language: profile.language } });
    
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
