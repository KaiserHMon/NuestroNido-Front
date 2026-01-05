/**
 * Hook personalizado para gestión de familia
 * Maneja creación, unión, edición y eliminación de familia
 */

'use client';

import { useState, useCallback } from 'react';
import { Familia, ApiResponse } from '@/lib/types';
import { generarCodigoInvitacion } from '@/lib/validation';

interface FamiliaState {
  familia: Familia | null;
  isLoading: boolean;
  error: string | null;
}

export const useFamilia = () => {
  const [state, setState] = useState<FamiliaState>({
    familia: null,
    isLoading: false,
    error: null,
  });

  // Cargar familia del localStorage al inicializar
  const cargarFamiliaGuardada = useCallback(() => {
    try {
      const familiaStr = localStorage.getItem('familia');
      if (familiaStr) {
        const familia = JSON.parse(familiaStr);
        setState((prev) => ({ ...prev, familia }));
      }
    } catch (error) {
      console.error('Error cargando familia guardada:', error);
    }
  }, []);

  const crearFamilia = useCallback(async (nombre: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      const _token = localStorage.getItem('auth_token');

      // Simulación hasta que el backend esté disponible
      const mockResponse: ApiResponse<Familia> = {
        success: true,
        data: {
          id: 'familia-' + Date.now(),
          nombre,
          codigoInvitacion: generarCodigoInvitacion(),
          creadorId: usuario.id,
          miembros: [
            {
              id: usuario.id,
              nombre: usuario.nombre,
              color: {
                id: 'blue',
                nombre: 'Azul',
                bg: '#4ECDC4',
                text: '#FFFFFF',
                accent: '#2FA09F',
                wcagContrast: 4.7,
              },
              puntos: 0,
              rolId: 'creador',
              familiaId: '',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          maxMiembros: 10,
          plan: 'free',
          maxNotas: 3,
          activa: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      if (mockResponse.success && mockResponse.data) {
        const familia = mockResponse.data;
        localStorage.setItem('familia', JSON.stringify(familia));

        setState({
          familia,
          isLoading: false,
          error: null,
        });

        return familia;
      }
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
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

      // Simulación hasta que el backend esté disponible
      const mockResponse: ApiResponse<Familia> = {
        success: true,
        data: {
          id: 'familia-mock',
          nombre: 'Familia Ejemplo',
          codigoInvitacion: codigo.toUpperCase(),
          creadorId: 'user-other',
          miembros: [
            {
              id: 'user-other',
              nombre: 'Otro Usuario',
              color: {
                id: 'red',
                nombre: 'Rojo',
                bg: '#FF6B6B',
                text: '#FFFFFF',
                accent: '#FF5252',
                wcagContrast: 4.5,
              },
              puntos: 100,
              rolId: 'creador',
              familiaId: '',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: usuario.id,
              nombre: usuario.nombre,
              color: {
                id: 'green',
                nombre: 'Verde',
                bg: '#95E1D3',
                text: '#1A1A1A',
                accent: '#6BBF9F',
                wcagContrast: 5.2,
              },
              puntos: 0,
              rolId: 'miembro',
              familiaId: '',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          maxMiembros: 10,
          plan: 'free',
          maxNotas: 3,
          activa: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      if (mockResponse.success && mockResponse.data) {
        const familia = mockResponse.data;
        localStorage.setItem('familia', JSON.stringify(familia));

        setState({
          familia,
          isLoading: false,
          error: null,
        });

        return familia;
      }
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
      // Simulación hasta que el backend esté disponible
      if (codigo.length < 6) {
        return { valido: false, error: 'Código inválido' };
      }

      return {
        valido: true,
        nombreFamilia: 'Familia Ejemplo',
        miembrosActuales: 2,
        maxMiembros: 10,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error validando código';
      return { valido: false, error: errorMessage };
    }
  }, []);

  const actualizarNombre = useCallback(async (familiaId: string, nuevoNombre: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulación hasta que el backend esté disponible
      const familiaGuardada = JSON.parse(localStorage.getItem('familia') || '{}');

      const familiaActualizada: Familia = {
        ...familiaGuardada,
        nombre: nuevoNombre,
        updatedAt: new Date(),
      };

      localStorage.setItem('familia', JSON.stringify(familiaActualizada));

      setState({
        familia: familiaActualizada,
        isLoading: false,
        error: null,
      });

      return familiaActualizada;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error actualizando familia';
      setState({
        familia: null,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  }, []);

  const eliminarFamilia = useCallback(async (_familiaId: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulación hasta que el backend esté disponible
      localStorage.removeItem('familia');

      setState({
        familia: null,
        isLoading: false,
        error: null,
      });

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error eliminando familia';
      setState({
        familia: null,
        isLoading: false,
        error: errorMessage,
      });
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
