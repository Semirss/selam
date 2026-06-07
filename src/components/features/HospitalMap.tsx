"use client";

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Hospital } from '@/types';
import { Skeleton } from '@/components/ui/Skeleton';

interface HospitalMapProps {
  hospitals: Hospital[];
  userPos?: [number, number];
}

function HospitalMapInner({ hospitals, userPos: userPosProp }: HospitalMapProps) {
  const [mounted, setMounted] = useState(false);
  const [userPos, setUserPos] = useState<[number, number]>(userPosProp || [9.03, 38.74]);

  useEffect(() => {
    setMounted(true);
    if (userPosProp) {
      setUserPos(userPosProp);
    } else {
      navigator.geolocation?.getCurrentPosition(
        pos => setUserPos([pos.coords.latitude, pos.coords.longitude]),
        () => setUserPos([9.03, 38.74])
      );
    }
  }, [userPosProp]);

  if (!mounted) return <Skeleton className="w-full h-full rounded-none" />;

  const { MapContainer, TileLayer, Marker, Popup, Circle } = require('react-leaflet');
  const L = require('leaflet');

  // Fix default icon path issue in Next.js
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });

  const tealIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    // Fill the parent container completely — parent sets the height
    <MapContainer
      center={userPos}
      zoom={14}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* User position indicator */}
      <Circle
        center={userPos}
        radius={300}
        pathOptions={{ color: '#1A9E7A', fillColor: '#1A9E7A', fillOpacity: 0.15, weight: 2 }}
      />
      {hospitals.map(h => (
        <Marker key={h.id} position={[h.lat, h.lng]} icon={tealIcon}>
          <Popup>
            <div style={{ minWidth: 140 }}>
              <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{h.name}</p>
              {h.type && <p style={{ fontSize: 11, color: '#6B7280', marginBottom: 4 }}>{h.type}</p>}
              {h.phone && (
                <a
                  href={`tel:${h.phone}`}
                  style={{ fontSize: 12, color: '#1A9E7A', fontWeight: 600 }}
                >
                  📞 {h.phone}
                </a>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export const HospitalMap = dynamic(() => Promise.resolve(HospitalMapInner), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full rounded-none" />,
});
