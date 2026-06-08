"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, X } from 'lucide-react';

// ── Module-level flag ─────────────────────────────────────────────────────────
// Resets on every hard refresh / full page load.
// Stays true during SPA (client-side) navigation → modal won't re-appear.
let _introShownThisSession = false;

export function VideoIntroModal() {
  const [isVisible, setIsVisible]   = useState(false);
  const [progress, setProgress]     = useState(0);
  const [timeLeft, setTimeLeft]      = useState(0);
  const [isMuted, setIsMuted]        = useState(true);   // MUST start muted for autoplay
  const [showUnmuteHint, setShowUnmuteHint] = useState(true);
  const [hasStarted, setHasStarted]  = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // ── Show modal once per page load ──────────────────────────────────────────
  useEffect(() => {
    if (_introShownThisSession) return;
    _introShownThisSession = true;

    const t = setTimeout(() => setIsVisible(true), 350);
    return () => clearTimeout(t);
  }, []);

  // ── Hide "tap to unmute" hint after 3 s ────────────────────────────────────
  useEffect(() => {
    if (!isVisible) return;
    const t = setTimeout(() => setShowUnmuteHint(false), 3000);
    return () => clearTimeout(t);
  }, [isVisible]);

  // ── Autoplay when modal becomes visible ───────────────────────────────────
  useEffect(() => {
    if (!isVisible || !videoRef.current) return;
    const vid = videoRef.current;
    vid.muted = true; // ensure muted before calling play()
    vid.play().catch(() => {
      // autoplay blocked – show play button (handled via hasStarted state)
    });
  }, [isVisible]);

  const handleClose = () => setIsVisible(false);

  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid) return;
    const dur = vid.duration || 1;
    const cur = vid.currentTime;
    setProgress((cur / dur) * 100);
    setTimeLeft(Math.max(0, Math.ceil(dur - cur)));
  };

  const toggleMute = () => {
    const vid = videoRef.current;
    if (!vid) return;
    const next = !isMuted;
    vid.muted = next;
    setIsMuted(next);
    setShowUnmuteHint(false);
  };

  const handlePlay = () => {
    setHasStarted(true);
    setShowUnmuteHint(true);
    const t = setTimeout(() => setShowUnmuteHint(false), 3000);
    return () => clearTimeout(t);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="intro-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ padding: 'clamp(12px, 4vw, 40px)' }}
        >
          {/* ── Backdrop ──────────────────────────────────────────────────── */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(6px)' }}
            onClick={handleClose}
          />

          {/* ── Card ──────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 28 }}
            animate={{ scale: 1,    opacity: 1, y: 0  }}
            exit={{    scale: 0.92, opacity: 0, y: 28 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.1 }}
            className="relative w-full flex flex-col"
            style={{
              maxWidth: 860,
              borderRadius: 20,
              overflow: 'hidden',
              background: '#0a0a0a',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 40px 100px rgba(0,0,0,0.8)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* ── Top bar ─────────────────────────────────────────────────── */}
            <div
              className="flex items-center justify-between px-5 py-3.5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              {/* Brand */}
              <div className="flex items-center gap-2.5">
                <div
                  className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-black"
                  style={{ background: 'linear-gradient(135deg,#1A9E7A,#0d7a5f)', color: '#fff' }}
                >
                  S
                </div>
                <span className="text-white/80 text-sm font-semibold tracking-tight">
                  Selam Health
                </span>
                <span className="hidden sm:inline text-white/20">·</span>
                <span className="hidden sm:inline text-white/35 text-xs">Platform Overview</span>
              </div>

              {/* Right controls */}
              <div className="flex items-center gap-2">
                {/* Mute toggle */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={toggleMute}
                  title={isMuted ? 'Unmute' : 'Mute'}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: isMuted ? 'rgba(26,158,122,0.15)' : 'rgba(255,255,255,0.07)',
                    border: isMuted ? '1px solid rgba(26,158,122,0.35)' : '1px solid rgba(255,255,255,0.1)',
                    color: isMuted ? '#1A9E7A' : 'rgba(255,255,255,0.6)',
                  }}
                >
                  {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                  {isMuted ? 'Unmute' : 'Mute'}
                </motion.button>

                {/* Skip / close */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={handleClose}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.55)',
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                  Skip
                  {timeLeft > 0 && (
                    <span className="tabular-nums font-bold" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {timeLeft}s
                    </span>
                  )}
                </motion.button>
              </div>
            </div>

            {/* ── Video ───────────────────────────────────────────────────── */}
            <div className="relative bg-black" style={{ aspectRatio: '16/9' }}>
              <video
                ref={videoRef}
                src="/intro-video.mp4"
                autoPlay
                playsInline
                muted        /* always muted attr — toggled via JS ref */
                loop={false}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleClose}
                onPlay={handlePlay}
              />

              {/* Unmute hint toast */}
              <AnimatePresence>
                {showUnmuteHint && isMuted && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium pointer-events-none"
                    style={{
                      background: 'rgba(0,0,0,0.75)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      backdropFilter: 'blur(8px)',
                      color: 'rgba(255,255,255,0.8)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <VolumeX className="h-3.5 w-3.5 text-teal-400" />
                    Tap <strong className="text-white">Unmute</strong> to hear audio
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Corner mute FAB (always visible) */}
              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMute}
                className="absolute bottom-4 right-4 h-9 w-9 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  color: '#fff',
                }}
              >
                {isMuted
                  ? <VolumeX className="h-4 w-4 opacity-70" />
                  : <Volume2 className="h-4 w-4" />
                }
              </motion.button>
            </div>

            {/* ── Progress bar ────────────────────────────────────────────── */}
            <div className="px-0 pt-0">
              <div className="h-[3px] w-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  className="h-full"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #1A9E7A 0%, #4ECDC4 100%)',
                    transition: 'width 0.2s linear',
                  }}
                />
              </div>
            </div>

            {/* ── Footer ──────────────────────────────────────────────────── */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
            >
              <p className="text-white/25 text-xs">
                Continues automatically
              </p>
              <button
                onClick={handleClose}
                className="text-xs transition-colors hover:text-white/60"
                style={{ color: 'rgba(26,158,122,0.65)' }}
              >
                skip intro →
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
