import type React from 'react';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Poppins, DM_Serif_Text } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/auth-provider';
import { Toaster } from '@/components/ui/sonner';
import '@/styles/globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});
const dmSerifText = DM_Serif_Text({
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic'],
  variable: '--font-dm-serif',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f76e6e' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'NuestroNido - Family Organization and Harmony',
    template: '%s | NuestroNido',
  },
  description:
    'A more organized, connected, and harmonious home. Manage tasks, shopping lists, and family notes in one place with fun gamification.',
  keywords: [
    'family organization',
    'shared calendar',
    'shopping lists',
    'household tasks',
    'family app',
    'gamification',
    'home management',
    'nuestro nido',
  ],
  authors: [{ name: 'NuestroNido Team' }],
  creator: 'NuestroNido',
  metadataBase: new URL('https://nuestronido.vercel.app'),
  openGraph: {
    title: 'NuestroNido - Family Organization and Harmony',
    description:
      'Coordinate tasks, lists and notes with your family in a fun way. Make order a game and keep your home in harmony!',
    url: 'https://nuestronido.vercel.app',
    siteName: 'NuestroNido',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'NuestroNido - Family Management',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NuestroNido - Your organized home',
    description:
      'Coordinate tasks, lists and notes with your family in a fun way. Join NuestroNido!',
    images: ['/og-image.svg'],
    creator: '@nuestronido',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  manifest: '/site.webmanifest',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geist.variable} ${geistMono.variable} ${poppins.variable} ${dmSerifText.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
              {children}
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
          <Analytics />
          <Script
            src="https://owlight-widget.vercel.app/widget-feedback.umd.js"
            data-theme="dark"
            data-position="right"
            data-lang={locale}
            strategy="lazyOnload"
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
