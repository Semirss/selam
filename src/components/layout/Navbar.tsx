"use client";

import Link from 'next/link';
import { usePathname, useRouter } from '@/i18n/routing';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Menu, X, LogOut, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface NavbarProps {
  user?: { full_name: string; role: string; avatar_url?: string } | null;
}

export function Navbar({ user }: NavbarProps) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'am', label: 'AM' },
    { code: 'ti', label: 'TI' },
    { code: 'om', label: 'OM' },
  ];

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push(`/${locale}`);
  };

  const dashboardLink = user?.role === 'doctor'
    ? `/${locale}/doctor`
    : user?.role === 'agent'
    ? `/${locale}/agent`
    : `/${locale}/dashboard`;

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-white/80 backdrop-blur-[12px] border-b border-gray-light shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-teal flex items-center justify-center">
            <span className="text-white font-bold text-sm font-display">S</span>
          </div>
          <span className="font-display font-bold text-xl text-navy">Selam</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {!user && (
            <>
              <Link href={`/${locale}/`} className="text-sm text-gray hover:text-navy transition-colors">{t('home')}</Link>
              <Link href={`/${locale}/pricing`} className="text-sm text-gray hover:text-navy transition-colors">{t('pricing')}</Link>
              <Link href={`/${locale}/about`} className="text-sm text-gray hover:text-navy transition-colors">{t('about')}</Link>
            </>
          )}
          {user && (
            <Link href={dashboardLink} className="text-sm text-gray hover:text-navy transition-colors">
              {t('dashboard')}
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language switcher */}
          <div className="hidden sm:flex items-center gap-1 border border-gray-light rounded-full px-2 py-1">
            <Globe className="h-3.5 w-3.5 text-gray" />
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => switchLocale(lang.code)}
                className={cn(
                  'text-xs px-1.5 py-0.5 rounded-full transition-colors',
                  locale === lang.code
                    ? 'bg-teal text-white font-semibold'
                    : 'text-gray hover:text-navy'
                )}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <Avatar name={user.full_name} src={user.avatar_url} size="sm" />
              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-gray-light transition-colors"
                title={t('logout')}
              >
                <LogOut className="h-4 w-4 text-gray" />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href={`/${locale}/auth/login`}>
                <Button variant="ghost" size="sm">{t('login')}</Button>
              </Link>
              <Link href={`/${locale}/auth/signup`}>
                <Button variant="primary" size="sm" className="teal-glow">{t('signup')}</Button>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-light transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="md:hidden bg-white border-t border-gray-light px-4 py-4 flex flex-col gap-4"
        >
          {!user && (
            <>
              <Link href={`/${locale}/pricing`} onClick={() => setMenuOpen(false)} className="text-navy font-medium">{t('pricing')}</Link>
              <Link href={`/${locale}/about`} onClick={() => setMenuOpen(false)} className="text-navy font-medium">{t('about')}</Link>
              <Link href={`/${locale}/auth/login`} onClick={() => setMenuOpen(false)}>
                <Button variant="secondary" className="w-full">{t('login')}</Button>
              </Link>
              <Link href={`/${locale}/auth/signup`} onClick={() => setMenuOpen(false)}>
                <Button variant="primary" className="w-full">{t('signup')}</Button>
              </Link>
            </>
          )}
          {user && (
            <>
              <Link href={dashboardLink} onClick={() => setMenuOpen(false)} className="text-navy font-medium">{t('dashboard')}</Link>
              <button onClick={handleLogout} className="flex items-center gap-2 text-danger">
                <LogOut className="h-4 w-4" /> {t('logout')}
              </button>
            </>
          )}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-light">
            <Globe className="h-4 w-4 text-gray" />
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => { switchLocale(lang.code); setMenuOpen(false); }}
                className={cn(
                  'text-sm px-2 py-1 rounded-full transition-colors',
                  locale === lang.code
                    ? 'bg-teal text-white font-semibold'
                    : 'text-gray'
                )}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
