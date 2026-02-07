'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Usuario, AuthContextType, Familia, Level } from '@/lib/types';
import { AuthService } from '@/services/auth-service';
import { TokenService } from '@/services/token-service';
import { FamilyService } from '@/services/family-service';
import { LevelService } from '@/services/level-service';
import { UserService } from '@/services/user-service';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [familia, setFamilia] = useState<Familia | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    LevelService.getLevels().then(data => {
      const sorted = [...data].sort((a, b) => a.level_number - b.level_number);
      setLevels(sorted);
    }).catch(console.error);
  }, []);

  const checkSession = useCallback(async () => {
    try {
      const storedToken = TokenService.getToken();
      const storedUser = TokenService.getUser();
      console.log('AuthProvider checkSession:', { hasToken: !!storedToken, hasUser: !!storedUser });

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUsuario(storedUser);
        setIsAuthenticated(true);
        
        try {
          const fam = await FamilyService.getMyFamily();
          if (fam) {
            setFamilia(fam);
            // Self-heal: If user lacks familiaId but has a family, update it.
            if (!storedUser.familiaId) {
               const updatedUser = { ...storedUser, familiaId: fam.id };
               setUsuario(updatedUser);
               TokenService.setUser(updatedUser);
            }
          }
        } catch (err) {
           console.error("Error loading family in checkSession:", err);
           // Ignore 404 or other errors, user just might not have a family
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
    // No redirigimos aquí directamente para mantener el Provider puro, 
    // la redirección se maneja en los hooks o layouts.
  }, []);

  const crearFamilia = useCallback(async (nombre: string) => {
     const newFam = await FamilyService.create(nombre);
     setFamilia(newFam);
     if (usuario) {
       const updatedUser = { ...usuario, familiaId: newFam.id };
       setUsuario(updatedUser);
       TokenService.setUser(updatedUser);
     }
  }, [usuario]);

  const unirseAFamilia = useCallback(async (codigo: string) => {
    try {
      const newFam = await FamilyService.joinByCode(codigo);
      setFamilia(newFam);
      if (usuario) {
        // Refresh full user profile to get potential color/level updates from backend
        const updatedUser = await UserService.getUser(usuario.id);
        const userWithFamily = { ...updatedUser, familiaId: newFam.id };
        setUsuario(userWithFamily);
        TokenService.setUser(userWithFamily);
      }
    } catch (error) {
      // If error is 400 and message contains "already member", treat as success
      const errorMsg = error instanceof Error ? error.message : '';
      if (errorMsg.toLowerCase().includes('already member') || errorMsg.toLowerCase().includes('ya eres miembro')) {
        const fam = await FamilyService.getMyFamily();
        if (fam) {
          setFamilia(fam);
          if (usuario) {
            const updatedUser = await UserService.getUser(usuario.id);
            const userWithFamily = { ...updatedUser, familiaId: fam.id };
            setUsuario(userWithFamily);
            TokenService.setUser(userWithFamily);
          }
          return;
        }
      }
      throw error;
    }
  }, [usuario]);

  const unirsePorLink = useCallback(async (token: string) => {
    try {
      const newFam = await FamilyService.joinByLink(token);
      setFamilia(newFam);
      if (usuario) {
        // Refresh full user profile
        const updatedUser = await UserService.getUser(usuario.id);
        const userWithFamily = { ...updatedUser, familiaId: newFam.id };
        setUsuario(userWithFamily);
        TokenService.setUser(userWithFamily);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '';
      if (errorMsg.toLowerCase().includes('already member') || errorMsg.toLowerCase().includes('ya eres miembro')) {
        const fam = await FamilyService.getMyFamily();
        if (fam) {
          setFamilia(fam);
          if (usuario) {
            const updatedUser = await UserService.getUser(usuario.id);
            const userWithFamily = { ...updatedUser, familiaId: fam.id };
            setUsuario(userWithFamily);
            TokenService.setUser(userWithFamily);
          }
          return;
        }
      }
      throw error;
    }
  }, [usuario]);

  const actualizarFamilia = useCallback(async (familiaId: string, nombre: string) => {
    const updatedFam = await FamilyService.update(familiaId, nombre);
    setFamilia(updatedFam);
  }, []);

  const eliminarFamilia = useCallback(async (familiaId: string) => {
    await FamilyService.delete(familiaId);
    setFamilia(null);
    if (usuario) {
      const updatedUser = { ...usuario, familiaId: undefined };
      setUsuario(updatedUser);
      TokenService.setUser(updatedUser);
    }
  }, [usuario]);

  const refreshFamily = useCallback(async () => {
    try {
      const fam = await FamilyService.getMyFamily();
      setFamilia(fam);
    } catch (error) {
      console.error('Error refreshing family:', error);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        isAuthenticated,
        isLoading,
        familia,
        levels,
        login,
        register,
        logout,
        crearFamilia,
        unirseAFamilia,
        unirsePorLink,
        actualizarFamilia,
        eliminarFamilia,
        refreshFamily
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
