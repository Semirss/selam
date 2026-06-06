import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-off-white gap-6 text-center px-4">
      <div className="h-20 w-20 rounded-full bg-teal-light flex items-center justify-center mb-2">
        <span className="font-display text-4xl font-bold text-teal">?</span>
      </div>
      <h1 className="font-display text-4xl font-bold text-navy">Page Not Found</h1>
      <p className="text-gray max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/en">
        <Button>Go to Home</Button>
      </Link>
    </div>
  );
}
