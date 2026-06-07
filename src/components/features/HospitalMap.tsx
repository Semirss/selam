"use client";

import { useEffect, useState, useRef } from 'react';
import { Hospital } from '@/types';
import { Skeleton } from '@/components/ui/Skeleton';

interface HospitalMapProps {
  hospitals: Hospital[];
  userPos?: [number, number];
}

function HospitalMapInner({ hospitals, userPos: userPosProp }: HospitalMapProps) {
  const [mounted, setMounted] = useState(false);
  const [userPos, setUserPos] = useState<[number, number]>(userPosProp || [9.03, 38.74]);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // Import Leaflet CSS dynamically — this is the critical missing piece
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

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

  // When userPos or hospitals change, invalidate the map size so Leaflet
  // recalculates its container bounds
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 100);
    }
  }, [userPos, hospitals]);

  if (!mounted) return <Skeleton className="w-full h-full rounded-none" />;

  const { MapContainer, TileLayer, Marker, Popup, Circle, useMap } = require('react-leaflet');
  const L = require('leaflet');

  // Fix default icon path issue in Next.js
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });

  const hospitalIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <MapContainer
      center={userPos}
      zoom={13}
      // Use explicit pixel height — Leaflet REQUIRES a computed pixel height to render
      style={{ height: '420px', width: '100%' }}
      scrollWheelZoom={true}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* User location */}
      <Marker position={userPos} icon={userIcon}>
        <Popup>
          <p style={{ fontWeight: 700, fontSize: 13 }}>📍 Your Location</p>
        </Popup>
      </Marker>
      <Circle
        center={userPos}
        radius={500}
        pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1, weight: 2 }}
      />
      {/* Hospital markers */}
      {hospitals.map(h => (
        <Marker key={h.id} position={[h.lat, h.lng]} icon={hospitalIcon}>
          <Popup>
            <div style={{ minWidth: 160 }}>
              <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>🏥 {h.name}</p>
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

import dynamic from 'next/dynamic';
export const HospitalMap = dynamic(() => Promise.resolve(HospitalMapInner), {
  ssr: false,
  loading: () => <Skeleton className="w-full rounded-2xl" style={{ height: '420px' } as any} />,
});
