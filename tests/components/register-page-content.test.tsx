import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RegisterPageContent } from '@/components/auth/register-page-content';

// Mock dependencies
vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    isLoading: false,
  }),
}));

vi.mock('@/hooks/use-family', () => ({
  useFamily: () => ({
    family: null,
    isLoading: false,
  }),
}));

// Mock RegisterForm since it's dynamically imported and not the focus of this test
vi.mock('@/components/auth/register-form', () => ({
  RegisterForm: () => <div data-testid="register-form">Register Form</div>,
}));

describe('RegisterPageContent', () => {
  it('renders the logo image', () => {
    render(<RegisterPageContent />);

    // Check if the logo image is present
    const logo = screen.getByRole('img', { name: /NuestroNido Logo/i });
    expect(logo).toBeInTheDocument();

    // Check if it has the correct src (at least contains logo.png)
    const src = logo.getAttribute('src');
    expect(src).toContain('nuestro-nido-logo.png');
  });
});
