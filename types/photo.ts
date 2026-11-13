export type PhotoCategory = 'people' | 'places' | 'everyday_moments' | 'travel';

export interface Photo {
  id: string;
  title?: string | null;
  alt_text: string;
  category: PhotoCategory;
  image_url: string;
  thumbnail_url?: string | null;
  storage_path: string;
  width?: number | null;
  height?: number | null;
  blur_data_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PhotoUploadInput {
  file: File;
  title?: string;
  alt_text: string;
  category: PhotoCategory;
}

export interface GalleryFilterProps {
  currentCategory: PhotoCategory | 'all';
  onCategoryChange?: (category: PhotoCategory | 'all') => void;
}
