-- ==========================================================
-- Normalized Real Photographs for "Through My Lens"
-- Automatically rotated to upright orientation with true pixel dimensions
-- ==========================================================

DELETE FROM public.photos WHERE id LIKE 'photo-%';

INSERT INTO public.photos (id, title, alt_text, category, image_url, storage_path, width, height, created_at, updated_at)
VALUES
(
  gen_random_uuid(),
  'Vintage Brass Gramophone at Dusk',
  'Vintage Brass Gramophone at Dusk sitting on a wooden antique stand',
  'everyday_moments',
  '/photos/20251230_185711.jpg',
  'photos/20251230_185711.jpg',
  2252,
  4000,
  '2025-12-30T18:57:11Z',
  '2025-12-30T18:57:11Z'
),
(
  gen_random_uuid(),
  'Sulochana — Street Mural Portrait',
  'Sulochana — Street Mural Portrait painted vividly on an urban wall',
  'people',
  '/photos/20260110_173247.jpg',
  'photos/20260110_173247.jpg',
  2252,
  4000,
  '2026-01-10T17:32:47Z',
  '2026-01-10T17:32:47Z'
),
(
  gen_random_uuid(),
  'Afternoon Siesta on the Street',
  'Afternoon Siesta on the Street capturing a peaceful quiet moment of rest',
  'people',
  '/photos/20260216_152306.jpg',
  'photos/20260216_152306.jpg',
  2252,
  3412,
  '2026-02-16T15:23:06Z',
  '2026-02-16T15:23:06Z'
),
(
  gen_random_uuid(),
  'Sacred Ghats Along the River',
  'Sacred Ghats Along the River with ancient stone stairways leading to the water',
  'travel',
  '/photos/20260302_153500.jpg',
  'photos/20260302_153500.jpg',
  4000,
  2252,
  '2026-03-02T15:35:00Z',
  '2026-03-02T15:35:00Z'
),
(
  gen_random_uuid(),
  'Midnight Diya & Marigolds',
  'Midnight Diya & Marigolds glowing in warm candlelight with orange flowers',
  'everyday_moments',
  '/photos/20260303_004707.jpg',
  'photos/20260303_004707.jpg',
  2252,
  4000,
  '2026-03-03T00:47:07Z',
  '2026-03-03T00:47:07Z'
),
(
  gen_random_uuid(),
  'Qutub Minar Illuminated at Night',
  'Qutub Minar Illuminated at Night against the deep dark blue twilight sky',
  'places',
  '/photos/20260917_210522.jpg',
  'photos/20260917_210522.jpg',
  4592,
  8160,
  '2026-09-17T21:05:22Z',
  '2026-09-17T21:05:22Z'
),
(
  gen_random_uuid(),
  'Crimson Dusk on the Riverbank',
  'Crimson Dusk on the Riverbank with intense evening sky reflecting across the water',
  'places',
  '/photos/20261104_170820.jpg',
  'photos/20261104_170820.jpg',
  3000,
  4000,
  '2026-11-04T17:08:20Z',
  '2026-11-04T17:08:20Z'
),
(
  gen_random_uuid(),
  'Golden Hour Through the Palms',
  'Golden Hour Through the Palms with warm amber sunset rays filtering through fronds',
  'everyday_moments',
  '/photos/20261110_161216.jpg',
  'photos/20261110_161216.jpg',
  3000,
  4000,
  '2026-11-10T16:12:16Z',
  '2026-11-10T16:12:16Z'
),
(
  gen_random_uuid(),
  'Twilight Over the Island Shrine',
  'Twilight Over the Island Shrine surrounded by vast serene water at sunset',
  'travel',
  '/photos/IMG-20250317-WA0013.jpg',
  'photos/IMG-20250317-WA0013.jpg',
  4160,
  3120,
  '2025-03-17T18:30:00Z',
  '2025-03-17T18:30:00Z'
),
(
  gen_random_uuid(),
  'Taj Mahal Framed Through the Archway',
  'Taj Mahal Framed Through the Archway with white marble reflected in soft morning light',
  'travel',
  '/photos/IMG-20260930-WA0010.jpg',
  'photos/IMG-20260930-WA0010.jpg',
  1086,
  1448,
  '2026-09-30T10:00:00Z',
  '2026-09-30T10:00:00Z'
),
(
  gen_random_uuid(),
  'River Boat on Calm Waters',
  'River Boat on Calm Waters carrying passengers across the holy river under clear skies',
  'travel',
  '/photos/Snapchat-248044147.jpg',
  'photos/Snapchat-248044147.jpg',
  1440,
  2560,
  '2026-03-01T12:00:00Z',
  '2026-03-01T12:00:00Z'
);
