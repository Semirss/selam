"use client";

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowRight, Brain, QrCode, Shield, Globe, ChevronRight, ArrowDown } from 'lucide-react';
import { NFCDemo } from '@/components/ui/NFCDemo';
import { VideoIntroModal } from '@/components/ui/VideoIntroModal';

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
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1920&auto=format&fit=crop', // Connection / friendship
  'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=1920&auto=format&fit=crop', // Professional medical care
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1920&auto=format&fit=crop', // Wellness / peace
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1920&auto=format&fit=crop', // Compassion / holding hands
  'https://images.unsplash.com/photo-1527613426406-031eaf0d885a?q=80&w=1920&auto=format&fit=crop', // Nature / hope
];

export default function LandingPage() {
  const locale = useLocale();
  const t = useTranslations('landing');
  const [heroIndex, setHeroIndex] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const imgTimer = setInterval(() => setHeroIndex(i => (i + 1) % HERO_IMAGES.length), 4000);
    return () => clearInterval(imgTimer);
  }, []);

  const stat1 = useCounter(1);
  const stat2 = useCounter(4);
  const stat3 = useCounter(80);

  const PRICING_PLANS = [
    {
      name: t('pricingFree'),
      price: '0',
      period: t('pricingMonth'),
      description: t('pricingFreeDesc'),
      features: [t('planFreeFeature1'), t('planFreeFeature2'), t('planFreeFeature3'), t('planFreeFeature4')],
      cta: t('ctaStart'),
      highlight: false,
    },
    {
      name: t('pricingPremium'),
      price: '99',
      period: t('pricingEtbMonth'),
      description: t('pricingPremiumDesc'),
      features: [t('planPremiumFeature1'), t('planPremiumFeature2'), t('planPremiumFeature3'), t('planPremiumFeature4'), t('planPremiumFeature5')],
      cta: t('ctaStartPremium'),
      highlight: true,
    },
    {
      name: t('pricingDoctor'),
      price: '299',
      period: t('pricingEtbMonth'),
      description: t('pricingDoctorDesc'),
      features: [t('planDoctorFeature1'), t('planDoctorFeature2'), t('planDoctorFeature3'), t('planDoctorFeature4'), t('planDoctorFeature5')],
      cta: t('ctaJoinDoctor'),
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <VideoIntroModal />
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
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
                  key={locale}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                  className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight"
                >
                  {t('heroHeadline')}
                </motion.h1>
              </AnimatePresence>
            </div>

            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              {t('heroTagline')}
            </p>

            <div className="flex flex-wrap gap-4 relative">
              <Link href={`/${locale}/auth/signup`}>
                <Button size="lg" className="teal-glow gap-2">
                  {t('ctaStart')} <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <a href="/app-release.apk" download>
                <Button size="lg" variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-white/20 backdrop-blur hover-lift gap-2 group">
                  {t('ctaDownload')}
                  <ArrowDown className="h-5 w-5 animate-bounce text-teal" />
                </Button>
              </a>
              <Button 
                size="lg" 
                variant="ghost" 
                className="text-white hover:bg-white/10 border border-white/20 gap-2"
                onClick={() => {
                  const dialog = document.getElementById('demo-video-modal') as HTMLDialogElement;
                  dialog?.showModal();
                }}
              >
                {t('ctaDemo')}
              </Button>

              {/* Video Modal using native HTML dialog for simplicity and accessibility */}
              <dialog 
                id="demo-video-modal" 
                className="bg-black/90 backdrop-blur-sm p-0 m-auto w-[90vw] max-w-5xl rounded-2xl overflow-hidden shadow-2xl backdrop:bg-black/80 backdrop:backdrop-blur-sm"
                onClick={(e) => {
                  const dialog = e.currentTarget;
                  if (e.target === dialog) dialog.close();
                }}
              >
                <div className="relative w-full aspect-video">
                  <button 
                    onClick={() => {
                      const dialog = document.getElementById('demo-video-modal') as HTMLDialogElement;
                      dialog?.close();
                    }}
                    className="absolute top-4 right-4 z-10 bg-black/50 text-white h-10 w-10 rounded-full flex items-center justify-center hover:bg-black/70 transition"
                  >
                    ✕
                  </button>
                  <video 
                    src="/demo-video.mp4" 
                    controls 
                    autoPlay 
                    className="w-full h-full object-contain bg-black"
                  />
                </div>
              </dialog>
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
        </div>
      </section>

      {/* Stats section */}
      <section className="bg-dark py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-center font-display text-3xl text-white font-bold mb-12">{t('statsTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div ref={stat1.ref}>
              <p className="text-6xl font-bold text-teal font-display mb-2">{stat1.count}</p>
              <p className="text-white/70">{t('stat1Desc')}</p>
            </div>
            <div ref={stat2.ref}>
              <p className="text-6xl font-bold text-teal font-display mb-2">{stat2.count}+</p>
              <p className="text-white/70">{t('stat2Desc')}</p>
            </div>
            <div ref={stat3.ref}>
              <p className="text-6xl font-bold text-teal font-display mb-2">{stat3.count}%</p>
              <p className="text-white/70">{t('stat3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature: Mental Wellness */}
      <section className="py-20 bg-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <span className="text-teal font-semibold text-sm tracking-wide uppercase">{t('pillar1Tag')}</span>
              <h2 className="font-display text-4xl font-bold text-navy mt-2 mb-4 leading-tight">
                {t('pillar1Title')}
              </h2>
              <p className="text-gray leading-relaxed mb-6">
                {t('pillar1Desc')}
              </p>
              <ul className="space-y-3">
                {[t('pillar1Bullet1'), t('pillar1Bullet2'), t('pillar1Bullet3'), t('pillar1Bullet4')].map(f => (
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
                    <p className="text-[10px] text-teal">● {t('chatOnline')}</p>
                  </div>
                </div>
                {[
                  { r: 'assistant', msg: t('chatMsg1') },
                  { r: 'user', msg: t('chatMsg2') },
                  { r: 'assistant', msg: t('chatMsg3') },
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

      {/* Feature: Health Network (NFC) */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-teal font-semibold text-sm tracking-wide uppercase">{t('pillar2Tag')}</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-navy mt-2 mb-4 leading-tight">
              {t('pillar2Title')}
            </h2>
            <p className="text-gray text-lg leading-relaxed mb-6">
              {t('pillar2Desc')}
            </p>
          </div>
          
          {/* Interactive NFC Demo */}
          <div className="w-full flex justify-center">
            <NFCDemo />
          </div>
        </div>
      </section>

      {/* ── Video Showcase ── */}
      <section
        id="video-showcase"
        className="relative py-28 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0d0d1a 0%, #0a1628 55%, #0d1a2e 100%)' }}
      >
        {/* Background mesh */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(26,158,122,0.07) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(44,74,110,0.1) 0%, transparent 50%)',
        }} />
        {/* Subtle grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            {/* Badge */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                className="h-2 w-2 rounded-full"
                style={{ background: '#1A9E7A', boxShadow: '0 0 8px #1A9E7A' }}
              />
              <span
                className="px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
                style={{
                  background: 'rgba(26,158,122,0.1)',
                  border: '1px solid rgba(26,158,122,0.28)',
                  color: '#1A9E7A',
                }}
              >
                {t('videoBadge')}
              </span>
            </div>

            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
              {t('videoTitlePrefix')}{' '}
              <span style={{
                background: 'linear-gradient(90deg, #1A9E7A, #4ECDC4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>{t('videoTitleHighlight')}</span>
            </h2>
            <p className="text-white/45 text-lg leading-relaxed">
              {t('videoDesc')}
            </p>
          </motion.div>

          {/* Video player card */}
          <motion.div
            initial={{ opacity: 0, y: 44, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, delay: 0.12 }}
            className="relative max-w-5xl mx-auto"
          >
            {/* Layered ambient glows */}
            <div className="absolute -inset-8 rounded-[2rem] pointer-events-none" style={{
              background: 'radial-gradient(ellipse at 50% 50%, rgba(26,158,122,0.22) 0%, transparent 65%)',
              filter: 'blur(32px)',
            }} />
            <div className="absolute -inset-4 rounded-[2rem] pointer-events-none" style={{
              background: 'radial-gradient(ellipse at 50% 100%, rgba(44,74,110,0.25) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }} />

            {/* Outer ring */}
            <div className="absolute -inset-[1px] rounded-2xl pointer-events-none" style={{
              background: 'linear-gradient(135deg, rgba(26,158,122,0.4) 0%, rgba(255,255,255,0.04) 50%, rgba(26,158,122,0.15) 100%)',
            }} />

            {/* Card */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                boxShadow: '0 0 0 1px rgba(26,158,122,0.2), 0 0 80px rgba(26,158,122,0.18), 0 40px 80px rgba(0,0,0,0.7)',
              }}
            >
              <video
                src="/showcase-video.mp4"
                controls
                playsInline
                className="w-full block"
                style={{ aspectRatio: '16/9', background: '#000' }}
              />
            </div>


          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-teal-light" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-navy mb-3">{t('pricingTitle')}</h2>
            <p className="text-gray">{t('pricingDesc')}</p>
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
                    <div className="bg-teal text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">{t('pricingPopular')}</div>
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
