import Link from 'next/link';
import CategoryFilter from '@/components/gallery/CategoryFilter';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-black text-neutral-100">
      <header className="pt-12 pb-6 text-center border-b border-neutral-900">
        <Link href="/" className="inline-block">
          <h1 className="text-3xl sm:text-4xl tracking-widest uppercase font-light text-white">
            Through My Lens
          </h1>
        </Link>
        <p className="mt-2 text-xs tracking-widest text-neutral-500 uppercase">
          A Visual Photography Portfolio
        </p>
        <div className="mt-4">
          <CategoryFilter />
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full">
        {children}
      </main>

      <footer className="py-8 text-center text-xs text-neutral-600 border-t border-neutral-900">
        <p>© {new Date().getFullYear()} Through My Lens. All rights reserved.</p>
      </footer>
    </div>
  );
}
