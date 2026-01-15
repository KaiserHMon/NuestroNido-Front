/**
 * Servicio de Autenticación
 * Gestiona las llamadas a la API (o simuladas) para login y registro.
 */

import { Usuario, ApiResponse } from '@/lib/types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const AuthService = {
  async login(
    email: string,
    _password: string
  ): Promise<ApiResponse<{ token: string; usuario: Usuario }>> {
    await delay(800);

    return {
      success: true,
      data: {
        token: 'mock-token-' + Date.now(),
        usuario: {
          id: 'user-' + Date.now(),
          nombre: email.split('@')[0],
          email,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    };
  },

  async register(
    nombre: string,
    email: string,
    _password: string
  ): Promise<ApiResponse<{ token: string; usuario: Usuario }>> {
    await delay(800);

    return {
      success: true,
      data: {
        token: 'mock-token-' + Date.now(),
        usuario: {
          id: 'user-' + Date.now(),
          nombre,
          email,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    };
  },
};
