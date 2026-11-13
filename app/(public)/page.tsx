import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import SpatialGalleryClient from '@/components/gallery/SpatialGalleryClient';
import { Photo } from '@/types/photo';

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
    // If Supabase is unconfigured, seamlessly serve the curated museum-grade exhibition
    return <SpatialGalleryClient initialPhotos={[]} />;
  }
}

export default function GalleryPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 bg-[#0A0A0B] flex items-center justify-center text-white/50 text-xs tracking-[0.3em] uppercase">
          Initializing Spatial Canvas...
        </div>
      }
    >
      <SpatialGalleryData />
    </Suspense>
  );
}
