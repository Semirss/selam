"use client";

import { QRCodeCanvas } from 'qrcode.react';
import { Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface QRDisplayProps {
  qrUid: string;
  name: string;
}

export function QRDisplay({ qrUid, name }: QRDisplayProps) {
  const downloadQR = () => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `selam-health-id-${qrUid}.png`;
    a.click();
  };

  const shareQR = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'My Selam Health ID', text: `Health ID: ${qrUid}` });
    } else {
      navigator.clipboard.writeText(qrUid);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="p-4 bg-white rounded-lg shadow-md border border-gray-light">
        <QRCodeCanvas
          id="qr-canvas"
          value={qrUid}
          size={200}
          level="H"
          fgColor="#2C4A6E"
          bgColor="#FFFFFF"
        />
      </div>

      <div className="text-center">
        <p className="font-semibold text-navy text-lg">{name}</p>
        <p className="text-xs text-gray font-mono mt-1 tracking-widest">{qrUid}</p>
      </div>

      <div className="flex gap-3 w-full">
        <Button variant="secondary" size="sm" onClick={downloadQR} className="flex-1 gap-2">
          <Download className="h-4 w-4" /> Download
        </Button>
        <Button variant="ghost" size="sm" onClick={shareQR} className="flex-1 gap-2">
          <Share2 className="h-4 w-4" /> Share
        </Button>
      </div>
    </div>
  );
}
