import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useAuth } from '@/hooks/use-auth';
import { TokenService } from '@/services/token-service';
import { AuthService } from '@/services/auth-service';

// Mock del TokenService
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

  it('debe inicializar como no autenticado si no hay sesión', async () => {
    vi.mocked(TokenService.getToken).mockReturnValue(null);
    vi.mocked(TokenService.getUser).mockReturnValue(null);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.usuario).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it('debe verificar sesión exitosamente al montar', async () => {
    const mockUser = { id: '1', nombre: 'Test', email: 'test@test.com' };
    const mockToken = 'fake-token';

    vi.mocked(TokenService.getToken).mockReturnValue(mockToken);
    vi.mocked(TokenService.getUser).mockReturnValue(mockUser as any);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.usuario).toEqual(mockUser);
    expect(result.current.token).toBe(mockToken);
  });

   it('debe manejar error verificando sesión', async () => {
    // Force an error in TokenService
    vi.mocked(TokenService.getToken).mockImplementation(() => {
        throw new Error('Storage error');
    });
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });


  it('debe realizar login exitoso', async () => {
    const mockUser = { id: '1', nombre: 'Test', email: 'test@test.com' };
    const mockToken = 'new-token';
    
    vi.mocked(TokenService.getToken).mockReturnValue(null); 
    vi.mocked(TokenService.getUser).mockReturnValue(null);
    
    vi.mocked(AuthService.login).mockResolvedValue({
        success: true,
        data: { token: mockToken, usuario: mockUser as any },
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
        await result.current.login('test@test.com', 'password');
    });

    expect(TokenService.setToken).toHaveBeenCalledWith(mockToken);
    expect(TokenService.setUser).toHaveBeenCalledWith(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.usuario).toEqual(mockUser);
    expect(result.current.error).toBeNull();
  });

  it('debe manejar error en login', async () => {
    const errorMessage = 'Credenciales inválidas';
    vi.mocked(TokenService.getToken).mockReturnValue(null);
    vi.mocked(TokenService.getUser).mockReturnValue(null);
    vi.mocked(AuthService.login).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
        try {
            await result.current.login('test@test.com', 'wrong');
        } catch (error) {
             // Expected to throw
        }
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('debe realizar registro exitoso', async () => {
    const mockUser = { id: '2', nombre: 'New', email: 'new@test.com' };
    const mockToken = 'reg-token';
    
    vi.mocked(TokenService.getToken).mockReturnValue(null);
    vi.mocked(TokenService.getUser).mockReturnValue(null);

    vi.mocked(AuthService.register).mockResolvedValue({
        success: true,
        data: { token: mockToken, usuario: mockUser as any },
    });

    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
        await result.current.register('New', 'new@test.com', 'password');
    });

    expect(TokenService.setToken).toHaveBeenCalledWith(mockToken);
    expect(TokenService.setUser).toHaveBeenCalledWith(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('debe manejar error en registro', async () => {
    const errorMessage = 'El email ya existe';
    vi.mocked(TokenService.getToken).mockReturnValue(null);
    vi.mocked(TokenService.getUser).mockReturnValue(null);
    vi.mocked(AuthService.register).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
        try {
            await result.current.register('Exist', 'exist@test.com', 'pass');
        } catch (e) {
            // Expected
        }
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

   it('debe realizar logout', async () => {
    const mockUser = { id: '1', nombre: 'Test', email: 'test@test.com' };
    vi.mocked(TokenService.getToken).mockReturnValue('token');
    vi.mocked(TokenService.getUser).mockReturnValue(mockUser as any);

    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    act(() => {
        result.current.logout();
    });

    expect(TokenService.clearSession).toHaveBeenCalled();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.usuario).toBeNull();
    expect(result.current.token).toBeNull();
  });
});