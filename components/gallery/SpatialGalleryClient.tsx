'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Photo, PhotoCategory } from '@/types/photo';
import { CURATED_PHOTOS } from '@/lib/data/curated-photos';
import Scene from '@/components/canvas/Scene';
import Loader from '@/components/canvas/Loader';
import CustomCursor from '@/components/canvas/CustomCursor';
import Header from '@/components/hud/Header';
import CategoryDock from '@/components/hud/CategoryDock';
import FocusOverlay from '@/components/hud/FocusOverlay';

interface SpatialGalleryClientProps {
  initialPhotos?: Photo[];
}

export default function SpatialGalleryClient({
  initialPhotos = [],
}: SpatialGalleryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active Category from URL query param
  const urlCategory = searchParams.get('category') as PhotoCategory | null;
  const currentCategory: PhotoCategory | 'all' = urlCategory || 'all';

  // Use DB photos if available, otherwise seamlessly fall back to curated museum exhibition
  const allPhotos = useMemo(() => {
    return initialPhotos.length > 0 ? initialPhotos : CURATED_PHOTOS;
  }, [initialPhotos]);

  const [focusedPhoto, setFocusedPhoto] = useState<Photo | null>(null);
  const [isHoveringPhoto, setIsHoveringPhoto] = useState(false);

  // Filtered list for active category
  const activeCategoryPhotos = useMemo(() => {
    if (currentCategory === 'all') return allPhotos;
    return allPhotos.filter((p) => p.category === currentCategory);
  }, [allPhotos, currentCategory]);

  const handleCategorySelect = (category: PhotoCategory | 'all') => {
    setFocusedPhoto(null);
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    const query = params.toString() ? `?${params.toString()}` : '/';
    router.push(query, { scroll: false });
  };

  const handleNextPhoto = useCallback(() => {
    if (!focusedPhoto || activeCategoryPhotos.length === 0) return;
    const idx = activeCategoryPhotos.findIndex((p) => p.id === focusedPhoto.id);
    const nextIdx = (idx + 1) % activeCategoryPhotos.length;
    setFocusedPhoto(activeCategoryPhotos[nextIdx]);
  }, [focusedPhoto, activeCategoryPhotos]);

  const handlePrevPhoto = useCallback(() => {
    if (!focusedPhoto || activeCategoryPhotos.length === 0) return;
    const idx = activeCategoryPhotos.findIndex((p) => p.id === focusedPhoto.id);
    const prevIdx = (idx - 1 + activeCategoryPhotos.length) % activeCategoryPhotos.length;
    setFocusedPhoto(activeCategoryPhotos[prevIdx]);
  }, [focusedPhoto, activeCategoryPhotos]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0A0A0B]">
      {/* 3D WebGL Canvas Layer */}
      <Scene
        photos={allPhotos}
        category={currentCategory}
        focusedPhoto={focusedPhoto}
        onSelectPhoto={(photo) => setFocusedPhoto(photo)}
        onHoverPhoto={(hovered) => setIsHoveringPhoto(hovered)}
      />

      {/* 2D Minimalist HUD Overlay */}
      <Header
        totalPhotos={allPhotos.length}
        activeCount={activeCategoryPhotos.length}
        category={currentCategory}
      />

      <CategoryDock
        currentCategory={currentCategory}
        onCategorySelect={handleCategorySelect}
        isFocused={!!focusedPhoto}
      />

      <FocusOverlay
        photo={focusedPhoto}
        onClose={() => setFocusedPhoto(null)}
        onPrev={handlePrevPhoto}
        onNext={handleNextPhoto}
      />

      {/* Atmospheric Texture Loader & Custom Cursor */}
      <Loader />
      <CustomCursor
        isHoveringPhoto={isHoveringPhoto}
        isFocused={!!focusedPhoto}
      />
    </div>
  );
}
