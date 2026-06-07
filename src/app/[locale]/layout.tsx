import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Noto_Sans_Ethiopic } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ToastProvider } from "@/components/ui/Toast";
import "../globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  preload: false,
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  preload: false,
});

const notoSansEthiopic = Noto_Sans_Ethiopic({
  variable: "--font-noto-ethiopic",
  subsets: ["ethiopic"],
  weight: ["400", "600", "700"],
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "Selam — Mental Wellness & Health Network",
    template: "%s | Selam",
  },
  description: "Premium multilingual mental wellness and health network platform for Ethiopia and East Africa.",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${playfair.variable} ${dmSans.variable} ${notoSansEthiopic.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-sans bg-off-white text-dark antialiased">
        <NextIntlClientProvider messages={messages}>
          <ToastProvider>
            {children}
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
