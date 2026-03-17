import { User } from '@/lib/types';

const USER_KEY = 'user_data';
const FAMILY_KEY = 'family_data';

let cachedUser: User | null = null;

export const TokenService = {
  // Access tokens are now managed via HttpOnly cookies by the browser
  getToken(): string | null {
    return null;
  },

  setToken(_token: string): void {
    // No-op: handled by browser cookies
  },

  removeToken(): void {
    // No-op: handled by browser cookies
  },

  getRefreshToken(): string | null {
    return null;
  },

  setRefreshToken(_token: string): void {
    // No-op: handled by browser cookies
  },

  removeRefreshToken(): void {
    // No-op: handled by browser cookies
  },

  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    // Attempt migration from localStorage if cachedUser is empty
    if (!cachedUser) {
      const userStr = localStorage.getItem(USER_KEY);
      if (userStr && userStr !== 'undefined' && userStr !== 'null') {
        try {
          cachedUser = JSON.parse(userStr) as User;
          // Clear legacy data once migrated to memory
          localStorage.removeItem(USER_KEY);
        } catch {
          localStorage.removeItem(USER_KEY);
        }
      } else if (userStr) {
        localStorage.removeItem(USER_KEY);
      }
    }
    return cachedUser;
  },

  setUser(user: User): void {
    if (typeof window === 'undefined' || !user) return;
    cachedUser = user;
    // Dispatch event to sync state across the application
    window.dispatchEvent(new Event('auth-user-changed'));
  },

  removeUser(): void {
    if (typeof window === 'undefined') return;
    cachedUser = null;
    localStorage.removeItem(USER_KEY);
  },

  clearSession(): void {
    if (typeof window === 'undefined') return;
    cachedUser = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(FAMILY_KEY);
    localStorage.removeItem('auth_storage');
    localStorage.removeItem('supabase.auth.token');
  },
};
