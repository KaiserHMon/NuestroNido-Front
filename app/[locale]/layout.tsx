import type React from 'react';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Poppins, DM_Serif_Text } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/auth-provider';
import { Toaster } from '@/components/ui/sonner';
import '@/styles/globals.css';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';

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
    default: 'NuestroNido - Organización Familiar y Armonía',
    template: '%s | NuestroNido',
  },
  description:
    'Un hogar más organizado, conectado y en armonía. Gestiona tareas, listas de compras y notas familiares en un solo lugar con gamificación divertida.',
  keywords: [
    'organización familiar',
    'calendario compartido',
    'listas de compras',
    'tareas del hogar',
    'app familiar',
    'gamificación',
    'gestión del hogar',
    'nuestro nido',
  ],
  authors: [{ name: 'NuestroNido Team' }],
  creator: 'NuestroNido',
  metadataBase: new URL('https://nuestronido.vercel.app'),
  openGraph: {
    title: 'NuestroNido - Organización Familiar y Armonía',
    description:
      'Coordina tareas, listas y notas con tu familia de forma divertida. ¡Haz del orden un juego y mantén tu hogar en armonía!',
    url: 'https://nuestronido.vercel.app',
    siteName: 'NuestroNido',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'NuestroNido - Gestión Familiar',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NuestroNido - Tu hogar organizado',
    description:
      'Coordina tareas, listas y notas con tu familia de forma divertida. ¡Únete a NuestroNido!',
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
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} ${poppins.variable} ${dmSerifText.variable} font-sans antialiased`}>
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
            data-position="left"
            data-lang={locale}
            strategy="lazyOnload"
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
