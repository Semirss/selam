"use client";

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Hospital } from '@/types';
import { Skeleton } from '@/components/ui/Skeleton';
import { Phone, MapPin } from 'lucide-react';

interface HospitalMapProps {
  hospitals: Hospital[];
}

function HospitalMapInner({ hospitals }: HospitalMapProps) {
  const [mounted, setMounted] = useState(false);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [selected, setSelected] = useState<Hospital | null>(null);

  useEffect(() => {
    setMounted(true);
    navigator.geolocation?.getCurrentPosition(
      pos => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      () => setUserPos([9.03, 38.74]) // Addis Ababa fallback
    );
  }, []);

  if (!mounted || !userPos) return <Skeleton className="h-64 w-full" />;

  // Dynamic import Leaflet inside client only
  const { MapContainer, TileLayer, Marker, Popup, Circle } = require('react-leaflet');
  const L = require('leaflet');

  // Fix leaflet default icons in Next.js
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });

  const tealIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
  });

  return (
    <div className="space-y-3">
      <MapContainer
        center={userPos}
        zoom={13}
        style={{ height: '320px', width: '100%', borderRadius: 'var(--radius-lg)' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle center={userPos} radius={500} pathOptions={{ color: '#1A9E7A', fillOpacity: 0.1 }} />
        {hospitals.map(h => (
          <Marker key={h.id} position={[h.lat, h.lng]} icon={tealIcon} eventHandlers={{ click: () => setSelected(h) }}>
            <Popup>
              <div className="text-sm font-semibold">{h.name}</div>
              {h.type && <div className="text-xs text-gray-500">{h.type}</div>}
              {h.phone && <a href={`tel:${h.phone}`} className="text-xs text-teal-600">{h.phone}</a>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {selected && (
        <div className="flex items-center justify-between p-3 bg-teal-light rounded-md border border-teal-mid">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-teal" />
            <div>
              <p className="font-semibold text-navy text-sm">{selected.name}</p>
              {selected.type && <p className="text-xs text-gray">{selected.type}</p>}
            </div>
          </div>
          {selected.phone && (
            <a href={`tel:${selected.phone}`} className="flex items-center gap-1 text-teal text-sm hover:underline">
              <Phone className="h-4 w-4" /> {selected.phone}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export const HospitalMap = dynamic(() => Promise.resolve(HospitalMapInner), { ssr: false });
