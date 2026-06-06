'use client';

import React from 'react';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from './Button';
import { HeartPulse } from 'lucide-react';

export const Navbar = () => {
  const t = useTranslations('Index');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.replace(pathname, { locale: e.target.value });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-background)]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <HeartPulse className="w-8 h-8 text-[var(--color-primary)]" />
          <span className="text-xl font-bold text-[var(--color-secondary)]">{t('title')}</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <select 
            value={locale} 
            onChange={handleLanguageChange}
            className="bg-transparent text-sm text-[var(--color-secondary)] border-none focus:ring-0 cursor-pointer outline-none"
          >
            <option value="en">EN</option>
            <option value="am">አማ</option>
            <option value="ti">ትግ</option>
            <option value="om">Oromoo</option>
          </select>
          <div className="hidden sm:flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">{t('login')}</Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="primary" size="sm">{t('signup')}</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
