// src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Reviews & Marketing - Turn Happy Customers into 5-Star Reviews',
  description: 'Automate your review collection and build customer trust with our powerful SaaS platform. Turn every satisfied customer into a public, 5-star advocate.',
  keywords: 'review management, customer reviews, business reputation, review automation, SaaS platform, online reputation management, customer feedback, business reviews',
  authors: [{ name: 'Reviews & Marketing' }],
  creator: 'Reviews & Marketing',
  publisher: 'Reviews & Marketing',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://reviewsandmarketing.com'),
  openGraph: {
    title: 'Reviews & Marketing - Turn Happy Customers into 5-Star Reviews',
    description: 'Automate your review collection and build customer trust with our powerful SaaS platform.',
    url: 'https://reviewsandmarketing.com',
    siteName: 'Reviews & Marketing',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Reviews & Marketing Platform - Automated Review Management',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reviews & Marketing - Turn Happy Customers into 5-Star Reviews',
    description: 'Automate your review collection and build customer trust with our powerful SaaS platform.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://reviewsandmarketing.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}

