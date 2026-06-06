"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { Stethoscope, User, Briefcase, Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const step1Schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(9, 'Enter a valid phone number'),
  role: z.enum(['client', 'doctor', 'agent']),
});

const step2Schema = z.object({
  language: z.string().min(1, 'Language is required'),
  blood_type: z.string().optional(),
});

const step3Schema = z.object({
  pin: z.string().length(6, 'PIN must be 6 digits'),
  confirmPin: z.string().length(6),
}).refine(d => d.pin === d.confirmPin, { message: 'PINs do not match', path: ['confirmPin'] });

type Step1 = z.infer<typeof step1Schema>;
type Step2 = z.infer<typeof step2Schema>;
type Step3 = z.infer<typeof step3Schema>;

const ROLES = [
  { value: 'client', label: 'Patient / Client', desc: 'Personal wellness & health ID', icon: User },
  { value: 'doctor', label: 'Doctor / Clinic', desc: 'Scan patients & manage care', icon: Stethoscope },
  { value: 'agent', label: 'NGO / Agent', desc: 'Publish awareness campaigns', icon: Briefcase },
] as const;

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'am', label: 'አማርኛ (Amharic)' },
  { code: 'ti', label: 'ትግርኛ (Tigrinya)' },
  { code: 'om', label: 'Afaan Oromoo' },
];

