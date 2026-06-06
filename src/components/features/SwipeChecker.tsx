"use client";

import { useState, useRef, useCallback, ReactNode } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from 'framer-motion';

interface SwipeCheckerProps {
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  children: ReactNode;
  threshold?: number;
  rightLabel?: string;
  leftLabel?: string;
  rightColor?: string;
  leftColor?: string;
}

export function SwipeChecker({
  onSwipeRight,
  onSwipeLeft,
  children,
  threshold = 80,
  rightLabel = '✓ Confirm',
  leftLabel = '✗ Dismiss',
  rightColor = '#1A9E7A',
  leftColor = '#E53E3E',
}: SwipeCheckerProps) {
  const x = useMotionValue(0);
  const controls = useAnimation();
  const [revealed, setRevealed] = useState<'left' | 'right' | null>(null);

  const background = useTransform(
    x,
    [-threshold, 0, threshold],
    [leftColor, '#ffffff', rightColor]
  );

  const opacity = useTransform(x, [-threshold, 0, threshold], [1, 0, 1]);

  const handleDragEnd = async (_: any, info: PanInfo) => {
    if (info.offset.x > threshold) {
      setRevealed('right');
      await controls.start({ x: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } });
      onSwipeRight?.();
      setRevealed(null);
    } else if (info.offset.x < -threshold) {
      setRevealed('left');
      await controls.start({ x: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } });
      onSwipeLeft?.();
      setRevealed(null);
    } else {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Background hint */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none"
      >
        <span className="text-sm font-bold text-white">{leftLabel}</span>
        <span className="text-sm font-bold text-white">{rightLabel}</span>
      </motion.div>

      {/* Swipeable card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -threshold * 1.5, right: threshold * 1.5 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
        className="relative z-10 cursor-grab active:cursor-grabbing select-none"
      >
        {children}
      </motion.div>
    </div>
  );
}
