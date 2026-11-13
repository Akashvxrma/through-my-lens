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

  // 1. Local personal photographs in public/photos/
  if (originalUrl.startsWith('/photos/') && !originalUrl.startsWith('/photos/thumbnails/')) {
    const filename = originalUrl.replace('/photos/', '');
    const baseName = filename.substring(0, filename.lastIndexOf('.'));
    return `/photos/thumbnails/${baseName}.webp`;
  }

  // 2. Supabase Storage Image Transformation Pipeline
  if (originalUrl.includes('supabase.co/storage/v1/object/public/')) {
    const transformPath = originalUrl.replace(
      '/storage/v1/object/public/',
      '/storage/v1/render/image/public/'
    );
    const separator = transformPath.includes('?') ? '&' : '?';
    return `${transformPath}${separator}width=${width}&quality=${quality}&format=${format}`;
  }

  // 3. Fallback remote CDN optimization
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

  return originalUrl;
}
