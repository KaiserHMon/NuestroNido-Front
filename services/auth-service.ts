/**
 * Servicio de Autenticación
 * Gestiona las llamadas a la API para login y registro.
 */

import { Usuario, ApiResponse, Familia } from '@/lib/types';
import { fetchClient, ApiError } from '@/lib/api-client';
import { TokenService } from './token-service';
import { parseJwt } from '@/lib/jwt-utils';
import { UserService } from './user-service';

interface TokenResponse {
  access_token: string;
  token_type: string;
}

export const AuthService = {
  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<{ token: string; usuario: Usuario }>> {
    try {
      const tokenData = await fetchClient<TokenResponse>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
        requiresAuth: false,
      });

      const token = tokenData.access_token;
      TokenService.setToken(token);

      const decoded = parseJwt(token);
      if (!decoded || !decoded.sub) {
        throw new Error('Invalid token');
      }

      const userId = decoded.sub;

      // Fetch user details and family details in parallel
      const [user, familyResponse] = await Promise.allSettled([
        UserService.getUser(userId),
        fetchClient<Familia>('/api/families/me'),
      ]);

      let usuario: Usuario;

      if (user.status === 'fulfilled') {
        usuario = {
          ...user.value,
        };
      } else {
        // Fallback if user fetch fails (shouldn't happen for valid token)
        usuario = {
          id: userId,
          nombre: email.split('@')[0],
          experience_points: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      if (familyResponse.status === 'fulfilled' && familyResponse.value) {
        usuario.familiaId = familyResponse.value.id;
      }

      TokenService.setUser(usuario);

      return {
        success: true,
        data: {
          token,
          usuario,
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
    nombre: string,
    email: string,
    password: string
  ): Promise<ApiResponse<{ token: string; usuario: Usuario }>> {
    try {
      // 1. Signup
      await fetchClient('/api/auth/signup', {
        method: 'POST',
        body: {
          email,
          password,
          full_name: nombre,
        },
        requiresAuth: false,
      });

      // 2. Login immediately to get token
      return this.login(email, password);
    } catch (error) {
      console.error('Register error:', error);
      let message = 'Error al registrar usuario';
      
      if (error instanceof ApiError && error.data && typeof error.data === 'object' && 'detail' in error.data) {
         // FastAPI usually returns { detail: "message" }
         message = String((error.data as any).detail);
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
};