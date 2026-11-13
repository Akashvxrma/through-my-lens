'use client';

import { Suspense, memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Photo, PhotoCategory } from '@/types/photo';
import GalleryCorridor from './GalleryCorridor';

interface SceneProps {
  photos: Photo[];
  category: PhotoCategory | 'all';
  focusedPhoto: Photo | null;
  onSelectPhoto: (photo: Photo | null) => void;
}

function SceneComponent({
  photos,
  category,
  focusedPhoto,
  onSelectPhoto,
}: SceneProps) {
  return (
    <div className="fixed inset-0 w-full h-full z-0 bg-[#0A0A0B] select-none">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 50, near: 0.1, far: 80 }}
        // Performance: Cap DPR to 1.5 to eliminate 4K / Retina fillrate bottlenecks
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        shadows={false}
      >
        <color attach="background" args={['#0A0A0B']} />
        
        {/* Atmospheric fog matching obsidian palette */}
        <fog attach="fog" args={['#0A0A0B', 6, 26]} />

        {/* Lightweight lighting setup */}
        <ambientLight intensity={1.1} />
        <directionalLight position={[5, 10, 5]} intensity={0.6} />
        <directionalLight position={[-5, 5, 2]} intensity={0.3} />

        <Suspense fallback={null}>
          <GalleryCorridor
            photos={photos}
            category={category}
            focusedPhoto={focusedPhoto}
            onSelectPhoto={onSelectPhoto}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default memo(SceneComponent);