export default function SignupPage() {
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1 | null>(null);
  const [step2Data, setStep2Data] = useState<Step2 | null>(null);
  const [selectedRole, setSelectedRole] = useState<'client' | 'doctor' | 'agent'>('client');

  const form1 = useForm<Step1>({ resolver: zodResolver(step1Schema), defaultValues: { role: 'client' } });
  const form2 = useForm<Step2>({ resolver: zodResolver(step2Schema), defaultValues: { language: 'en' } });
  const form3 = useForm<Step3>({ resolver: zodResolver(step3Schema) });

  const onStep1 = (data: Step1) => { setStep1Data(data); setStep(2); };
  const onStep2 = (data: Step2) => { setStep2Data({ language: data.language || 'en', blood_type: data.blood_type }); setStep(3); };
  const onStep3 = async (data: Step3) => {
    if (!step1Data || !step2Data) return;
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...step1Data, ...step2Data, pin: data.pin }),
      });
      const result = await res.json();
      if (!res.ok) { toast(result.error || 'Signup failed', 'error'); return; }

      toast('Account created!', 'success');
      const { role } = result.user;
      const redirectMap: Record<string, string> = {
        doctor: `/${locale}/doctor`, agent: `/${locale}/agent`, client: `/${locale}/dashboard`,
      };
      router.push(redirectMap[role] || `/${locale}/dashboard`);
    } catch {
      toast('Network error. Please try again.', 'error');
    }
  };

  const steps = [
    { n: 1, label: 'Your Info' },
    { n: 2, label: 'Preferences' },
    { n: 3, label: 'Set PIN' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--navy)] to-[var(--dark)] flex items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-radius-lg shadow-lg p-8"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-teal flex items-center justify-center">
              <span className="text-white font-bold font-display">S</span>
            </div>
            <span className="font-display font-bold text-xl text-navy">Selam</span>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center gap-2">
              <div className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                step === s.n ? 'bg-teal text-white' :
                step > s.n ? 'bg-teal-light text-teal' :
                'bg-gray-light text-gray'
              )}>
                {step > s.n ? <Check className="h-4 w-4" /> : s.n}
              </div>
              <span className={`text-xs hidden sm:block ${step >= s.n ? 'text-navy' : 'text-gray'}`}>{s.label}</span>
              {i < steps.length - 1 && <ChevronRight className="h-4 w-4 text-gray-light mx-1" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="font-display text-2xl font-bold text-navy mb-1">Create your account</h2>
              <p className="text-sm text-gray mb-6">Tell us who you are</p>
              <form onSubmit={form1.handleSubmit(onStep1)} className="space-y-5">
                <Input label="Full Name" error={form1.formState.errors.full_name?.message} {...form1.register('full_name')} placeholder="Abebe Bekele" />
                <div>
                  <label className="text-sm font-medium text-navy block mb-1.5">Phone Number</label>
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 border border-gray-light rounded-radius-md bg-gray-light text-sm text-gray whitespace-nowrap">+251</span>
                    <input
                      {...form1.register('phone')}
                      type="tel"
                      placeholder="912345678"
                      className="flex-1 h-11 px-3 rounded-radius-md border border-gray-light text-sm focus:outline-none focus:ring-2 focus:ring-teal"
                    />
                  </div>
                  {form1.formState.errors.phone && <p className="text-xs text-danger mt-1">{form1.formState.errors.phone.message}</p>}
                </div>

                {/* Role selection */}
                <div>
                  <label className="text-sm font-medium text-navy block mb-3">I am a</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {ROLES.map(r => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => { setSelectedRole(r.value); form1.setValue('role', r.value); }}
                        className={cn(
                          'p-3 rounded-radius-md border-2 text-left transition-all',
                          selectedRole === r.value ? 'border-teal bg-teal-light' : 'border-gray-light hover:border-teal-mid'
                        )}
                      >
                        <r.icon className={`h-5 w-5 mb-1.5 ${selectedRole === r.value ? 'text-teal' : 'text-gray'}`} />
                        <p className={`font-semibold text-xs ${selectedRole === r.value ? 'text-teal' : 'text-navy'}`}>{r.label}</p>
                        <p className="text-[10px] text-gray mt-0.5">{r.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">Continue</Button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="font-display text-2xl font-bold text-navy mb-1">Preferences</h2>
              <p className="text-sm text-gray mb-6">Personalise your experience</p>
              <form onSubmit={form2.handleSubmit(onStep2)} className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-navy block mb-1.5">Preferred Language</label>
                  <select {...form2.register('language')} className="w-full h-11 px-3 rounded-radius-md border border-gray-light text-sm focus:outline-none focus:ring-2 focus:ring-teal">
                    {LANGS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                  </select>
                </div>
                {(selectedRole === 'client' || selectedRole === 'doctor') && (
                  <div>
                    <label className="text-sm font-medium text-navy block mb-1.5">Blood Type</label>
                    <select {...form2.register('blood_type')} className="w-full h-11 px-3 rounded-radius-md border border-gray-light text-sm focus:outline-none focus:ring-2 focus:ring-teal">
                      <option value="">Unknown / Prefer not to say</option>
                      {BLOOD_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
                    </select>
                  </div>
                )}
                <div className="flex gap-3">
                  <Button type="button" variant="ghost" onClick={() => setStep(1)} className="flex-1">Back</Button>
                  <Button type="submit" className="flex-1">Continue</Button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="font-display text-2xl font-bold text-navy mb-1">Set your PIN</h2>
              <p className="text-sm text-gray mb-6">Choose a 6-digit PIN to secure your account</p>
              <form onSubmit={form3.handleSubmit(onStep3)} className="space-y-5">
                <Input
                  label="6-Digit PIN"
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="••••••"
                  className="tracking-[0.5em]"
                  error={form3.formState.errors.pin?.message}
                  {...form3.register('pin')}
                />
                <Input
                  label="Confirm PIN"
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="••••••"
                  className="tracking-[0.5em]"
                  error={form3.formState.errors.confirmPin?.message}
                  {...form3.register('confirmPin')}
                />
                <div className="flex gap-3">
                  <Button type="button" variant="ghost" onClick={() => setStep(2)} className="flex-1">Back</Button>
                  <Button type="submit" isLoading={form3.formState.isSubmitting} className="flex-1 teal-glow">
                    Create Account
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-sm text-gray mt-6">
          Already have an account?{' '}
          <Link href={`/${locale}/auth/login`} className="text-teal font-medium hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}
