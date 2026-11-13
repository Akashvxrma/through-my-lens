'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { PhotoCategory } from '@/types/photo';

export const CATEGORIES: { label: string; value: PhotoCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'People', value: 'people' },
  { label: 'Places', value: 'places' },
  { label: 'Everyday Moments', value: 'everyday_moments' },
  { label: 'Travel', value: 'travel' },
];

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = (searchParams.get('category') as PhotoCategory) || 'all';

  const handleCategorySelect = (category: PhotoCategory | 'all') => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    const query = params.toString() ? `?${params.toString()}` : '/';
    router.push(query, { scroll: false });
  };

  return (
    <nav aria-label="Photo categories" className="flex items-center justify-center space-x-6 py-6">
      {CATEGORIES.map((cat) => {
        const isActive = currentCategory === cat.value;
        return (
          <button
            key={cat.value}
            onClick={() => handleCategorySelect(cat.value)}
            className={`text-sm uppercase tracking-wider transition-opacity ${
              isActive ? 'font-semibold text-white border-b border-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </nav>
  );
}
