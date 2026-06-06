"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { Phone, Lock, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  phone: z.string().min(9, 'Enter a valid phone number'),
  pin: z.string().length(6, 'PIN must be exactly 6 digits'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToast();
  const [showPin, setShowPin] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast(result.error || 'Login failed', 'error');
        return;
      }

      const { role } = result.user;
      const redirectMap: Record<string, string> = {
        doctor: `/${locale}/doctor`,
        agent: `/${locale}/agent`,
        client: `/${locale}/dashboard`,
      };

      toast('Welcome back!', 'success');
      router.push(redirectMap[role] || `/${locale}/dashboard`);
    } catch {
      toast('Network error. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--navy)] to-[var(--dark)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-radius-lg shadow-lg p-8"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-teal flex items-center justify-center">
              <span className="text-white font-bold text-lg font-display">S</span>
            </div>
            <span className="font-display font-bold text-2xl text-navy">Selam</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-navy font-display text-center mb-2">Welcome back</h1>
        <p className="text-gray text-sm text-center mb-8">Enter your phone and PIN to continue</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Phone with +251 prefix */}
          <div>
            <label className="text-sm font-medium text-navy block mb-1.5">Phone Number</label>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-3 border border-gray-light rounded-radius-md bg-gray-light shrink-0">
                <Phone className="h-4 w-4 text-gray" />
                <span className="text-sm text-gray font-medium">+251</span>
              </div>
              <input
                {...register('phone')}
                type="tel"
                placeholder="912345678"
                className="flex-1 h-11 px-3 rounded-radius-md border border-gray-light text-sm focus:outline-none focus:ring-2 focus:ring-teal"
              />
            </div>
            {errors.phone && <p className="text-xs text-danger mt-1">{errors.phone.message}</p>}
          </div>

          {/* PIN with dot display */}
          <div>
            <label className="text-sm font-medium text-navy block mb-1.5">6-Digit PIN</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray" />
              <input
                {...register('pin')}
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                maxLength={6}
                placeholder="••••••"
                className="w-full h-11 pl-10 pr-12 rounded-radius-md border border-gray-light text-sm focus:outline-none focus:ring-2 focus:ring-teal tracking-[0.5em]"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray"
              >
                {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.pin && <p className="text-xs text-danger mt-1">{errors.pin.message}</p>}
          </div>

          <Button type="submit" isLoading={isSubmitting} className="w-full teal-glow" size="lg">
            Log In
          </Button>
        </form>

        <p className="text-center text-sm text-gray mt-6">
          Don&apos;t have an account?{' '}
          <Link href={`/${locale}/auth/signup`} className="text-teal font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
