import { User } from '@/lib/types';

const USER_KEY = 'user_data';
const FAMILY_KEY = 'family_data';

export const TokenService = {
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
    // Tokens are now stored in HttpOnly cookies and managed by the server/proxy
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(FAMILY_KEY);
    localStorage.removeItem('auth_storage');
    localStorage.removeItem('supabase.auth.token');
  },
};
