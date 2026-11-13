-- ==========================================================
-- Database Schema for "Through My Lens" Photography Portfolio
-- ==========================================================

-- 1. Enable UUID Extension (standard for Postgres / Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Photo Category Type / Check constraint
-- Categories: 'people', 'places', 'everyday_moments', 'travel'
CREATE TABLE IF NOT EXISTS public.photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255),
    alt_text TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('people', 'places', 'everyday_moments', 'travel')),
    image_url TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    width INTEGER,
    height INTEGER,
    blur_data_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Indexes for High-Performance Gallery Fetching & Filtering
CREATE INDEX IF NOT EXISTS idx_photos_category ON public.photos (category);
CREATE INDEX IF NOT EXISTS idx_photos_created_at ON public.photos (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_photos_category_created_at ON public.photos (category, created_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- 5. Row Level Security Policies
-- Policy: Public can view all photos
DROP POLICY IF EXISTS "Public photos are viewable by everyone" ON public.photos;
CREATE POLICY "Public photos are viewable by everyone"
    ON public.photos
    FOR SELECT
    USING (true);

-- Policy: Only authenticated users (Admin) can insert photos
DROP POLICY IF EXISTS "Authenticated users can insert photos" ON public.photos;
CREATE POLICY "Authenticated users can insert photos"
    ON public.photos
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy: Only authenticated users (Admin) can update photos
DROP POLICY IF EXISTS "Authenticated users can update photos" ON public.photos;
CREATE POLICY "Authenticated users can update photos"
    ON public.photos
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: Only authenticated users (Admin) can delete photos
DROP POLICY IF EXISTS "Authenticated users can delete photos" ON public.photos;
CREATE POLICY "Authenticated users can delete photos"
    ON public.photos
    FOR DELETE
    TO authenticated
    USING (true);

-- 6. Setup Supabase Storage Bucket for High-Res Images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'portfolio_images',
    'portfolio_images',
    true,
    52428800, -- 50 MB limit for high-res photography
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

-- 7. Storage Bucket Security Policies
-- Allow public access to view/download photos in portfolio_images bucket
DROP POLICY IF EXISTS "Public Access to portfolio_images" ON storage.objects;
CREATE POLICY "Public Access to portfolio_images"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'portfolio_images');

-- Allow authenticated users (Admin) to upload images to portfolio_images bucket
DROP POLICY IF EXISTS "Admin Upload Access to portfolio_images" ON storage.objects;
CREATE POLICY "Admin Upload Access to portfolio_images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'portfolio_images');

-- Allow authenticated users (Admin) to update/delete images in portfolio_images bucket
DROP POLICY IF EXISTS "Admin Modify Access to portfolio_images" ON storage.objects;
CREATE POLICY "Admin Modify Access to portfolio_images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'portfolio_images');

DROP POLICY IF EXISTS "Admin Delete Access to portfolio_images" ON storage.objects;
CREATE POLICY "Admin Delete Access to portfolio_images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'portfolio_images');
