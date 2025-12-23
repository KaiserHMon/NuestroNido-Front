import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuth } from '@/hooks/use-auth';

// Mock del TokenService
vi.mock('@/services/token-service', () => ({
  getToken: vi.fn(),
  getUser: vi.fn(),
  setToken: vi.fn(),
  setUser: vi.fn(),
  removeToken: vi.fn(),
  removeUser: vi.fn(),
}));

// Mock del AuthService
vi.mock('@/services/auth-service', () => ({
  AuthService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar sin errores', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current).toBeDefined();
    expect(result.current.isLoading).toBeDefined();
    expect(result.current.error).toBe(null);
  });

  it('debe tener métodos de login y logout disponibles', () => {
    const { result } = renderHook(() => useAuth());

    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
    expect(typeof result.current.register).toBe('function');
  });
});
