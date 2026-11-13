'use client';

import Link from 'next/link';

interface HeaderProps {
  totalPhotos: number;
  activeCount: number;
  category: string;
}

export default function Header({ totalPhotos, activeCount, category }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-40 p-6 sm:p-10 flex items-start justify-between pointer-events-none">
      {/* Brand Identity */}
      <div className="pointer-events-auto flex flex-col">
        <Link href="/" className="inline-block group">
          <h1 className="font-serif text-2xl sm:text-3xl font-light tracking-[0.25em] uppercase text-alabaster group-hover:text-white transition-colors duration-300">
            Through My Lens
          </h1>
        </Link>
        <span className="mt-1 text-[10px] tracking-[0.3em] uppercase text-mutedStone font-sans">
          A Visual Diary &bull; Spatial Exhibition
        </span>
      </div>

      {/* Exhibition Counter & Admin Access */}
      <div className="flex items-center space-x-6 text-right">
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-[10px] tracking-[0.25em] uppercase text-alabaster/90 font-mono">
            {String(activeCount).padStart(2, '0')} / {String(totalPhotos).padStart(2, '0')}
          </span>
          <span className="text-[9px] tracking-[0.25em] uppercase text-mutedStone">
            {category === 'all' ? 'All Exposures' : category.replace('_', ' ')}
          </span>
        </div>

        <Link
          href="/admin"
          className="pointer-events-auto px-3 py-1.5 rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-[10px] tracking-[0.2em] uppercase text-neutral-400 hover:text-alabaster hover:border-white/30 transition-all duration-300"
        >
          Curator
        </Link>
      </div>
    </header>
  );
}
