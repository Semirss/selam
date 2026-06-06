"use client";

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Check } from 'lucide-react';

const PLANS = [
  {
    name: 'Free',
    price: '0',
    period: '',
    description: 'Start your wellness journey at no cost',
    highlight: false,
    features: [
      'AI Wellness Chat (5 per day)',
      'Personal Health ID & QR Code',
      'Up to 3 Emergency Contacts',
      'Public Awareness Feed',
      'Hospital Finder Map',
    ],
    notIncluded: ['Mood Trend Analytics', 'Unlimited Chat', 'Doctor Scan Access'],
  },
  {
    name: 'Premium',
    price: '99',
    period: 'ETB/month',
    description: 'Full wellness support, unlimited and personalised',
    highlight: true,
    features: [
      'Unlimited AI Wellness Chat',
      'Full Mood Tracking & Heatmap',
      'Progress Analytics Dashboard',
      'Unlimited Emergency Contacts',
      'Priority Hospital Map',
      'Language Preference Saved',
      'All Free Features',
    ],
    notIncluded: ['Doctor Scan Tools'],
  },
  {
    name: 'Doctor',
    price: '299',
    period: 'ETB/month',
    description: 'Clinical tools for healthcare professionals',
    highlight: false,
    features: [
      'QR Patient ID Scanner',
      'Full Patient Record Access',
      'AI Diagnostic Support',
      'Diagnosis History Management',
      'Blood Type Compatibility Alerts',
      'All Premium Features',
      'Priority Technical Support',
    ],
    notIncluded: [],
  },
];

export default function PricingPage() {
  const locale = useLocale();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="pt-28 pb-16 bg-navy text-white text-center">
        <h1 className="font-display text-5xl font-bold mb-3">Simple, Fair Pricing</h1>
        <p className="text-white/70 text-lg">Priced for Ethiopian and East African communities.</p>
      </section>

      <section className="py-16 bg-off-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {PLANS.map(plan => (
              <Card
                key={plan.name}
                className={`p-7 flex flex-col ${plan.highlight ? 'border-2 border-teal shadow-lg relative' : ''}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-teal text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    Most Popular
                  </div>
                )}
                <h2 className="font-display text-2xl font-bold text-navy mb-1">{plan.name}</h2>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold text-teal">{plan.price}</span>
                  {plan.period && <span className="text-gray text-sm">{plan.period}</span>}
                </div>
                <p className="text-sm text-gray mb-6">{plan.description}</p>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-dark">
                      <Check className="h-4 w-4 text-teal mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                  {plan.notIncluded.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray line-through opacity-50">
                      <Check className="h-4 w-4 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href={`/${locale}/auth/signup`}>
                  <Button
                    variant={plan.highlight ? 'primary' : 'secondary'}
                    className={`w-full ${plan.highlight ? 'teal-glow' : ''}`}
                  >
                    Get Started
                  </Button>
                </Link>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-gray mt-10">
            All payments processed via Telebirr. No credit card required for Free plan.
            Premium plans include a 7-day free trial.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
