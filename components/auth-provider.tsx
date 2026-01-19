'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Usuario, AuthContextType, Familia } from '@/lib/types';
import { AuthService } from '@/services/auth-service';
import { TokenService } from '@/services/token-service';
import { FamilyService } from '@/services/family-service';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [familia, setFamilia] = useState<Familia | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = useCallback(async () => {
    try {
      const storedToken = TokenService.getToken();
      const storedUser = TokenService.getUser();
      console.log('AuthProvider checkSession:', { hasToken: !!storedToken, hasUser: !!storedUser });

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUsuario(storedUser);
        setIsAuthenticated(true);
        
        if (storedUser.familiaId) {
             try {
                const fam = await FamilyService.getMyFamily();
                setFamilia(fam);
             } catch (err) {
                console.error("Error loading family in checkSession:", err);
                // Ignore
             }
        }
      } else {
        console.log("No stored session found, clearing.");
        TokenService.clearSession();
      }
    } catch (error) {
      console.error('Error checking session:', error);
      TokenService.clearSession();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await AuthService.login(email, password);
    if (response.success && response.data) {
      const { token: newToken, usuario: newUser } = response.data;
      setToken(newToken);
      setUsuario(newUser);
      setIsAuthenticated(true);
      
      try {
          const fam = await FamilyService.getMyFamily();
          setFamilia(fam);
      } catch {
          setFamilia(null);
      }
    } else {
      throw new Error(response.error?.message || 'Login failed');
    }
  }, []);

  const register = useCallback(async (nombre: string, email: string, password: string) => {
    const response = await AuthService.register(nombre, email, password);
    if (response.success && response.data) {
      const { token: newToken, usuario: newUser } = response.data;
      setToken(newToken);
      setUsuario(newUser);
      setIsAuthenticated(true);
      setFamilia(null);
    } else {
      throw new Error(response.error?.message || 'Register failed');
    }
  }, []);

  const logout = useCallback(() => {
    TokenService.clearSession();
    setUsuario(null);
    setToken(null);
    setFamilia(null);
    setIsAuthenticated(false);
  }, []);

  const crearFamilia = useCallback(async (nombre: string) => {
     const newFam = await FamilyService.create(nombre);
     setFamilia(newFam);
  }, []);

  const unirseAFamilia = useCallback(async (codigo: string) => {
     const newFam = await FamilyService.joinByCode(codigo);
     setFamilia(newFam);
  }, []);

  const actualizarFamilia = useCallback(async (familiaId: string, nombre: string) => {
    const updatedFam = await FamilyService.update(familiaId, nombre);
    setFamilia(updatedFam);
  }, []);

  const eliminarFamilia = useCallback(async (familiaId: string) => {
    await FamilyService.delete(familiaId);
    setFamilia(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        isAuthenticated,
        isLoading,
        familia,
        login,
        register,
        logout,
        crearFamilia,
        unirseAFamilia,
        actualizarFamilia,
        eliminarFamilia
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
