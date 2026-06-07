"use client";

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ToastProvider } from '@/components/ui/Toast';
import { HospitalMap } from '@/components/features/HospitalMap';
import { Skeleton } from '@/components/ui/Skeleton';
import { Hospital } from '@/types';
import { Phone, MapPin, Navigation } from 'lucide-react';

const EMERGENCY_NUMBERS = [
  { name: 'Police', number: '911', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { name: 'Ambulance', number: '907', color: 'bg-red-50 border-red-200 text-red-700' },
  { name: 'Mental Health', number: '8722', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { name: 'Fire Brigade', number: '939', color: 'bg-orange-50 border-orange-200 text-orange-700' },
];

const TYPE_COLORS: Record<string, string> = {
  'Specialized': 'bg-purple-100 text-purple-700',
  'Public General': 'bg-blue-100 text-blue-700',
  'Private General': 'bg-teal-light text-teal',
  'Health Center': 'bg-green-100 text-green-700',
};

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPos, setUserPos] = useState<[number, number]>([9.03, 38.74]);
  const [selected, setSelected] = useState<Hospital | null>(null);

  useEffect(() => {
    const fetchHospitals = (lat: number, lng: number) => {
      setUserPos([lat, lng]);
      fetch(`/api/hospitals?lat=${lat}&lng=${lng}`)
        .then(r => r.json())
        .then(d => {
          const list: Hospital[] = d.hospitals || [];
          setHospitals(list);
          if (list.length > 0) setSelected(list[0]);
        })
        .finally(() => setLoading(false));
    };

    navigator.geolocation?.getCurrentPosition(
      pos => fetchHospitals(pos.coords.latitude, pos.coords.longitude),
      () => fetchHospitals(9.03, 38.74)
    );
  }, []);

  return (
    <ToastProvider>
      <div className="flex h-screen bg-off-white overflow-hidden">
        <Sidebar role="client" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-2xl font-bold text-navy">Nearby Hospitals</h1>
                <p className="text-sm text-gray mt-1 flex items-center gap-1">
                  <Navigation className="h-3.5 w-3.5" />
                  Showing hospitals closest to your location
                </p>
              </div>
              {/* Emergency banner */}
              <div className="hidden sm:flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
                <span className="text-danger text-sm font-semibold">🚨 Emergency:</span>
                <a href="tel:907" className="text-danger font-bold text-lg hover:underline">907</a>
                <span className="text-gray text-xs">Ambulance</span>
              </div>
            </div>

            {/* Map — full width, explicit height owned by HospitalMap itself */}
            <div className="w-full rounded-2xl overflow-hidden border border-gray-light shadow-md bg-white">
              {loading
                ? <Skeleton className="w-full rounded-none" style={{ height: '420px' } as any} />
                : <HospitalMap hospitals={hospitals} userPos={userPos} />
              }
            </div>

            {/* Two-column: hospital list + emergency numbers */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Hospital Cards — takes 2/3 */}
              <div className="lg:col-span-2">
                <h2 className="font-semibold text-navy mb-3">
                  {loading ? 'Finding hospitals…' : `${hospitals.length} hospitals found`}
                </h2>
                <div className="space-y-3">
                  {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-light p-4 flex gap-3">
                          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-3 w-1/3" />
                          </div>
                        </div>
                      ))
                    : hospitals.map((h, i) => {
                        const typeColor = TYPE_COLORS[h.type || ''] || 'bg-gray-100 text-gray';
                        const isSelected = selected?.id === h.id;
                        return (
                          <button
                            key={h.id}
                            onClick={() => setSelected(h)}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                              isSelected
                                ? 'border-teal bg-teal-light shadow-sm'
                                : 'border-gray-light bg-white hover:border-teal/40 hover:shadow-sm'
                            }`}
                          >
                            {/* Rank badge */}
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${isSelected ? 'bg-teal text-white' : 'bg-gray-100 text-gray'}`}>
                              {i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-navy text-sm truncate">{h.name}</p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                {h.type && (
                                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${typeColor}`}>
                                    {h.type}
                                  </span>
                                )}
                                {(h as any).distance != null && (
                                  <span className="text-[10px] text-gray flex items-center gap-0.5">
                                    <MapPin className="h-3 w-3" />
                                    {((h as any).distance as number).toFixed(1)} km
                                  </span>
                                )}
                              </div>
                            </div>
                            {h.phone && (
                              <a
                                href={`tel:${h.phone}`}
                                onClick={e => e.stopPropagation()}
                                className="flex items-center gap-1.5 bg-teal text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-teal/90 transition-colors shrink-0"
                              >
                                <Phone className="h-3.5 w-3.5" />
                                Call
                              </a>
                            )}
                          </button>
                        );
                      })}
                </div>
              </div>

              {/* Emergency Numbers — takes 1/3 */}
              <div>
                <h2 className="font-semibold text-navy mb-3">Emergency Numbers</h2>
                <div className="space-y-3">
                  {EMERGENCY_NUMBERS.map(e => (
                    <a
                      key={e.name}
                      href={`tel:${e.number}`}
                      className={`flex items-center justify-between p-4 rounded-xl border ${e.color} hover:shadow-sm transition-all`}
                    >
                      <span className="text-sm font-medium">{e.name}</span>
                      <span className="font-bold text-xl font-display">{e.number}</span>
                    </a>
                  ))}
                </div>

                {/* Selected hospital detail card */}
                {selected && (
                  <div className="mt-5 bg-white rounded-xl border border-teal p-4 shadow-sm">
                    <p className="text-xs text-teal font-semibold uppercase tracking-wide mb-2">Selected Hospital</p>
                    <p className="font-bold text-navy">{selected.name}</p>
                    {selected.type && <p className="text-sm text-gray mt-0.5">{selected.type}</p>}
                    {(selected as any).distance != null && (
                      <p className="text-xs text-gray mt-1 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-teal" />
                        {((selected as any).distance as number).toFixed(2)} km away
                      </p>
                    )}
                    {selected.phone && (
                      <a
                        href={`tel:${selected.phone}`}
                        className="mt-3 flex items-center justify-center gap-2 w-full bg-teal text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-teal/90 transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        Call {selected.phone}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
