"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FastForward, Play, Volume2, VolumeX } from 'lucide-react';

export function VideoIntroModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Show only once per session
    const hasSeenIntro = sessionStorage.getItem('selam-intro-seen');
    if (!hasSeenIntro) {
      // Small delay so the page renders first
      const t = setTimeout(() => setIsVisible(true), 400);
      return () => clearTimeout(t);
    }
  }, []);

  const handleClose = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    sessionStorage.setItem('selam-intro-seen', 'true');
    setIsVisible(false);
  };

  const handleSkip = () => handleClose();

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const duration = videoRef.current.duration || 10;
    const current = videoRef.current.currentTime;
    setProgress((current / duration) * 100);
    setTimeLeft(Math.max(0, Math.ceil(duration - current)));
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        >
          {/* Animated backdrop */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, rgba(26,158,122,0.08) 0%, rgba(0,0,0,0.97) 70%)',
            }}
          />

          {/* Floating orbs */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(26,158,122,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(44,74,110,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 32 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 32 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28, delay: 0.15 }}
            className="relative w-full max-w-4xl rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(28,28,46,0.98) 0%, rgba(20,35,60,0.98) 100%)',
              border: '1px solid rgba(26,158,122,0.25)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 0 80px rgba(26,158,122,0.18), 0 40px 80px rgba(0,0,0,0.7)',
            }}
          >
            {/* Inner glow edge */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)' }} />

            {/* ── Header ── */}
            <div className="relative flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {/* Brand */}
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="h-2 w-2 rounded-full"
                  style={{ background: '#1A9E7A', boxShadow: '0 0 8px #1A9E7A' }}
                />
                <span className="text-white/60 text-sm font-medium tracking-widest uppercase">
                  Selam Health
                </span>
                <span className="hidden sm:inline text-white/25 text-sm">·</span>
                <span className="hidden sm:inline text-white/35 text-xs tracking-wide">Platform Overview</span>
              </div>

              {/* Skip button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSkip}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                style={{
                  background: 'rgba(26,158,122,0.12)',
                  border: '1px solid rgba(26,158,122,0.3)',
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                <FastForward className="h-3.5 w-3.5" style={{ color: '#1A9E7A' }} />
                Skip
                {timeLeft > 0 && (
                  <span className="text-xs font-bold tabular-nums" style={{ color: '#1A9E7A' }}>
                    {timeLeft}s
                  </span>
                )}
              </motion.button>
            </div>

            {/* ── Video ── */}
            <div className="relative bg-black" style={{ aspectRatio: '16/9' }}>
              <video
                ref={videoRef}
                src="/intro-video.mp4"
                autoPlay
                playsInline
                muted={isMuted}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleClose}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Vignette overlay */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.35) 100%)' }} />

              {/* Mute button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMute}
                className="absolute bottom-4 right-4 h-9 w-9 rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                  background: 'rgba(0,0,0,0.55)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(8px)',
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                {isMuted
                  ? <VolumeX className="h-4 w-4" />
                  : <Volume2 className="h-4 w-4" />}
              </motion.button>
            </div>

            {/* ── Progress & Footer ── */}
            <div className="px-6 pt-4 pb-5">
              {/* Progress bar */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-[3px] rounded-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, #1A9E7A, #4ECDC4)',
                      boxShadow: '0 0 8px rgba(26,158,122,0.6)',
                      transition: 'width 0.15s linear',
                    }}
                  />
                </div>
                <span className="text-white/35 text-xs tabular-nums w-6 text-right">{timeLeft}s</span>
              </div>

              {/* Footer text */}
              <p className="text-center text-white/25 text-xs tracking-wide">
                Continues automatically &nbsp;·&nbsp;{' '}
                <button
                  onClick={handleSkip}
                  className="transition-colors duration-150 hover:underline"
                  style={{ color: 'rgba(26,158,122,0.7)' }}
                >
                  skip intro
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
