import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const diagnosisSchema = z.object({
  patient_id: z.string().uuid(),
  diagnosis_code: z.string().min(1),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const role = req.headers.get('x-user-role');
  const doctorId = req.headers.get('x-user-id');
  if (role !== 'doctor' || !doctorId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const parsed = diagnosisSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const { data, error } = await supabase
    .from('diagnoses')
    .insert({ ...parsed.data, doctor_id: doctorId })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ diagnosis: data }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const role = req.headers.get('x-user-role');
  if (role !== 'doctor') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const patientId = searchParams.get('patient_id');
  if (!patientId) return NextResponse.json({ error: 'Missing patient_id' }, { status: 400 });

  const { data } = await supabase
    .from('diagnoses')
    .select('*, doctor:profiles!diagnoses_doctor_id_fkey(full_name)')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });

  return NextResponse.json({ diagnoses: data || [] });
}
