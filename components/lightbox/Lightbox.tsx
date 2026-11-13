'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Photo } from '@/types/photo';

interface LightboxProps {
  photos: Photo[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export default function Lightbox({
  photos,
  currentIndex,
  onClose,
  onNavigate,
}: LightboxProps) {
  const isOpen = currentIndex !== null && photos[currentIndex] !== undefined;
  const currentPhoto = isOpen ? photos[currentIndex] : null;

  const handleNext = useCallback(() => {
    if (currentIndex === null || photos.length === 0) return;
    const nextIndex = (currentIndex + 1) % photos.length;
    onNavigate(nextIndex);
  }, [currentIndex, photos.length, onNavigate]);

  const handlePrev = useCallback(() => {
    if (currentIndex === null || photos.length === 0) return;
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    onNavigate(prevIndex);
  }, [currentIndex, photos.length, onNavigate]);

  // Keyboard navigation & escape listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') handleNext();
      if (event.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || !currentPhoto) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close modal"
        className="absolute top-6 right-6 text-white/70 hover:text-white text-2xl z-50 p-2"
      >
        ✕
      </button>

      {/* Prev button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        aria-label="Previous image"
        className="absolute left-6 text-white/70 hover:text-white text-4xl z-50 p-4 select-none"
      >
        ‹
      </button>

      {/* Main Image Container */}
      <div
        className="relative max-w-7xl max-h-[85vh] w-full h-full flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={currentPhoto.image_url}
          alt={currentPhoto.alt_text}
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />
      </div>

      {/* Next button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        aria-label="Next image"
        className="absolute right-6 text-white/70 hover:text-white text-4xl z-50 p-4 select-none"
      >
        ›
      </button>
    </div>
  );
}
