import { render, screen } from '@testing-library/react';
import { LandingHeader } from '../../components/landing-header';
import { describe, it, expect, vi } from 'vitest';

// Mock useAuth
vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    isLoading: false,
    user: null,
    family: null,
    logout: vi.fn(),
  }),
}));

// Mock image import
vi.mock('@/assets/logo.png', () => ({
  default: {
    src: '/img.jpg',
    height: 100,
    width: 100,
    blurDataURL: 'data:image/png;base64,imagedata',
  },
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('LandingHeader', () => {
  it('renders the logo image correctly', () => {
    render(<LandingHeader />);
    const images = screen.getAllByRole('img', { name: /nuestronido logo/i });
    expect(images.length).toBeGreaterThan(0);
    // next/image renders an img tag
    expect(images[0].tagName).toBe('IMG');
    // The src will be processed by Next.js, so we don't check for exact string '/logo.png'
    // but we can check if it has a src attribute.
    expect(images[0]).toHaveAttribute('src');
  });
});
