"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Home, Heart, CreditCard, Newspaper, MapPin,
  Stethoscope, Users, BarChart, ChevronLeft, ChevronRight, LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  role: 'client' | 'doctor' | 'agent';
}

export function Sidebar({ role }: SidebarProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push(`/${locale}/auth/login`);
  };

  const clientLinks = [
    { href: `/${locale}/dashboard`, icon: Home, label: 'Home' },
    { href: `/${locale}/dashboard/wellness`, icon: Heart, label: 'Wellness' },
    { href: `/${locale}/dashboard/health-id`, icon: CreditCard, label: 'Health ID' },
    { href: `/${locale}/dashboard/awareness`, icon: Newspaper, label: 'Awareness' },
    { href: `/${locale}/dashboard/hospitals`, icon: MapPin, label: 'Hospitals' },
  ];

  const doctorLinks = [
    { href: `/${locale}/doctor`, icon: Stethoscope, label: 'Scan Patient' },
    { href: `/${locale}/doctor/history`, icon: Users, label: 'History' },
  ];

  const agentLinks = [
    { href: `/${locale}/agent`, icon: Home, label: 'Dashboard' },
    { href: `/${locale}/agent/posts`, icon: Newspaper, label: 'Posts' },
    { href: `/${locale}/agent/analytics`, icon: BarChart, label: 'Analytics' },
  ];

  const links = role === 'doctor' ? doctorLinks : role === 'agent' ? agentLinks : clientLinks;

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      className="hidden md:flex flex-col bg-white border-r border-gray-light shadow-sm h-screen sticky top-0 overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 h-16 border-b border-gray-light">
        {!collapsed && (
          <span className="font-display font-bold text-navy text-lg">Selam</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1.5 rounded-lg hover:bg-gray-light transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4 text-gray" /> : <ChevronLeft className="h-4 w-4 text-gray" />}
        </button>
      </div>

      <nav className="flex flex-col gap-1 p-3 flex-1">
        {links.map(link => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors font-medium text-sm',
                active
                  ? 'bg-teal-light text-teal '
                  : 'text-gray hover:bg-gray-light hover:text-navy'
              )}
              title={link.label}
            >
              <link.icon className={cn('h-5 w-5 shrink-0', active ? 'text-teal' : '')} />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-3 border-t border-gray-light">
        <button
          onClick={handleSignOut}
          title="Sign Out"
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium text-gray hover:bg-red-50 hover:text-danger transition-colors"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </motion.aside>
  );
}
