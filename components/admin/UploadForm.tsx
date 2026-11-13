'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PhotoCategory } from '@/types/photo';

interface UploadFormProps {
  onSuccess?: () => void;
}

export default function UploadForm({ onSuccess }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [altText, setAltText] = useState('');
  const [category, setCategory] = useState<PhotoCategory>('places');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage('Please select an image file to upload.');
      return;
    }
    if (!altText.trim()) {
      setErrorMessage('Please provide alt text for accessibility and SEO.');
      return;
    }

    try {
      setIsUploading(true);
      setErrorMessage(null);

      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${category}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = fileName;

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('portfolio_images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // 2. Retrieve public URL
      const { data: publicUrlData } = supabase.storage
        .from('portfolio_images')
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      // 3. Insert record into database
      const { error: dbError } = await supabase.from('photos').insert({
        title: title.trim() || null,
        alt_text: altText.trim(),
        category,
        image_url: imageUrl,
        storage_path: filePath,
      } as any);

      if (dbError) throw dbError;

      // Reset form
      setFile(null);
      setTitle('');
      setAltText('');
      setPreviewUrl(null);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to upload image. Please try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4 max-w-xl bg-neutral-900 p-6 rounded border border-neutral-800">
      <h2 className="text-xl font-medium text-white mb-4">Upload Photograph</h2>

      {errorMessage && (
        <div className="p-3 bg-red-900/50 text-red-200 text-sm rounded">
          {errorMessage}
        </div>
      )}

      <div>
        <label className="block text-sm text-neutral-400 mb-1">Image File</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
          className="block w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-neutral-800 file:text-neutral-200 hover:file:bg-neutral-700"
        />
      </div>

      {previewUrl && (
        <div className="my-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="Preview" className="h-40 w-auto object-cover rounded" />
        </div>
      )}

      <div>
        <label className="block text-sm text-neutral-400 mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as PhotoCategory)}
          className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white"
        >
          <option value="people">People</option>
          <option value="places">Places</option>
          <option value="everyday_moments">Everyday Moments</option>
          <option value="travel">Travel</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-neutral-400 mb-1">Title (Optional)</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Sunset in Kyoto"
          className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-400 mb-1">Alt Text (Accessibility & SEO)</label>
        <input
          type="text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder="Descriptive sentence of what is seen in the photograph"
          required
          className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white"
        />
      </div>

      <button
        type="submit"
        disabled={isUploading}
        className="w-full py-2.5 px-4 bg-white text-black font-medium rounded hover:bg-neutral-200 transition disabled:opacity-50"
      >
        {isUploading ? 'Uploading...' : 'Publish Photo'}
      </button>
    </form>
  );
}
