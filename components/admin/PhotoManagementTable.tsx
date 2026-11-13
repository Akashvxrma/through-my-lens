'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Photo } from '@/types/photo';
import { createClient } from '@/lib/supabase/client';

interface PhotoManagementTableProps {
  initialPhotos: Photo[];
}

export default function PhotoManagementTable({
  initialPhotos,
}: PhotoManagementTableProps) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const supabase = createClient();

  const handleDelete = async (photo: Photo) => {
    if (!confirm('Are you sure you want to delete this photograph?')) return;

    try {
      setDeletingId(photo.id);

      // 1. Delete image file from Supabase storage
      if (photo.storage_path) {
        const { error: storageError } = await supabase.storage
          .from('portfolio_images')
          .remove([photo.storage_path]);
        if (storageError) {
          console.error('Storage deletion error:', storageError);
        }
      }

      // 2. Delete record from database
      const { error: dbError } = await supabase
        .from('photos')
        .delete()
        .eq('id', photo.id);

      if (dbError) throw dbError;

      // Update state
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    } catch (err) {
      console.error('Error deleting photo:', err);
      alert('Failed to delete photo.');
    } finally {
      setDeletingId(null);
    }
  };

  if (photos.length === 0) {
    return (
      <div className="text-neutral-400 py-8 text-center bg-neutral-900 rounded border border-neutral-800">
        No photos uploaded yet. Use the upload form above to add your first photo.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-neutral-900 rounded border border-neutral-800">
      <table className="w-full text-left text-sm text-neutral-300">
        <thead className="bg-neutral-800 text-neutral-400 uppercase text-xs">
          <tr>
            <th className="p-4">Preview</th>
            <th className="p-4">Title / Alt</th>
            <th className="p-4">Category</th>
            <th className="p-4">Uploaded</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {photos.map((photo) => (
            <tr key={photo.id} className="hover:bg-neutral-800/50">
              <td className="p-4">
                <div className="relative w-16 h-16 rounded overflow-hidden bg-neutral-800">
                  <Image
                    src={photo.image_url}
                    alt={photo.alt_text}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
              </td>
              <td className="p-4">
                <div className="font-medium text-white">{photo.title || 'Untitled'}</div>
                <div className="text-xs text-neutral-400 truncate max-w-xs">{photo.alt_text}</div>
              </td>
              <td className="p-4 capitalize">{photo.category.replace('_', ' ')}</td>
              <td className="p-4 text-xs text-neutral-400">
                {new Date(photo.created_at).toLocaleDateString()}
              </td>
              <td className="p-4 text-right">
                <button
                  onClick={() => handleDelete(photo)}
                  disabled={deletingId === photo.id}
                  className="px-3 py-1 bg-red-900/60 hover:bg-red-800 text-red-200 text-xs rounded transition disabled:opacity-50"
                >
                  {deletingId === photo.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
