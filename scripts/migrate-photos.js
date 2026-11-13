const fs = require('fs');
const path = require('path');
const sharp = require('../node_modules/sharp');

const SOURCE_DIR = path.join(__dirname, '../photos');
const DEST_DIR = path.join(__dirname, '../public/photos');
const THUMB_DIR = path.join(DEST_DIR, 'thumbnails');

if (!fs.existsSync(DEST_DIR)) fs.mkdirSync(DEST_DIR, { recursive: true });
if (!fs.existsSync(THUMB_DIR)) fs.mkdirSync(THUMB_DIR, { recursive: true });

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

async function migrate() {
  const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png'));
  console.log(`Found ${files.length} photos to migrate.`);

  const results = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const srcPath = path.join(SOURCE_DIR, file);
    const destPath = path.join(DEST_DIR, file);
    const thumbName = `${path.parse(file).name}.webp`;
    const thumbPath = path.join(THUMB_DIR, thumbName);

    // 1. Copy original full-res photo
    fs.copyFileSync(srcPath, destPath);

    // 2. Extract dimensions with sharp
    const metadata = await sharp(srcPath).metadata();
    const width = metadata.width;
    const height = metadata.height;

    // 3. Generate high-performance WebP thumbnail for 3D corridor (max dimension 900px)
    await sharp(srcPath)
      .resize({
        width: width > height ? 900 : undefined,
        height: height >= width ? 900 : undefined,
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

    console.log(`Processed: ${file} -> ${width}x${height} (${mapping.category}: ${mapping.title})`);
  }

  // Save the complete photo dataset
  const outputTs = `import { Photo } from '@/types/photo';

export const USER_PHOTOS: Photo[] = ${JSON.stringify(results, null, 2)};
`;

  fs.writeFileSync(path.join(__dirname, '../lib/data/user-photos.ts'), outputTs);
  console.log('Saved user-photos.ts successfully!');
}

migrate().catch(console.error);
