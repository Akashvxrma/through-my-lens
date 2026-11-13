const fs = require('fs');
const path = require('path');
const sharp = require('../node_modules/sharp');

const PHOTOS_DIR = path.join(__dirname, '../public/photos');
const THUMB_DIR = path.join(PHOTOS_DIR, 'thumbnails');

const METADATA_MAP = {
  '20260303_004707.jpg': {
    category: 'everyday_moments',
    title: 'Midnight Diya & Marigolds',
    alt: 'Midnight Diya & Marigolds glowing in warm candlelight with orange flowers',
    date: '2026-03-03T00:47:07Z'
  },
  '20260302_153500.jpg': {
    category: 'travel',
    title: 'Sacred Ghats Along the River',
    alt: 'Sacred Ghats Along the River with ancient stone stairways leading to the water',
    date: '2026-03-02T15:35:00Z'
  },
  '20251230_185711.jpg': {
    category: 'everyday_moments',
    title: 'Vintage Brass Gramophone at Dusk',
    alt: 'Vintage Brass Gramophone at Dusk sitting on a wooden antique stand',
    date: '2025-12-30T18:57:11Z'
  },
  '20260216_152306.jpg': {
    category: 'people',
    title: 'Afternoon Siesta on the Street',
    alt: 'Afternoon Siesta on the Street capturing a peaceful quiet moment of rest',
    date: '2026-02-16T15:23:06Z'
  },
  '20260917_210522.jpg': {
    category: 'places',
    title: 'Qutub Minar Illuminated at Night',
    alt: 'Qutub Minar Illuminated at Night against the deep dark blue twilight sky',
    date: '2026-09-17T21:05:22Z'
  },
  'IMG-20260930-WA0010.jpg': {
    category: 'travel',
    title: 'Taj Mahal Framed Through the Archway',
    alt: 'Taj Mahal Framed Through the Archway with white marble reflected in soft morning light',
    date: '2026-09-30T10:00:00Z'
  },
  '20260110_173247.jpg': {
    category: 'people',
    title: 'Sulochana — Street Mural Portrait',
    alt: 'Sulochana — Street Mural Portrait painted vividly on an urban wall',
    date: '2026-01-10T17:32:47Z'
  },
  '20261110_161216.jpg': {
    category: 'everyday_moments',
    title: 'Golden Hour Through the Palms',
    alt: 'Golden Hour Through the Palms with warm amber sunset rays filtering through fronds',
    date: '2026-11-10T16:12:16Z'
  },
  'IMG-20250317-WA0013.jpg': {
    category: 'travel',
    title: 'Twilight Over the Island Shrine',
    alt: 'Twilight Over the Island Shrine surrounded by vast serene water at sunset',
    date: '2025-03-17T18:30:00Z'
  },
  '20261104_170820.jpg': {
    category: 'places',
    title: 'Crimson Dusk on the Riverbank',
    alt: 'Crimson Dusk on the Riverbank with intense evening sky reflecting across the water',
    date: '2026-11-04T17:08:20Z'
  },
  'Snapchat-248044147.jpg': {
    category: 'travel',
    title: 'River Boat on Calm Waters',
    alt: 'River Boat on Calm Waters carrying passengers across the holy river under clear skies',
    date: '2026-03-01T12:00:00Z'
  }
};

async function fixOrientation() {
  const files = fs.readdirSync(PHOTOS_DIR).filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png'));
  console.log(`Processing ${files.length} photos for EXIF normalization...`);

  const results = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(PHOTOS_DIR, file);
    const thumbName = `${path.parse(file).name}.webp`;
    const thumbPath = path.join(THUMB_DIR, thumbName);

    // 1. Read buffer
    const inputBuffer = fs.readFileSync(filePath);

    // 2. Normalize EXIF orientation into actual pixel data
    // Calling .rotate() with no arguments auto-rotates based on EXIF tag and strips/normalizes the flag
    const normalizedBuffer = await sharp(inputBuffer)
      .rotate()
      .jpeg({ quality: 92, mozjpeg: true })
      .toBuffer();

    // Overwrite the original photo with the upright, normalized pixels
    fs.writeFileSync(filePath, normalizedBuffer);

    // 3. Get accurate post-rotation metadata
    const metadata = await sharp(normalizedBuffer).metadata();
    const width = metadata.width;
    const height = metadata.height;
    const isPortrait = height > width;
    const aspectRatio = parseFloat((width / height).toFixed(4));

    // 4. Generate optimized upright WebP thumbnail for 3D corridor (max dimension 900px)
    await sharp(normalizedBuffer)
      .resize({
        width: isPortrait ? undefined : 900,
        height: isPortrait ? 900 : undefined,
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80, effort: 4 })
      .toFile(thumbPath);

    const mapping = METADATA_MAP[file] || {
      category: 'places',
      title: 'Moments Through My Lens',
      alt: 'Photograph from Through My Lens collection',
      date: new Date().toISOString()
    };

    results.push({
      id: `photo-${i + 1}`,
      title: mapping.title,
      alt_text: mapping.alt,
      category: mapping.category,
      image_url: `/photos/${file}`,
      thumbnail_url: `/photos/thumbnails/${thumbName}`,
      storage_path: `photos/${file}`,
      width,
      height,
      created_at: mapping.date,
      updated_at: mapping.date
    });

    console.log(`Normalized [${isPortrait ? 'PORTRAIT' : 'LANDSCAPE'}]: ${file} -> ${width}x${height} (aspect: ${aspectRatio})`);
  }

  // 5. Update user-photos.ts
  const outputTs = `import { Photo } from '@/types/photo';

export const USER_PHOTOS: Photo[] = ${JSON.stringify(results, null, 2)};
`;
  fs.writeFileSync(path.join(__dirname, '../lib/data/user-photos.ts'), outputTs);

  // 6. Update SQL seed migration
  const sqlValues = results.map(r => `(
  gen_random_uuid(),
  '${r.title.replace(/'/g, "''")}',
  '${r.alt_text.replace(/'/g, "''")}',
  '${r.category}',
  '${r.image_url}',
  '${r.storage_path}',
  ${r.width},
  ${r.height},
  '${r.created_at}',
  '${r.updated_at}'
)`).join(',\n');

  const sqlMigration = `-- ==========================================================
-- Normalized Real Photographs for "Through My Lens"
-- Automatically rotated to upright orientation with true pixel dimensions
-- ==========================================================

DELETE FROM public.photos WHERE id LIKE 'photo-%';

INSERT INTO public.photos (id, title, alt_text, category, image_url, storage_path, width, height, created_at, updated_at)
VALUES
${sqlValues};
`;

  fs.writeFileSync(path.join(__dirname, '../supabase/migrations/02_seed_user_photos.sql'), sqlMigration);

  console.log('Successfully normalized all photos, thumbnails, metadata, and SQL seed!');
}

fixOrientation().catch(console.error);
