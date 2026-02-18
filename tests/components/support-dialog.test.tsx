import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { SupportDialog } from '@/components/dialogs/support-dialog';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}));

describe('SupportDialog', () => {
  const onOpenChange = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    // Mock window.location
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' },
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses the environment variable for support email', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPPORT_EMAIL', 'custom@test.com');

    render(<SupportDialog open={true} onOpenChange={onOpenChange} />);

    const textarea = screen.getByPlaceholderText('Describe tu problema aquí...');
    fireEvent.change(textarea, { target: { value: 'Test message' } });

    const submitButton = screen.getByText('Enviar');
    fireEvent.click(submitButton);

    expect(window.location.href).toContain('mailto:custom@test.com');
  });

  it('uses the fallback email when environment variable is not set', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPPORT_EMAIL', '');

    render(<SupportDialog open={true} onOpenChange={onOpenChange} />);

    const textarea = screen.getByPlaceholderText('Describe tu problema aquí...');
    fireEvent.change(textarea, { target: { value: 'Test message' } });

    const submitButton = screen.getByText('Enviar');
    fireEvent.click(submitButton);

    expect(window.location.href).toContain('mailto:support@example.com');
  });
});
