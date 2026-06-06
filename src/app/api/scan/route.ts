import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

export async function GET(req: NextRequest) {
  const role = req.headers.get('x-user-role');
  if (role !== 'doctor') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const qrUid = searchParams.get('qrUid');
  if (!qrUid) return NextResponse.json({ error: 'Missing qrUid' }, { status: 400 });

  // Get patient record + profile
  const { data: record, error } = await supabase
    .from('patient_records')
    .select('*, profiles(*)')
    .eq('qr_uid', qrUid)
    .single();

  if (error || !record) return NextResponse.json({ error: 'Patient not found' }, { status: 404 });

  // Get diagnoses with doctor name
  const { data: diagnoses } = await supabase
    .from('diagnoses')
    .select('*, doctor:profiles!diagnoses_doctor_id_fkey(full_name)')
    .eq('patient_id', record.user_id)
    .order('created_at', { ascending: false });

  // Get emergency contacts
  const { data: contacts } = await supabase
    .from('emergency_contacts')
    .select('*')
    .eq('user_id', record.user_id);

  return NextResponse.json({
    record: {
      ...record,
      diagnoses: diagnoses || [],
      emergency_contacts: contacts || [],
    }
  });
}
