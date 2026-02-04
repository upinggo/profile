import '@/styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Neil Profile - Developer Portfolio',
    template: '%s | Neil Profile'
  },
  description: 'A professional profile page showcasing skills, experience, and technology stack built with Next.js and React',
  keywords: ['developer', 'portfolio', 'Next.js', 'React', 'TypeScript', 'AI'],
  authors: [{ name: 'Neil Shen' }],
  creator: 'Neil Shen',
  publisher: 'Neil Shen',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Neil Profile - Developer Portfolio',
    description: 'Professional developer portfolio showcasing skills and technology stack',
    url: 'https://upinggo.github.io/profile',
    siteName: 'Neil Profile',
    images: [
      {
        url: 'https://upinggo.github.io/profile/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Neil Profile Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Neil Profile - Developer Portfolio',
    description: 'Professional developer portfolio showcasing skills and technology stack',
    images: ['https://upinggo.github.io/profile/twitter-image.jpg'],
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
  alternates: {
    canonical: 'https://upinggo.github.io/profile',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: 'https://upinggo.github.io/profile/favicons/icon.svg', type: 'image/svg+xml' },
      { url: 'https://upinggo.github.io/profile/favicons/favicon.ico', type: 'image/x-icon' },
    ],
    apple: [
      { url: 'https://upinggo.github.io/profile/favicons/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="font-sans">
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}