'use client';

import { useState, useCallback } from 'react';
import { useAuthContext } from '@/components/auth-provider';
import { FamilyService } from '@/services/family-service';

export const useFamily = () => {
  const context = useAuthContext();
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const createFamily = useCallback(async (name: string) => {
    setActionLoading(true);
    setError(null);
    try {
      await context.createFamily(name);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al crear familia';
      setError(msg);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [context]);

  const joinFamily = useCallback(async (code: string) => {
    setActionLoading(true);
    setError(null);
    try {
      await context.joinFamily(code);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al unirse a familia';
      setError(msg);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [context]);

  const updateName = useCallback(async (familyId: string, newName: string) => {
    setActionLoading(true);
    setError(null);
    try {
      await context.updateFamily(familyId, newName);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar familia';
      setError(msg);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [context]);

  const deleteFamily = useCallback(async (familyId: string) => {
    setActionLoading(true);
    setError(null);
    try {
      await context.deleteFamily(familyId);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error eliminando familia';
      setError(msg);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [context]);

  const validateCode = useCallback(async (code: string) => {
    try {
      return await FamilyService.validateCode(code);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error validando código';
      return { valid: false, error: errorMessage };
    }
  }, []);

  const refreshFamily = useCallback(async () => {
    await context.refreshFamily();
  }, [context]);

  return {
    family: context.family,
    isLoading: context.isLoading || actionLoading,
    error,
    createFamily,
    joinFamily,
    updateName,
    deleteFamily,
    validateCode,
    refreshFamily
  };
};
