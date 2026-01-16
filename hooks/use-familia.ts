/**
 * Hook personalizado para gestión de familia
 * Maneja creación, unión, edición y eliminación de familia
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { Familia } from '@/lib/types';
import { FamilyService } from '@/services/family-service';

interface FamiliaState {
  familia: Familia | null;
  isLoading: boolean;
  error: string | null;
}

export const useFamilia = () => {
  const [state, setState] = useState<FamiliaState>({
    familia: null,
    isLoading: true, // Start loading to check initial family status
    error: null,
  });

  const cargarFamiliaGuardada = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const familia = await FamilyService.getMyFamily();
      setState({
        familia,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error loading family:', error);
      setState((prev) => ({ ...prev, isLoading: false }));
      // We don't set error here as having no family is a valid state
    }
  }, []);

  // Load family on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarFamiliaGuardada();
  }, [cargarFamiliaGuardada]);

  const crearFamilia = useCallback(async (nombre: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const familia = await FamilyService.create(nombre);

      setState({
        familia,
        isLoading: false,
        error: null,
      });

      return familia;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear familia';
      setState({
        familia: null,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  }, []);

  const unirseAFamilia = useCallback(async (codigo: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const familia = await FamilyService.joinByCode(codigo);

      setState({
        familia,
        isLoading: false,
        error: null,
      });

      return familia;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al unirse a familia';
      setState({
        familia: null,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  }, []);

  const validarCodigo = useCallback(async (codigo: string) => {
    try {
      return await FamilyService.validateCode(codigo);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error validando código';
      return { valido: false, error: errorMessage };
    }
  }, []);

  const actualizarNombre = useCallback(async (familiaId: string, nuevoNombre: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const familiaActualizada = await FamilyService.update(familiaId, nuevoNombre);

      setState({
        familia: familiaActualizada,
        isLoading: false,
        error: null,
      });

      return familiaActualizada;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error actualizando familia';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const eliminarFamilia = useCallback(async (familiaId: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await FamilyService.delete(familiaId);

      setState({
        familia: null,
        isLoading: false,
        error: null,
      });

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error eliminando familia';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  return {
    ...state,
    cargarFamiliaGuardada,
    crearFamilia,
    unirseAFamilia,
    validarCodigo,
    actualizarNombre,
    eliminarFamilia,
  };
};
