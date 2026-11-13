import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Through My Lens | Photography Portfolio',
  description: 'A minimalist 3D spatial photography exhibition by Through My Lens.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#0A0A0B] text-[#F4F3EF] antialiased selection:bg-neutral-800 selection:text-white font-sans overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
