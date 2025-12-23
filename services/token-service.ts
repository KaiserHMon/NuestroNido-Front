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
const USER_KEY = 'usuario';
const FAMILY_KEY = 'familia';

export const TokenService = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
  },

  getUser(): Usuario | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as Usuario;
    } catch {
      return null;
    }
  },

  setUser(user: Usuario): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(USER_KEY);
  },

  clearSession(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(FAMILY_KEY);
  },
};
