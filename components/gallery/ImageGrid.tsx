'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Photo } from '@/types/photo';
import Lightbox from '@/components/lightbox/Lightbox';

interface ImageGridProps {
  photos: Photo[];
}

export default function ImageGrid({ photos }: ImageGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!photos || photos.length === 0) {
    return (
      <div className="py-24 text-center text-neutral-500">
        <p>No photographs found in this category.</p>
      </div>
    );
  }

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 p-4 space-y-4">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="group relative cursor-pointer overflow-hidden rounded-sm break-inside-avoid bg-neutral-900"
            onClick={() => setSelectedIndex(index)}
          >
            <Image
              src={photo.image_url}
              alt={photo.alt_text}
              width={photo.width || 800}
              height={photo.height || 1000}
              className="w-full h-auto object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>

      <Lightbox
        photos={photos}
        currentIndex={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onNavigate={(newIndex) => setSelectedIndex(newIndex)}
      />
    </>
  );
}
