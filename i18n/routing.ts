import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'es'],

  // Used when no locale matches
  defaultLocale: 'es',
  pathnames: {
    '/': '/',
    '/home': '/home',
    '/login': '/login',
    '/register': '/register',
    '/auth/callback': '/auth/callback',
    '/dashboard': '/dashboard',
    '/dashboard/nido': {
      es: '/dashboard/nido',
      en: '/dashboard/nest',
    },
    '/dashboard/tareas': '/dashboard/tareas',
    '/dashboard/lista': '/dashboard/lista',
    '/dashboard/notas': '/dashboard/notas',
    '/privacy-policy': '/privacy-policy',
  },
});

export type Locale = (typeof routing.locales)[number];

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
