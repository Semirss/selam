"use client";

import React, { useState, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Lock, Heart, Activity, Droplets, ShieldAlert, Phone as PhoneIcon, User, PlusCircle } from 'lucide-react';

export function NFCDemo() {
  const [hasScanned, setHasScanned] = useState(false);
  const patientPhoneControls = useAnimation();
  const doctorPhoneControls = useAnimation();
  const scanCircleControls = useAnimation();

  useEffect(() => {
    let isMounted = true;

    // Automated sequence
    const runSequence = async () => {
      // Wait a bit before starting
      await new Promise(r => setTimeout(r, 2000));

      while (isMounted) {
        // Reset state
        setHasScanned(false);
        if (!isMounted) break;
        patientPhoneControls.set({ x: 0, scale: 1, rotate: 0, zIndex: 20 });
        doctorPhoneControls.set({ scale: 1 });
        scanCircleControls.set({ opacity: 0, scale: 0 });

        await new Promise(r => setTimeout(r, 1000));
        if (!isMounted) break;

        // 1. Patient phone moves right and slightly up to overlap doctor phone
        await patientPhoneControls.start({
          x: 140, // Move over the doctor phone
          y: -20,
          scale: 1.05,
          rotate: 5,
          transition: { duration: 0.8, ease: "easeInOut" }
        });
        if (!isMounted) break;

        // 2. Trigger scan ripple
        scanCircleControls.start({
          scale: [1, 3],
          opacity: [0.8, 0],
          transition: { duration: 0.6, ease: "easeOut" }
        });

        // 3. Doctor phone bump
        doctorPhoneControls.start({
          scale: [1, 1.03, 1],
          transition: { duration: 0.3 }
        });

        // Show data on doctor phone
        if (!isMounted) break;
        setHasScanned(true);

        // Wait a moment so they "hold" the phones together
        await new Promise(r => setTimeout(r, 500));
        if (!isMounted) break;

        // 4. Patient phone slides back
        await patientPhoneControls.start({
          x: 0,
          y: 0,
          scale: 1,
          rotate: 0,
          transition: { duration: 0.8, ease: "easeInOut", delay: 0.2 }
        });

        // Wait a few seconds to let user read the data before restarting loop
        await new Promise(r => setTimeout(r, 6000));
      }
    };

    runSequence();

    return () => {
      isMounted = false;
      patientPhoneControls.stop();
      doctorPhoneControls.stop();
      scanCircleControls.stop();
    };
  }, [patientPhoneControls, doctorPhoneControls, scanCircleControls]);

  // Live clock for lock screen
  const [time, setTime] = useState("10:42");
  useEffect(() => {
    const d = new Date();
    const hours = d.getHours().toString().padStart(2, '0');
    const mins = d.getMinutes().toString().padStart(2, '0');
    setTime(`${hours}:${mins}`);
  }, []);

  return (
    <div className="relative w-full mx-auto flex justify-center p-4 overflow-hidden min-h-[280px] sm:min-h-[380px] md:min-h-[520px]">
      {/* Scale wrapper: shrinks both phones together on mobile */}
      <div
        className="relative flex items-center justify-center gap-6 md:gap-20"
        style={{ transform: 'scale(var(--phone-scale, 1))', transformOrigin: 'center center' }}
      >
        <style>{`
          @media (max-width: 480px) { :root { --phone-scale: 0.52; } }
          @media (min-width: 481px) and (max-width: 767px) { :root { --phone-scale: 0.70; } }
          @media (min-width: 768px) { :root { --phone-scale: 1; } }
        `}</style>

        {/* Tall spacer so the container doesn't collapse when scaled */}
        <div className="absolute inset-0 pointer-events-none" style={{ minHeight: '500px' }} />
      
      {/* Patient Phone (Locked Screen) */}
      <motion.div
        animate={patientPhoneControls}
        className="relative z-20 w-[220px] h-[450px] bg-black rounded-[2.5rem] border-[6px] border-gray-800 shadow-2xl overflow-hidden flex flex-col items-center select-none"
      >
        {/* Notch */}
        <div className="absolute top-0 w-32 h-6 bg-gray-800 rounded-b-2xl z-30"></div>
        
        {/* Lock Screen Wallpaper */}
        <div className="absolute inset-0 bg-gradient-to-b from-teal-900 via-gray-900 to-black opacity-80" />
        
        {/* Lock Icon */}
        <motion.div 
          animate={{ y: [0, -4, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="relative mt-12 mb-2 text-white/80"
        >
          <Lock className="w-5 h-5" />
        </motion.div>
        
        {/* Time */}
        <div className="relative text-white font-display text-5xl font-light mb-1 tracking-tight">
          {time}
        </div>
        <div className="relative text-white/70 text-xs mb-auto">
          Monday, October 12
        </div>

        {/* NFC Hint */}
        <div className="relative w-11/12 bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-8 border border-white/20">
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-teal/20 rounded-full flex items-center justify-center mb-2">
              <PhoneIcon className="w-5 h-5 text-teal-300" />
            </div>
            <p className="text-white text-sm font-medium mb-1">Health ID Active</p>
            <p className="text-white/60 text-[10px]">Sharing medical record...</p>
          </div>
        </div>

        {/* Swipe Indicator */}
        <div className="relative w-1/3 h-1 bg-white/30 rounded-full mb-2"></div>
      </motion.div>

      {/* Connection Indicator (Visual Hint) */}
      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 opacity-30 pointer-events-none">
        <motion.div
          animate={{ x: [-10, 10, -10] }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <div className="flex gap-2 text-teal-300">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-current" />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Doctor Phone */}
      <motion.div
        animate={doctorPhoneControls}
        className="relative z-10 w-[240px] h-[480px] bg-white rounded-[2.5rem] border-[6px] border-gray-200 shadow-xl overflow-hidden flex flex-col"
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-200 rounded-b-2xl z-30"></div>

        {/* Scan Ripple Effect */}
        <motion.div 
          animate={scanCircleControls}
          initial={{ opacity: 0, scale: 0 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-teal-400 rounded-full pointer-events-none z-20"
        />



        {/* Doctor App UI */}
        <div className="flex-1 bg-gray-50 flex flex-col pt-10">
          <AnimatePresence mode="wait">
            {!hasScanned ? (
              // Waiting State
              <motion.div 
                key="waiting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center p-6 text-center absolute inset-0 pt-10"
              >
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-4"
                >
                  <Activity className="w-8 h-8 text-teal-600" />
                </motion.div>
                <h3 className="text-gray-800 font-bold text-lg mb-2">Ready to Scan</h3>
                <p className="text-gray-500 text-sm">Receiving patient data via NFC...</p>
              </motion.div>
            ) : (
              // Scanned Data State
              <motion.div 
                key="scanned"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 flex flex-col bg-white h-full relative z-10"
              >
                {/* Header */}
                <div className="bg-teal-600 p-4 pb-6 text-white rounded-b-3xl shadow-sm relative">
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg leading-tight">Abebe Kebede</h2>
                      <p className="text-teal-100 text-xs flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> Verified Identity</p>
                    </div>
                  </div>
                </div>

                {/* Data Cards */}
                <div className="p-4 flex-1 overflow-y-auto space-y-3 -mt-4 relative z-10">
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex gap-4"
                  >
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Droplets className="w-3 h-3 text-red-500"/> Blood Type</p>
                      <p className="font-bold text-lg text-gray-800">O+</p>
                    </div>
                    <div className="w-px bg-gray-100"></div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Heart className="w-3 h-3 text-rose-500"/> Heart Rate</p>
                      <p className="font-bold text-lg text-gray-800">72 <span className="text-xs font-normal">bpm</span></p>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                    className="bg-orange-50 rounded-xl p-3 shadow-sm border border-orange-100"
                  >
                    <p className="text-xs text-orange-600 font-bold mb-1 uppercase tracking-wider">Allergies</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="bg-orange-200 text-orange-800 text-[10px] px-2 py-1 rounded-md font-medium">Penicillin</span>
                      <span className="bg-orange-200 text-orange-800 text-[10px] px-2 py-1 rounded-md font-medium">Peanuts</span>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                    className="bg-blue-50 rounded-xl p-3 shadow-sm border border-blue-100"
                  >
                    <p className="text-xs text-blue-600 font-bold mb-1 uppercase tracking-wider">Active Conditions</p>
                    <p className="text-sm text-gray-800 font-medium">Hypertension</p>
                    <p className="text-xs text-gray-500 mt-1">Diagnosed 2023 • Managed</p>
                  </motion.div>
                  
                  <motion.button 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    className="w-full mt-2 bg-teal-50 text-teal-700 rounded-xl p-3 flex items-center justify-center gap-2 text-sm font-semibold hover:bg-teal-100"
                  >
                    <PlusCircle className="w-4 h-4"/>
                    Add Clinical Note
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      </div>{/* end scale wrapper */}
    </div>
  );
}
