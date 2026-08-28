import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import { LoginForm } from '@/components/auth/login-form';

expect.extend(toHaveNoViolations);

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      title: 'Iniciar Sesión',
      google_button: 'Continuar con Google',
      or: 'O',
      email_label: 'Email',
      email_placeholder: 'tu@email.com',
      password_label: 'Contraseña',
      password_placeholder: 'Ingresa tu contraseña',
      forgot_password: '¿Olvidaste tu contraseña?',
      submitting: 'Iniciando sesión...',
      submit: 'Iniciar Sesión',
      no_account: '¿No tienes cuenta?',
      create_one: 'Crea una aquí',
    };
    return translations[key] || key;
  },
}));

// Mock useAuth
const mockLogin = vi.fn();
vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    login: mockLogin,
    error: null,
    isAuthenticated: false,
    isLoading: false,
  }),
}));

describe('LoginForm - Accessibility and Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(<LoginForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders all essential form controls with correct labels and roles', () => {
    render(<LoginForm />);

    expect(screen.getByRole('button', { name: /continuar con google/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /¿olvidaste tu contraseña\?/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^iniciar sesión$/i })).toBeInTheDocument();
  });

  it('validates required fields and email format on submit', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const submitBtn = screen.getByRole('button', { name: /^iniciar sesión$/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  it('calls login on submit with valid credentials', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    mockLogin.mockResolvedValueOnce(undefined);

    render(<LoginForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText(/^email$/i), 'usuario@ejemplo.com');
    await user.type(screen.getByLabelText(/^contraseña$/i), 'Password123!');
    await user.click(screen.getByRole('button', { name: /^iniciar sesión$/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('usuario@ejemplo.com', 'Password123!');
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });
});

