"use client";

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

function QRScannerInner({ onScan, onClose }: QRScannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const startScanner = async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        if (!mounted || !containerRef.current) return;

        const scanner = new Html5Qrcode('qr-scanner-container');
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            onScan(decodedText);
            scanner.stop().catch(() => {});
          },
          () => {}
        );
      } catch (err: any) {
        if (mounted) setError(err?.message || 'Camera access denied. Please allow camera permissions.');
      }
    };

    startScanner();

    return () => {
      mounted = false;
      scannerRef.current?.stop().catch(() => {});
    };
  }, [onScan]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-sm">
        <div
          id="qr-scanner-container"
          ref={containerRef}
          className="rounded-lg overflow-hidden"
        />
        {/* Scan overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-48 h-48 border-2 border-teal rounded-lg" />
        </div>
      </div>

      {error && (
        <p className="text-danger text-sm text-center px-4">{error}</p>
      )}

      <p className="text-sm text-gray text-center">
        Point the camera at a patient&apos;s Health ID QR code
      </p>

      <Button variant="ghost" onClick={onClose} className="gap-2">
        <X className="h-4 w-4" /> Cancel
      </Button>
    </div>
  );
}

// Must be imported with ssr: false to prevent server-side window errors
export const QRScanner = dynamic(() => Promise.resolve(QRScannerInner), { ssr: false });
