import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import ImageGrid from '@/components/gallery/ImageGrid';
import GallerySkeleton from '@/components/gallery/GallerySkeleton';
import { Photo } from '@/types/photo';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function GalleryLoader({ category }: { category?: string }) {
  const supabase = await createClient();

  let query = supabase
    .from('photos')
    .select('*')
    .order('created_at', { ascending: false });

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  const { data: photos, error } = await query;

  if (error) {
    console.error('Failed to load photos:', error);
    return (
      <div className="py-20 text-center text-neutral-400">
        Failed to load photographs. Please verify your Supabase configuration.
      </div>
    );
  }

  return <ImageGrid photos={(photos as Photo[]) || []} />;
}

export default async function GalleryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const category = typeof params.category === 'string' ? params.category : undefined;

  return (
    <div className="py-6">
      <Suspense key={category || 'all'} fallback={<GallerySkeleton />}>
        <GalleryLoader category={category} />
      </Suspense>
    </div>
  );
}
