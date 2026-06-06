"use client";

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Sidebar } from '@/components/layout/Sidebar';
import { ToastProvider } from '@/components/ui/Toast';
import { AwarenessFeed } from '@/components/features/AwarenessFeed';
import { HospitalMap } from '@/components/features/HospitalMap';
import { Skeleton } from '@/components/ui/Skeleton';
import { Hospital } from '@/types';
import { Phone } from 'lucide-react';

const EMERGENCY_NUMBERS = [
  { name: 'Police', number: '911' },
  { name: 'Ambulance / Medical', number: '907' },
  { name: 'Mental Health Helpline', number: '8722' },
  { name: 'Fire Brigade', number: '939' },
];

export default function AwarenessPage() {
  const locale = useLocale();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loadingMap, setLoadingMap] = useState(true);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      pos => {
        fetch(`/api/hospitals?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`)
          .then(r => r.json())
          .then(d => setHospitals(d.hospitals || []))
          .finally(() => setLoadingMap(false));
      },
      () => {
        fetch('/api/hospitals?lat=9.03&lng=38.74')
          .then(r => r.json())
          .then(d => setHospitals(d.hospitals || []))
          .finally(() => setLoadingMap(false));
      }
    );
  }, []);

  return (
    <ToastProvider>
      <div className="flex h-screen bg-off-white overflow-hidden">
        <Sidebar role="client" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="font-display text-2xl font-bold text-navy mb-6">Awareness & Hospitals</h1>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Feed: 3/5 */}
              <div className="lg:col-span-3">
                <AwarenessFeed locale={locale} />
              </div>

              {/* Map + Emergency: 2/5 */}
              <div className="lg:col-span-2 space-y-5">
                <div>
                  <h2 className="font-semibold text-navy mb-3">Nearby Hospitals</h2>
                  {loadingMap ? (
                    <Skeleton className="h-64 w-full rounded-radius-lg" />
                  ) : (
                    <HospitalMap hospitals={hospitals} />
                  )}
                </div>

                {/* Emergency Numbers */}
                <div className="bg-red-50 border border-red-200 rounded-radius-lg p-4">
                  <h3 className="font-semibold text-danger mb-3">🚨 Emergency Numbers</h3>
                  <div className="space-y-2.5">
                    {EMERGENCY_NUMBERS.map(e => (
                      <a
                        key={e.name}
                        href={`tel:${e.number}`}
                        className="flex items-center justify-between p-2.5 bg-white rounded-radius-md hover:shadow-sm transition-shadow"
                      >
                        <span className="text-sm text-navy">{e.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-danger">{e.number}</span>
                          <Phone className="h-4 w-4 text-danger" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
