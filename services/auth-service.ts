/**
 * Authentication Service
 * Manages API calls for login and registration.
 */

import { User, ApiResponse } from '@/lib/types';
import { fetchClient, ApiError } from '@/lib/api-client';
import { TokenService } from './token-service';

interface AuthResponse {
  user: User;
}

export const AuthService = {
  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<{ user: User }>> {
    try {
      const data = await fetchClient<AuthResponse>('/api/v1/auth/login', {
        method: 'POST',
        body: { email, password },
        requiresAuth: false,
      });

      const userData = data.user;
      TokenService.setUser(userData);

      return {
        success: true,
        data: {
          user: userData,
        },
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: {
          code: 'LOGIN_FAILED',
          message: error instanceof Error ? error.message : 'Error al iniciar sesión',
        },
      };
    }
  },

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<ApiResponse<{ user: User }>> {
    try {
      const data = await fetchClient<AuthResponse>('/api/v1/auth/signup', {
        method: 'POST',
        body: {
          email,
          password,
          full_name: name,
        },
        requiresAuth: false,
      });

      const userData = data.user;
      TokenService.setUser(userData);

      return {
        success: true,
        data: {
          user: userData,
        },
      };
    } catch (error) {
      console.error('Register error:', error);
      let message = 'Error al registrar usuario';

      if (
        error instanceof ApiError &&
        error.data &&
        typeof error.data === 'object' &&
        'detail' in error.data
      ) {
        message = String((error.data as { detail: unknown }).detail);
      } else if (error instanceof Error) {
        message = error.message;
      }

      return {
        success: false,
        error: {
          code: 'REGISTER_FAILED',
          message,
        },
      };
    }
  },

  async logout(): Promise<void> {
    try {
      await fetchClient('/api/v1/auth/logout', {
        method: 'POST',
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      TokenService.clearSession();
    }
  },
};
