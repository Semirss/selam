import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') || '9.03');
  const lng = parseFloat(searchParams.get('lng') || '38.74');

  const { data: hospitals, error } = await supabase.from('hospitals').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Sort by distance and return closest 10
  const sorted = (hospitals || [])
    .map(h => ({ ...h, distance: haversine(lat, lng, h.lat, h.lng) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 10);

  return NextResponse.json({ hospitals: sorted });
}
