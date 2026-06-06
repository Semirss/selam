"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

interface MoodLoggerProps {
  onLogged?: () => void;
}

export function MoodLogger({ onLogged }: MoodLoggerProps) {
  const [score, setScore] = useState(5);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const emojis = ['😔', '😟', '😕', '😐', '🙂', '😊', '😄', '😁', '🤩', '🥳'];
  const labels = ['Very Low', 'Low', 'Slightly Low', 'Neutral', 'Okay', 'Good', 'Great', 'Excellent', 'Amazing', 'Perfect'];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, notes }),
      });
      if (res.ok) {
        toast('Mood logged successfully!', 'success');
        setDone(true);
        onLogged?.();
      } else {
        const data = await res.json();
        toast(data.error || 'Failed to log mood', 'error');
      }
    } catch {
      toast('Failed to log mood', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-3">{emojis[score - 1]}</div>
        <p className="text-teal font-semibold">Mood logged! Keep it up 🌱</p>
        <p className="text-sm text-gray mt-1">Come back tomorrow to track your progress.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-6xl mb-2 transition-all duration-200">{emojis[score - 1]}</div>
        <p className="text-lg font-semibold text-navy">{labels[score - 1]}</p>
        <p className="text-sm text-gray">Score: {score}/10</p>
      </div>

      <input
        type="range"
        min={1}
        max={10}
        value={score}
        onChange={e => setScore(Number(e.target.value))}
        className="w-full accent-[var(--teal)] h-2 cursor-pointer"
      />

      <div className="flex justify-between text-xs text-gray">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map(n => (
          <span key={n}>{n}</span>
        ))}
      </div>

      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Optional note about how you're feeling..."
        className="w-full h-24 px-3 py-2 text-sm border border-gray-light rounded-md focus:outline-none focus:ring-2 focus:ring-teal resize-none"
      />

      <Button onClick={handleSubmit} isLoading={isSubmitting} className="w-full">
        Log Today&apos;s Mood
      </Button>
    </div>
  );
}
