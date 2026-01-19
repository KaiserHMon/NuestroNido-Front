'use client';

import { useState, useCallback } from 'react';
import { useAuthContext } from '@/components/auth-provider';
import { FamilyService } from '@/services/family-service';

export const useFamilia = () => {
  const context = useAuthContext();
  const [error, setError] = useState<string | null>(null);
  // We don't maintain local loading/familia state anymore, we use context.
  // But components expect 'isLoading' for family operations?
  // Context has 'isLoading' but that's for session check.
  // We might want local loading for actions.
  const [actionLoading, setActionLoading] = useState(false);

  // Components expect:
  // familia, isLoading, error, crearFamilia, unirseAFamilia, validarCodigo, actualizarNombre, eliminarFamilia
  
  // Note: context.familia is available. context.isLoading is global auth loading.
  // We can map context.isLoading to isLoading, or use a separate logic?
  // Originally useFamilia fetched family on mount. Now Provider does it.
  // So 'isLoading' is effectively context.isLoading (until initial fetch is done).

  const crearFamilia = useCallback(async (nombre: string) => {
    setActionLoading(true);
    setError(null);
    try {
      await context.crearFamilia(nombre);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al crear familia';
      setError(msg);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [context]);

  const unirseAFamilia = useCallback(async (codigo: string) => {
    setActionLoading(true);
    setError(null);
    try {
      await context.unirseAFamilia(codigo);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al unirse a familia';
      setError(msg);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [context]);

  const actualizarNombre = useCallback(async (familiaId: string, nuevoNombre: string) => {
    setActionLoading(true);
    setError(null);
    try {
      await context.actualizarFamilia(familiaId, nuevoNombre);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar familia';
      setError(msg);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [context]);

  const eliminarFamilia = useCallback(async (familiaId: string) => {
    setActionLoading(true);
    setError(null);
    try {
      await context.eliminarFamilia(familiaId);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error eliminando familia';
      setError(msg);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [context]);

  const validarCodigo = useCallback(async (codigo: string) => {
    try {
      return await FamilyService.validateCode(codigo);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error validando código';
      return { valido: false, error: errorMessage };
    }
  }, []);

  const cargarFamiliaGuardada = useCallback(async () => {
    // This is now handled by provider, but if we want to force refresh:
    // We would need a 'refreshFamilia' method in context.
    // For now, let's just ignore or implement if needed.
    // The DashboardLayout calls this.
    // We can assume provider keeps it fresh enough, or implement refresh.
    // Let's leave it no-op or maybe re-fetch via context?
    // Context doesn't expose refresh.
    // Let's rely on actions updating the state.
  }, []);

  return {
    familia: context.familia,
    isLoading: context.isLoading || actionLoading, // Merge global loading and action loading
    error,
    crearFamilia,
    unirseAFamilia,
    actualizarNombre,
    eliminarFamilia,
    validarCodigo,
    cargarFamiliaGuardada // Deprecated mostly
  };
};