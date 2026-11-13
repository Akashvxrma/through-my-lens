'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { damp3, damp } from 'maath/easing';
import { Photo, PhotoCategory } from '@/types/photo';
import PhotoPlane from './PhotoPlane';

interface GalleryCorridorProps {
  photos: Photo[];
  category: PhotoCategory | 'all';
  focusedPhoto: Photo | null;
  onSelectPhoto: (photo: Photo | null) => void;
  onHoverPhoto: (isHovered: boolean) => void;
}

export default function GalleryCorridor({
  photos,
  category,
  focusedPhoto,
  onSelectPhoto,
  onHoverPhoto,
}: GalleryCorridorProps) {
  const { camera, viewport } = useThree();
  const scrollRef = useRef(0);
  const targetScrollRef = useRef(0);
  const velocityRef = useRef(0);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  // Filtered photos based on active category
  const activePhotos = useMemo(() => {
    if (category === 'all') return photos;
    return photos.filter((p) => p.category === category);
  }, [photos, category]);

  // Compute 3D positions in an asymmetric gallery corridor
  const positions = useMemo(() => {
    const isMobile = viewport.width < 5;
    const zSpacing = 3.6;
    const xSpread = isMobile ? 1.0 : 2.1;

    return photos.map((_, i) => {
      // Alternate left, right, center-left, center-right
      const pattern = i % 4;
      let x = 0;
      if (pattern === 0) x = -xSpread * 0.9;
      else if (pattern === 1) x = xSpread * 0.95;
      else if (pattern === 2) x = -xSpread * 0.35;
      else x = xSpread * 0.4;

      const y = Math.sin(i * 1.3) * 0.45;
      const z = -i * zSpacing;

      return [x, y, z] as [number, number, number];
    });
  }, [photos, viewport.width]);

  // Total scroll depth limit
  const maxScroll = useMemo(() => {
    const zSpacing = 3.6;
    return (photos.length - 1) * zSpacing;
  }, [photos.length]);

  // Mouse wheel listener with inertia
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (focusedPhoto) return; // Freeze scroll during focus mode
      const delta = e.deltaY * 0.006;
      targetScrollRef.current = THREE.MathUtils.clamp(
        targetScrollRef.current + delta,
        0,
        maxScroll + 1.5
      );
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (focusedPhoto || touchStartY === null) return;
      const currentY = e.touches[0].clientY;
      const delta = (touchStartY - currentY) * 0.012;
      targetScrollRef.current = THREE.MathUtils.clamp(
        targetScrollRef.current + delta,
        0,
        maxScroll + 1.5
      );
      setTouchStartY(currentY);
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [focusedPhoto, maxScroll, touchStartY]);

  // Keyboard navigation when focused
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!focusedPhoto) return;

      const currentIndex = activePhotos.findIndex((p) => p.id === focusedPhoto.id);
      if (e.key === 'Escape') {
        onSelectPhoto(null);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (currentIndex < activePhotos.length - 1) {
          onSelectPhoto(activePhotos[currentIndex + 1]);
        } else {
          onSelectPhoto(activePhotos[0]); // Loop back
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (currentIndex > 0) {
          onSelectPhoto(activePhotos[currentIndex - 1]);
        } else {
          onSelectPhoto(activePhotos[activePhotos.length - 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedPhoto, activePhotos, onSelectPhoto]);

  // When focusedPhoto changes, smoothly scroll the camera to its vicinity
  useEffect(() => {
    if (focusedPhoto) {
      const idx = photos.findIndex((p) => p.id === focusedPhoto.id);
      if (idx !== -1) {
        const targetZ = idx * 3.6;
        targetScrollRef.current = THREE.MathUtils.clamp(targetZ, 0, maxScroll);
      }
    }
  }, [focusedPhoto, photos, maxScroll]);

  useFrame((state, delta) => {
    // High-inertia scroll interpolation
    const prevScroll = scrollRef.current;
    damp(scrollRef, 'current', targetScrollRef.current, 0.22, delta);
    velocityRef.current = (scrollRef.current - prevScroll) / Math.max(delta, 0.001);

    // Mouse parallax rig
    const parallaxX = state.pointer.x * (viewport.width < 5 ? 0.15 : 0.35);
    const parallaxY = state.pointer.y * 0.2;

    const cameraTarget = new THREE.Vector3(
      parallaxX,
      parallaxY,
      -scrollRef.current + 4.2
    );

    damp3(camera.position, cameraTarget, 0.25, delta);
    camera.lookAt(parallaxX * 0.5, parallaxY * 0.5, -scrollRef.current - 2.5);
  });

  return (
    <group onPointerMissed={() => onSelectPhoto(null)}>
      {photos.map((photo, i) => (
        <PhotoPlane
          key={photo.id}
          photo={photo}
          index={i}
          basePosition={positions[i]}
          category={category}
          isFocused={focusedPhoto?.id === photo.id}
          isAnyFocused={!!focusedPhoto}
          onSelect={(selected) => onSelectPhoto(selected)}
          onHoverChange={onHoverPhoto}
          scrollVelocity={velocityRef.current}
        />
      ))}
    </group>
  );
}
