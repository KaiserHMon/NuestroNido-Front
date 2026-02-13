import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useAuth } from '@/hooks/use-auth';
import { TokenService } from '@/services/token-service';
import { AuthService } from '@/services/auth-service';
import { User } from '@/lib/types';
import { AuthProvider } from '@/components/auth-provider';

vi.mock('@/services/token-service', () => ({
  TokenService: {
    getToken: vi.fn(),
    getUser: vi.fn(),
    setToken: vi.fn(),
    setUser: vi.fn(),
    removeToken: vi.fn(),
    removeUser: vi.fn(),
    clearSession: vi.fn(),
  },
}));

vi.mock('@/services/auth-service', () => ({
  AuthService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));

vi.mock('@/services/family-service', () => ({
  FamilyService: {
    getMyFamily: vi.fn().mockResolvedValue(null),
  },
}));

vi.mock('@/services/user-service', () => ({
  UserService: {
    getUser: vi.fn(),
  },
}));

vi.mock('@/services/level-service', () => ({
  LevelService: {
    getLevels: vi.fn().mockResolvedValue([]),
  },
}));

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it('should initialize as unauthenticated if no session', async () => {
    vi.mocked(TokenService.getToken).mockReturnValue(null);
    vi.mocked(TokenService.getUser).mockReturnValue(null);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it('should verify session successfully on mount', async () => {
    const mockUser = { id: '1', name: 'Test', email: 'test@test.com' };
    const mockToken = 'fake-token';

    vi.mocked(TokenService.getToken).mockReturnValue(mockToken);
    vi.mocked(TokenService.getUser).mockReturnValue(mockUser as unknown as User);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe(mockToken);
  });

  it('should handle error verifying session', async () => {
    vi.mocked(TokenService.getToken).mockImplementation(() => {
      throw new Error('Storage error');
    });
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should login successfully', async () => {
    const mockUser = { id: '1', name: 'Test', email: 'test@test.com' };
    const mockToken = 'new-token';

    vi.mocked(TokenService.getToken).mockReturnValue(null);
    vi.mocked(TokenService.getUser).mockReturnValue(null);

    vi.mocked(AuthService.login).mockResolvedValue({
      success: true,
      data: { token: mockToken, user: mockUser as unknown as User },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.login('test@test.com', 'password');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.error).toBeNull();
  });

  it('should handle login error', async () => {
    const errorMessage = 'Invalid credentials';
    vi.mocked(TokenService.getToken).mockReturnValue(null);
    vi.mocked(TokenService.getUser).mockReturnValue(null);
    vi.mocked(AuthService.login).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      try {
        await result.current.login('test@test.com', 'wrong');
      } catch {
        // Expected
      }
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('should perform logout', async () => {
    const mockUser = { id: '1', name: 'Test', email: 'test@test.com' };
    vi.mocked(TokenService.getToken).mockReturnValue('token');
    vi.mocked(TokenService.getUser).mockReturnValue(mockUser as unknown as User);

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    act(() => {
      result.current.logout();
    });

    expect(TokenService.clearSession).toHaveBeenCalled();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });
});
