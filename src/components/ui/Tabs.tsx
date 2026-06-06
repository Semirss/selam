"use client";

import { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  className?: string;
}

export function Tabs({ tabs, className }: TabsProps) {
  const [active, setActive] = useState(tabs[0]?.id);

  return (
    <div className={cn('w-full', className)}>
      <div className="relative flex gap-1 border-b border-gray-light mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              'relative px-4 py-3 text-sm font-medium transition-colors',
              active === tab.id ? 'text-teal' : 'text-gray hover:text-navy'
            )}
          >
            {tab.label}
            {active === tab.id && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal rounded-full"
              />
            )}
          </button>
        ))}
      </div>
      <div>
        {tabs.map(tab => (
          <div key={tab.id} className={tab.id === active ? 'block' : 'hidden'}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
