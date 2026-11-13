import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import SpatialGalleryClient from '@/components/gallery/SpatialGalleryClient';
import { Photo } from '@/types/photo';

// Cache database results for 60 seconds (Next.js ISR)
export const revalidate = 60;

async function SpatialGalleryData() {
  try {
    const supabase = await createClient();
    const { data: photos, error } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !photos || photos.length === 0) {
      return <SpatialGalleryClient initialPhotos={[]} />;
    }

    return <SpatialGalleryClient initialPhotos={photos as Photo[]} />;
  } catch {
    // If Supabase is unconfigured, serve the curated museum-grade exhibition
    return <SpatialGalleryClient initialPhotos={[]} />;
  }
}

export default function GalleryPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 bg-[#0A0A0B] flex items-center justify-center">
          <div className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 font-mono">
            Loading Gallery...
          </div>
        </div>
      }
    >
      <SpatialGalleryData />
    </Suspense>
  );
}
