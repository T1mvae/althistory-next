import type { Metadata } from 'next';
import { Spectral, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { PrefsProvider } from '@/lib/prefs';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

const spectral = Spectral({
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-spectral',
  display: 'swap',
});
const plexSans = IBM_Plex_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-plex-sans',
  display: 'swap',
});
const plexMono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-plex-mono',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'AltHistory — Worldbuilding & Research Archive',
    template: '%s — AltHistory',
  },
  description:
    'A curated archive of internally-consistent alternate-historical worlds. A study in historical logic, systems thinking and narrative design.',
  openGraph: {
    title: 'AltHistory — Worldbuilding & Research Archive',
    description:
      'A curated archive of internally-consistent alternate-historical worlds.',
    type: 'website',
    url: siteUrl,
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spectral.variable} ${plexSans.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <PrefsProvider>
          <Nav />
          <main className="min-h-[calc(100vh-64px)]">{children}</main>
          <Footer />
        </PrefsProvider>
      </body>
    </html>
  );
}
