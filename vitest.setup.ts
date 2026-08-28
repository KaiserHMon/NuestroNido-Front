import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Set environment variables for tests
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';
process.env.NEXT_PUBLIC_SUPPORT_EMAIL = 'support@example.com';

afterEach(() => {
  cleanup();
});

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: '/',
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock next/router
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: '/',
  }),
}));

// Mock @/i18n/routing
vi.mock('@/i18n/routing', () => ({
  Link: ({ children, href, ...props }: any) => {
    const React = require('react');
    return React.createElement('a', { href: typeof href === 'string' ? href : '#', ...props }, children);
  },
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  redirect: vi.fn(),
  getPathname: vi.fn(() => '/'),
}));


// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock next-intl
vi.mock('next-intl', () => {
  const esMessages = require('./messages/es.json');
  return {
    useTranslations: (namespace?: string) => (key: string) => {
      if (!namespace) {
        return esMessages[key] || key;
      }
      const parts = namespace.split('.');
      let current: any = esMessages;
      for (const part of parts) {
        if (current && current[part]) {
          current = current[part];
        } else {
          current = undefined;
          break;
        }
      }
      if (current && typeof current === 'object' && current[key]) {
        return current[key];
      }
      return key;
    },
    useLocale: () => 'es',
  };
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));



