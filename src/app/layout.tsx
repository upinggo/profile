import '@/styles/globals.css';
import { envFetch } from '@/utils/HelperUtils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Neil Profile',
  description: 'A profile page built with Next.js and React',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: 'https://upinggo.github.io/profile/favicons/icon.svg', type: 'image/svg+xml' }
    ]
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}