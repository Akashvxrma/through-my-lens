import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Through My Lens | Photography Portfolio',
  description: 'A minimalist visual photography portfolio by Through My Lens.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
