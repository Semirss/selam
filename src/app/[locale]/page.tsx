"use client";

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowRight, Brain, QrCode, Shield, Globe, ChevronRight } from 'lucide-react';

// Animated counter hook
function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return { count, ref };
}

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1920&q=80', // yoga/wellness outdoors
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1920&q=80', // fitness/health
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&q=80', // medical/wellness
];

const HERO_HEADLINES = [
  'Wellbeing starts with connection',
  'ደህንነት የሚጀምረው በግንኙነት ነው',
  'ድሕነት ብርክክብ ይጅምር',
  'Nageenyi walitti dhufeenyaan jalqaba',
];

const PRICING_PLANS = [
  {
    name: 'Free',
    price: '0',
    period: '/month',
    description: 'Get started with essential wellness tools',
    features: ['AI Wellness Chat (5/day)', 'Health ID & QR Code', 'Emergency Contacts (3)', 'Awareness Feed'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Premium',
    price: '99',
    period: 'ETB/month',
    description: 'Full wellness journey with unlimited access',
    features: ['Unlimited AI Chat', 'Mood Tracking & Analytics', 'Unlimited Emergency Contacts', 'Priority Support', 'Hospital Map'],
    cta: 'Start Premium',
    highlight: true,
  },
  {
    name: 'Doctor',
    price: '299',
    period: 'ETB/month',
    description: 'Clinical tools for healthcare providers',
    features: ['QR Patient Scanner', 'Patient Records Access', 'AI Diagnostic Support', 'Diagnosis Management', 'All Premium Features'],
    cta: 'Join as Doctor',
    highlight: false,
  },
];

export default function LandingPage() {
  const locale = useLocale();
  const [heroIndex, setHeroIndex] = useState(0);
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const imgTimer = setInterval(() => setHeroIndex(i => (i + 1) % HERO_IMAGES.length), 4000);
    const txtTimer = setInterval(() => setHeadlineIndex(i => (i + 1) % HERO_HEADLINES.length), 3000);
    return () => { clearInterval(imgTimer); clearInterval(txtTimer); };
  }, []);

  const stat1 = useCounter(1);
  const stat2 = useCounter(4);
  const stat3 = useCounter(80);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-black grain-bg">
        {/* Rotating background images */}
        <AnimatePresence mode="wait">
          <motion.div
            key={heroIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.85, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_IMAGES[heroIndex]})` }}
          />
        </AnimatePresence>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30 z-[1]" />

        <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 w-full py-32 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 max-w-xl">
            {/* Headline crossfade */}
            <div className="min-h-[140px] flex items-center mb-6">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={headlineIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                  className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight"
                >
                  {HERO_HEADLINES[headlineIndex]}
                </motion.h1>
              </AnimatePresence>
            </div>

            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              Mental wellness and health network — in your language, at your side. Built for Ethiopia and East Africa.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href={`/${locale}/auth/signup`}>
                <Button size="lg" className="teal-glow gap-2">
                  Get Started Free <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <a href="/app-release.apk" download>
                <Button size="lg" variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-white/20 backdrop-blur gap-2">
                  Download App
                </Button>
              </a>
              <Link href={`/${locale}/about`}>
                <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 border border-white/20">
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Dot indicators for hero images */}
            <div className="flex gap-2 mt-10">
              {HERO_IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHeroIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === heroIndex ? 'w-6 bg-teal' : 'w-1.5 bg-white/30'}`}
                />
              ))}
            </div>
          </div>

          {/* Right: feature cards stack */}
          <div className="hidden md:flex flex-col gap-4 flex-1 max-w-xs">
            {[
              { icon: Brain, title: 'AI Wellness', desc: 'Private, multilingual support 24/7' },
              { icon: QrCode, title: 'Health ID', desc: 'Your medical record in a QR scan' },
              { icon: Shield, title: 'Emergency Ready', desc: 'Blood type, contacts, history — instant' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
              >
                <Card className="p-4 bg-white/10 backdrop-blur border-white/10 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-teal/20 flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-teal" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{item.title}</p>
                    <p className="text-white/60 text-xs">{item.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section className="bg-dark py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-center font-display text-3xl text-white font-bold mb-12">The Problem We Solve</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div ref={stat1.ref}>
              <p className="text-6xl font-bold text-teal font-display mb-2">{stat1.count}</p>
              <p className="text-white/70">psychiatrist per 1,000,000 people in Ethiopia</p>
            </div>
            <div ref={stat2.ref}>
              <p className="text-6xl font-bold text-teal font-display mb-2">{stat2.count}+</p>
              <p className="text-white/70">average ER wait time in hours</p>
            </div>
            <div ref={stat3.ref}>
              <p className="text-6xl font-bold text-teal font-display mb-2">{stat3.count}%</p>
              <p className="text-white/70">of patients arrive with no medical record</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature: Mental Wellness */}
      <section className="py-20 bg-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <span className="text-teal font-semibold text-sm tracking-wide uppercase">Pillar 1</span>
              <h2 className="font-display text-4xl font-bold text-navy mt-2 mb-4 leading-tight">
                Mental Wellness, <br />in your language
              </h2>
              <p className="text-gray leading-relaxed mb-6">
                Talk to Selam AI in Amharic, Tigrinya, Afaan Oromoo, or English. Private, judgment-free, and always available.
                When you need more, connect with a licensed professional.
              </p>
              <ul className="space-y-3">
                {['Gemini-powered AI companion', 'Anonymous mode available', 'Mood tracking & trend insights', 'Crisis line integration'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-dark">
                    <span className="h-5 w-5 rounded-full bg-teal-light flex items-center justify-center shrink-0">
                      <ChevronRight className="h-3 w-3 text-teal" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 flex justify-center">
              {/* AI Chat mockup */}
              <div className="w-full max-w-xs bg-white rounded-radius-lg shadow-lg p-4 border border-gray-light">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-light">
                  <div className="h-8 w-8 rounded-full bg-navy flex items-center justify-center">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy text-sm">Selam AI</p>
                    <p className="text-[10px] text-teal">● Online</p>
                  </div>
                </div>
                {[
                  { r: 'assistant', msg: 'ሰላም! ዛሬ ምን ይሰማዎታል?' },
                  { r: 'user', msg: 'I feel a bit overwhelmed lately' },
                  { r: 'assistant', msg: "I hear you. Let's work through this together..." },
                ].map((m, i) => (
                  <div key={i} className={`flex mb-3 ${m.r === 'user' ? 'justify-end' : ''}`}>
                    <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs ${m.r === 'user' ? 'bg-teal text-white rounded-tr-none' : 'bg-gray-light text-dark rounded-tl-none'}`}>
                      {m.msg}
                    </div>
                  </div>
                ))}
                <div className="flex gap-2 mt-3">
                  <div className="flex-1 h-8 bg-gray-light rounded-full" />
                  <div className="h-8 w-8 rounded-full bg-teal flex items-center justify-center">
                    <ArrowRight className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature: Health Network */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row-reverse items-center gap-16">
            <div className="flex-1">
              <span className="text-teal font-semibold text-sm tracking-wide uppercase">Pillar 2</span>
              <h2 className="font-display text-4xl font-bold text-navy mt-2 mb-4 leading-tight">
                Your health record, <br />always with you
              </h2>
              <p className="text-gray leading-relaxed mb-6">
                One QR code carries your blood type, conditions, medications, and emergency contacts.
                Doctors can scan it instantly — no paperwork, no delays.
              </p>
              <ul className="space-y-3">
                {['Unique QR Health ID', 'Emergency contact blood matching', 'Doctor scan history', 'Hospital finder map'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-dark">
                    <span className="h-5 w-5 rounded-full bg-teal-light flex items-center justify-center shrink-0">
                      <ChevronRight className="h-3 w-3 text-teal" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-xs">
                {/* QR workflow visual */}
                <div className="flex flex-col items-center gap-4">
                  {[
                    { icon: QrCode, label: 'Patient shows QR', color: 'bg-teal-light', text: 'text-teal' },
                    { icon: Shield, label: 'Doctor scans ID', color: 'bg-navy/10', text: 'text-navy' },
                    { icon: Brain, label: 'AI assists diagnosis', color: 'bg-purple-50', text: 'text-purple-600' },
                  ].map((step, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className={`h-16 w-16 rounded-2xl ${step.color} flex items-center justify-center shadow-sm`}>
                        <step.icon className={`h-8 w-8 ${step.text}`} />
                      </div>
                      <p className="text-sm font-medium text-navy mt-2">{step.label}</p>
                      {i < 2 && <div className="h-6 w-px bg-gray-light my-1" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-teal-light" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-navy mb-3">Simple, Transparent Pricing</h2>
            <p className="text-gray">Priced for Ethiopian and East African communities</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`p-6 h-full flex flex-col ${plan.highlight ? 'border-2 border-teal shadow-lg' : ''}`}>
                  {plan.highlight && (
                    <div className="bg-teal text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">Most Popular</div>
                  )}
                  <h3 className="font-display text-2xl font-bold text-navy mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-teal">{plan.price}</span>
                    <span className="text-gray text-sm">{plan.period}</span>
                  </div>
                  <p className="text-sm text-gray mb-6">{plan.description}</p>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-dark">
                        <span className="text-teal">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/${locale}/auth/signup`}>
                    <Button
                      variant={plan.highlight ? 'primary' : 'secondary'}
                      className={`w-full ${plan.highlight ? 'teal-glow' : ''}`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
