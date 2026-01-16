/**
 * Hook personalizado para autenticación
 * Maneja login, register, logout y gestión de sesión
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { Usuario } from '@/lib/types';
import { AuthService } from '@/services/auth-service';
import { TokenService } from '@/services/token-service';

interface AuthState {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    usuario: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = TokenService.getToken();
        const usuario = TokenService.getUser();

        if (token && usuario) {
          setState({
            usuario,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    checkSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await AuthService.login(email, password);

      if (response.success && response.data) {
        const { token, usuario } = response.data;

        TokenService.setToken(token);
        TokenService.setUser(usuario);

        setState({
          usuario,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
      setState({
        usuario: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  }, []);

  const register = useCallback(async (nombre: string, email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await AuthService.register(nombre, email, password);

      if (response.success && response.data) {
        const { token, usuario } = response.data;

        TokenService.setToken(token);
        TokenService.setUser(usuario);

        setState({
          usuario,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al registrarse';
      setState({
        usuario: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    TokenService.clearSession();

    setState({
      usuario: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    login,
    register,
    logout,
  };
};
