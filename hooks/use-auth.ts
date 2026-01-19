'use client';

import { useState, useCallback } from 'react';
import { useAuthContext } from '@/components/auth-provider';

export const useAuth = () => {
  const context = useAuthContext();
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      await context.login(email, password);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(msg);
      throw err;
    }
  }, [context]);

  const register = useCallback(async (nombre: string, email: string, password: string) => {
    setError(null);
    try {
      await context.register(nombre, email, password);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al registrarse';
      setError(msg);
      throw err;
    }
  }, [context]);

  return {
    ...context,
    login,
    register,
    error,
  };
};
