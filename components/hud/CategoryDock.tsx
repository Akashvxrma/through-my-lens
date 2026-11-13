'use client';

import { motion } from 'framer-motion';
import { PhotoCategory } from '@/types/photo';

interface CategoryDockProps {
  currentCategory: PhotoCategory | 'all';
  onCategorySelect: (category: PhotoCategory | 'all') => void;
  isFocused: boolean;
}

const CATEGORIES: { label: string; value: PhotoCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'People', value: 'people' },
  { label: 'Places', value: 'places' },
  { label: 'Everyday Moments', value: 'everyday_moments' },
  { label: 'Travel', value: 'travel' },
];

export default function CategoryDock({
  currentCategory,
  onCategorySelect,
  isFocused,
}: CategoryDockProps) {
  if (isFocused) return null;

  return (
    <div className="fixed bottom-8 left-0 w-full z-40 flex items-center justify-center pointer-events-none px-4">
      <motion.nav
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Spatial Gallery Categories"
        className="pointer-events-auto glass-pill px-2.5 py-2 rounded-full flex items-center space-x-1 sm:space-x-2 max-w-full overflow-x-auto"
      >
        {CATEGORIES.map((cat) => {
          const isActive = currentCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => onCategorySelect(cat.value)}
              className="relative px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 font-sans select-none whitespace-nowrap focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
            >
              {isActive && (
                <motion.div
                  layoutId="activeDockPill"
                  transition={{ type: 'spring', damping: 30, stiffness: 350 }}
                  className="absolute inset-0 rounded-full glass-pill-active border border-white/20"
                />
              )}
              <span
                className={`relative z-10 transition-colors duration-200 ${
                  isActive ? 'text-alabaster font-medium' : 'text-mutedStone hover:text-alabaster'
                }`}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </motion.nav>
    </div>
  );
}
