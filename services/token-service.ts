import { User } from '@/lib/types';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';
const FAMILY_KEY = 'family_data';

export const TokenService = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem(TOKEN_KEY);
    if (token === 'undefined' || token === 'null' || !token) {
      if (token) localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return token;
  },

  setToken(token: string): void {
    if (typeof window === 'undefined' || !token || token === 'undefined' || token === 'null')
      return;
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (token === 'undefined' || token === 'null' || !token) {
      if (token) localStorage.removeItem(REFRESH_TOKEN_KEY);
      return null;
    }
    return token;
  },

  setRefreshToken(token: string): void {
    if (typeof window === 'undefined' || !token || token === 'undefined' || token === 'null')
      return;
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  removeRefreshToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      if (userStr) localStorage.removeItem(USER_KEY);
      return null;
    }
    try {
      return JSON.parse(userStr) as User;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },

  setUser(user: User): void {
    if (typeof window === 'undefined' || !user) return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(USER_KEY);
  },

  clearSession(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(FAMILY_KEY);
    localStorage.removeItem('auth_storage');
    localStorage.removeItem('supabase.auth.token');
  },
};
