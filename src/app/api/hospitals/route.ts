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

const DUMMY_HOSPITALS = [
  { id: 'h1', name: 'Black Lion Hospital', lat: 9.0226, lng: 38.7470, type: 'Public General', phone: '+251115518800', region: 'Addis Ababa' },
  { id: 'h2', name: 'St. Paul\'s Hospital', lat: 9.0340, lng: 38.7580, type: 'Public General', phone: '+251115514555', region: 'Addis Ababa' },
  { id: 'h3', name: 'Tikur Anbessa Specialized Hospital', lat: 9.0203, lng: 38.7466, type: 'Specialized', phone: '+251115510251', region: 'Addis Ababa' },
  { id: 'h4', name: 'MCM General Hospital', lat: 9.0150, lng: 38.7613, type: 'Private General', phone: '+251116636100', region: 'Addis Ababa' },
  { id: 'h5', name: 'Amen Health Center', lat: 9.0280, lng: 38.7520, type: 'Health Center', phone: '+251115517000', region: 'Addis Ababa' },
  { id: 'h6', name: 'Hayat Hospital', lat: 9.0100, lng: 38.7790, type: 'Private General', phone: '+251115534888', region: 'Addis Ababa' },
  { id: 'h7', name: 'Bethzatha General Hospital', lat: 9.0350, lng: 38.7640, type: 'Private General', phone: '+251116186060', region: 'Addis Ababa' },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') || '9.03');
  const lng = parseFloat(searchParams.get('lng') || '38.74');

  const { data: hospitals, error } = await supabase.from('hospitals').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Use dummy data if DB is empty
  const source = (hospitals && hospitals.length > 0) ? hospitals : DUMMY_HOSPITALS;

  // Sort by distance and return closest 10
  const sorted = source
    .map(h => ({ ...h, distance: haversine(lat, lng, h.lat, h.lng) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 10);

  return NextResponse.json({ hospitals: sorted });
}
