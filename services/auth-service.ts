/**
 * Authentication Service
 * Manages API calls for login and registration.
 */

import { User, ApiResponse, Family } from '@/lib/types';
import { fetchClient, ApiError } from '@/lib/api-client';
import { TokenService } from './token-service';
import { UserService } from './user-service';
import { mapColor } from '@/lib/colors';

interface ProxyLoginResponse {
  success: boolean;
  userId: string;
}

export const AuthService = {
  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<{ token: string | null; user: User }>> {
    try {
      const loginData = await fetchClient<ProxyLoginResponse>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
        requiresAuth: false,
      });

      const userId = loginData.userId;

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
        // If we have userId but failed to fetch details, we can't create full user object easily
        throw new Error('Could not fetch user details');
      }

      if (familyResponse.status === 'fulfilled' && familyResponse.value) {
        userData.familyId = familyResponse.value.id;
      }

      TokenService.setUser(userData);

      return {
        success: true,
        data: {
          token: null, // Token is in HttpOnly cookie
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
  ): Promise<ApiResponse<{ token: string | null; user: User }>> {
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

  async getMe(): Promise<User | null> {
    try {
      // Call local proxy to get verified user data
      // The proxy returns raw backend response for user
      const rawUser = await fetchClient<any>('/api/auth/me');

      // Transform data to match User type
      const colorData = mapColor(rawUser.color, rawUser.id);
      const levelData = rawUser.level;

      const user: User = {
        id: rawUser.id,
        name: rawUser.name,
        familyId: undefined,
        color: colorData,
        experience_points: rawUser.experience_points || 0,
        level: levelData
          ? {
              id: levelData.id,
              name: levelData.name,
              level_number: levelData.level_number,
              required_progress: levelData.required_progress,
              image_url: levelData.image_url,
            }
          : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      try {
        const family = await fetchClient<Family>('/api/v1/families/me');
        if (family) user.familyId = family.id;
      } catch (e) {
        // ignore
      }

      TokenService.setUser(user);
      return user;
    } catch (error) {
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await fetchClient('/api/auth/logout', { method: 'POST' });
      TokenService.clearSession();
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
};
