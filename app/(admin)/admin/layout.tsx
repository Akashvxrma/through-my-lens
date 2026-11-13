import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      <header className="border-b border-neutral-800 bg-neutral-900/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin" className="text-lg font-medium text-white tracking-wide">
            Through My Lens <span className="text-xs text-neutral-400 font-normal">| Admin Panel</span>
          </Link>
        </div>
        <div className="flex items-center space-x-6 text-sm">
          <Link href="/" target="_blank" className="text-neutral-400 hover:text-white transition">
            View Live Site ↗
          </Link>
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="text-neutral-400 hover:text-red-400 transition"
            >
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6">
        {children}
      </main>
    </div>
  );
}
