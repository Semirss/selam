import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// This layout wraps the entire app but actual HTML structure is in [locale]/layout.tsx
// This exists to satisfy Next.js App Router requirements
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Analytics />
      <SpeedInsights />
    </>
  );
}
