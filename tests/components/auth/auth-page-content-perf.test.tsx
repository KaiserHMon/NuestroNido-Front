import { render, screen } from '@testing-library/react';
import { AuthPageContent } from '@/components/auth/auth-page-content';
import { vi, describe, it, expect } from 'vitest';

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img alt="" {...props} data-testid="next-image" />
  ),
}));

// Mock hooks
vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
  }),
}));

vi.mock('@/hooks/use-family', () => ({
  useFamily: () => ({
    family: null,
    isLoading: false,
  }),
}));

// Mock dynamic imports to prevent actual loading
vi.mock('next/dynamic', () => ({
  default: () => {
    const MockComponent = () => <div data-testid="mock-form">Form</div>;
    return MockComponent;
  },
}));

describe('AuthPageContent Performance', () => {
  it('should use next/image for the logo', () => {
    render(<AuthPageContent />);

    // Check if next/image is used
    const image = screen.getByTestId('next-image');
    expect(image).toBeInTheDocument();

    // Check props
    expect(image).toHaveAttribute('src', '/nuestro-nido-logo.png');
    expect(image).toHaveAttribute('width', '261');
    expect(image).toHaveAttribute('height', '64');
    expect(image).toHaveAttribute('alt', 'NuestroNido Logo');
    expect(image).toHaveClass('h-16 w-auto object-contain');
  });
});
