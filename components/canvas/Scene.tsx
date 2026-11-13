'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { Photo, PhotoCategory } from '@/types/photo';
import GalleryCorridor from './GalleryCorridor';

interface SceneProps {
  photos: Photo[];
  category: PhotoCategory | 'all';
  focusedPhoto: Photo | null;
  onSelectPhoto: (photo: Photo | null) => void;
  onHoverPhoto: (isHovered: boolean) => void;
}

export default function Scene({
  photos,
  category,
  focusedPhoto,
  onSelectPhoto,
  onHoverPhoto,
}: SceneProps) {
  return (
    <div className="fixed inset-0 w-full h-full z-0 bg-[#0A0A0B] select-none">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 50, near: 0.1, far: 80 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#0A0A0B']} />
        
        {/* Soft atmospheric depth-of-field fog matching the obsidian background */}
        <fog attach="fog" args={['#0A0A0B', 6, 26]} />

        {/* Minimal museum gallery illumination */}
        <ambientLight intensity={1.1} />
        <directionalLight position={[5, 10, 5]} intensity={0.6} />
        <directionalLight position={[-5, 5, 2]} intensity={0.3} />

        <Suspense fallback={null}>
          <GalleryCorridor
            photos={photos}
            category={category}
            focusedPhoto={focusedPhoto}
            onSelectPhoto={onSelectPhoto}
            onHoverPhoto={onHoverPhoto}
          />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
