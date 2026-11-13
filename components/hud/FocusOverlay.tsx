'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Photo } from '@/types/photo';

interface FocusOverlayProps {
  photo: Photo | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function FocusOverlay({
  photo,
  onClose,
  onPrev,
  onNext,
}: FocusOverlayProps) {
  return (
    <AnimatePresence>
      {photo && (
        <div className="fixed inset-0 z-40 pointer-events-none select-none">
          {/* Close Action (Top-Right) */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute top-8 right-8 pointer-events-auto flex items-center space-x-3"
          >
            <span className="text-[10px] uppercase tracking-[0.25em] text-mutedStone hidden sm:inline-block">
              Esc to close
            </span>
            <button
              onClick={onClose}
              aria-label="Close focus view"
              className="w-10 h-10 rounded-full border border-white/20 bg-black/50 backdrop-blur-md flex items-center justify-center text-alabaster hover:text-white hover:border-white/50 transition-colors"
            >
              ✕
            </button>
          </motion.div>

          {/* Previous Photo Button (Left edge) */}
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
            onClick={onPrev}
            aria-label="Previous photograph"
            className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-auto w-12 h-12 rounded-full border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center text-alabaster hover:text-white hover:border-white/40 transition-all text-xl"
          >
            ‹
          </motion.button>

          {/* Next Photo Button (Right edge) */}
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
            onClick={onNext}
            aria-label="Next photograph"
            className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-auto w-12 h-12 rounded-full border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center text-alabaster hover:text-white hover:border-white/40 transition-all text-xl"
          >
            ›
          </motion.button>

          {/* Editorial Caption Bar (Bottom-Left) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="absolute bottom-8 left-6 sm:left-12 max-w-lg pointer-events-auto"
          >
            <div className="flex items-center space-x-3 mb-1.5">
              <span className="px-2 py-0.5 rounded-full border border-white/15 bg-white/5 text-[9px] uppercase tracking-[0.25em] text-alabaster/80 font-mono">
                {photo.category.replace('_', ' ')}
              </span>
              <span className="text-[10px] text-mutedStone uppercase tracking-[0.2em]">
                {new Date(photo.created_at).getFullYear()}
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl text-alabaster font-light tracking-wide">
              {photo.title || 'Untitled Exposure'}
            </h2>

            <p className="mt-1 text-xs text-neutral-400 line-clamp-2 font-sans tracking-wide leading-relaxed">
              {photo.alt_text}
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
