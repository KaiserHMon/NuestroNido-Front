/**
 * Authentication Service
 * Manages API calls for login and registration.
 */

import { User, ApiResponse, Family } from '@/lib/types';
import { fetchClient, ApiError } from '@/lib/api-client';
import { TokenService } from './token-service';
import { parseJwt } from '@/lib/jwt-utils';
import { UserService } from './user-service';

interface TokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
}

export const AuthService = {
  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<{ token: string; user: User }>> {
    try {
      const tokenData = await fetchClient<TokenResponse>('/api/v1/auth/login', {
        method: 'POST',
        body: { email, password },
        requiresAuth: false,
      });

      const token = tokenData.access_token;
      TokenService.setToken(token);
      
      if (tokenData.refresh_token) {
        TokenService.setRefreshToken(tokenData.refresh_token);
      }

      const decoded = parseJwt(token);
      if (!decoded || !decoded.sub) {
        throw new Error('Invalid token');
      }

      const userId = decoded.sub;

      const [userResponse, familyResponse] = await Promise.allSettled([
        UserService.getUser(userId),
        fetchClient<Family>('/api/v1/families/me'),
      ]);

      let userData: User;

      if (userResponse.status === 'fulfilled') {
        userData = {
          ...userResponse.value,
        };
      } else {
        userData = {
          id: userId,
          name: email.split('@')[0],
          experience_points: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      if (familyResponse.status === 'fulfilled' && familyResponse.value) {
        userData.familyId = familyResponse.value.id;
      }

      TokenService.setUser(userData);

      return {
        success: true,
        data: {
          token,
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
  ): Promise<ApiResponse<{ token: string; user: User }>> {
    try {
      await fetchClient('/api/v1/auth/signup', {
        method: 'POST',
        body: {
          email,
          password,
          full_name: name,
        },
        requiresAuth: false,
      });

      return this.login(email, password);
    } catch (error) {
      console.error('Register error:', error);
      let message = 'Error al registrar usuario';
      
      if (error instanceof ApiError && error.data && typeof error.data === 'object' && 'detail' in error.data) {
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
};
