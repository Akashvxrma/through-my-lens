'use client';

import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

export default function Loader() {
  const { progress, active } = useProgress();

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0A0B] text-[#F4F3EF]"
        >
          {/* Minimalist Aperture Icon */}
          <div className="relative w-16 h-16 mb-8 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              className="w-12 h-12 rounded-full border border-white/20 border-t-white/80"
            />
            <div className="absolute w-2 h-2 rounded-full bg-white/60" />
          </div>

          <p className="font-serif text-xl tracking-[0.2em] uppercase text-white/90">
            Through My Lens
          </p>
          <span className="mt-3 text-[10px] tracking-[0.3em] uppercase text-neutral-500 font-mono">
            Loading Exhibition • {Math.round(progress)}%
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
