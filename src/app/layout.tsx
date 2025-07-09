// src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// This is the crucial import that was likely missing.
// It tells Next.js to load your Tailwind CSS styles.
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ReviewPilot',
  description: 'Turn every satisfied customer into a public, 5-star advocate.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

