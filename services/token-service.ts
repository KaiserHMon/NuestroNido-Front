/**
 * Servicio para gestionar el almacenamiento de tokens y datos de sesión.
 * Actualmente usa localStorage, pero está abstraído para facilitar la migración
 * a cookies HttpOnly en el futuro.
 *
 * @warning El uso de localStorage es vulnerable a ataques XSS.
 * Asegúrese de sanear todas las entradas de usuario.
 */

import { Usuario } from '@/lib/types';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'usuario';
const FAMILY_KEY = 'familia';

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
    if (typeof window === 'undefined' || !token || token === 'undefined' || token === 'null') return;
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
    if (typeof window === 'undefined' || !token || token === 'undefined' || token === 'null') return;
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  removeRefreshToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  getUser(): Usuario | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      if (userStr) localStorage.removeItem(USER_KEY);
      return null;
    }
    try {
      return JSON.parse(userStr) as Usuario;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },

  setUser(user: Usuario): void {
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
    // Borrar cualquier otra posible clave relacionada con la sesión
    localStorage.removeItem('auth_storage'); // Por si se usó alguna vez
    localStorage.removeItem('supabase.auth.token'); // Por si hubo restos de Supabase
  },
};
