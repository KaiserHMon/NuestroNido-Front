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

  const register = useCallback(async (name: string, email: string, password: string) => {
    setError(null);
    try {
      await context.register(name, email, password);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al registrarse';
      setError(msg);
      throw err;
    }
  }, [context]);

  return {
    user: context.user,
    token: context.token,
    isAuthenticated: context.isAuthenticated,
    isLoading: context.isLoading,
    family: context.family,
    levels: context.levels,
    login,
    register,
    logout: context.logout,
    createFamily: context.createFamily,
    joinFamily: context.joinFamily,
    joinByLink: context.joinByLink,
    updateFamily: context.updateFamily,
    deleteFamily: context.deleteFamily,
    refreshFamily: context.refreshFamily,
    error,
  };
};
