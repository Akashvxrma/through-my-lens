/**
 * Progressive Image Transformation Utility for "Through My Lens"
 * Optimizes WebGL texture memory and network payload by serving
 * resolution-appropriate textures (800-900px for 3D corridor, full-res for active focus).
 */

interface ImageTransformOptions {
  width?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'origin';
}

export function getOptimizedImageUrl(
  originalUrl: string,
  options: ImageTransformOptions = {}
): string {
  const { width = 850, quality = 78, format = 'webp' } = options;

  if (!originalUrl) return '';

  // 1. Supabase Storage Image Transformation Pipeline
  // Replaces /storage/v1/object/public/ with /storage/v1/render/image/public/
  if (originalUrl.includes('supabase.co/storage/v1/object/public/')) {
    const transformPath = originalUrl.replace(
      '/storage/v1/object/public/',
      '/storage/v1/render/image/public/'
    );
    const separator = transformPath.includes('?') ? '&' : '?';
    return `${transformPath}${separator}width=${width}&quality=${quality}&format=${format}`;
  }

  // 2. Unsplash Image Optimization CDN (Curated Museum Fallback Photos)
  if (originalUrl.includes('images.unsplash.com')) {
    try {
      const url = new URL(originalUrl);
      url.searchParams.set('w', width.toString());
      url.searchParams.set('q', quality.toString());
      url.searchParams.set('auto', 'format');
      url.searchParams.set('fit', 'crop');
      return url.toString();
    } catch {
      return originalUrl;
    }
  }

  // 3. Generic image URLs
  return originalUrl;
}
