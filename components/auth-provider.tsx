'use client';

/* global StorageEvent */
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, AuthContextType, Family, Level } from '@/lib/types';
import { AuthService } from '@/services/auth-service';
import { TokenService } from '@/services/token-service';
import { FamilyService } from '@/services/family-service';
import { LevelService } from '@/services/level-service';
import { UserService } from '@/services/user-service';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [family, setFamily] = useState<Family | null>(null);
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

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        setIsAuthenticated(true);
        
        try {
          const fam = await FamilyService.getMyFamily();
          if (fam) {
            setFamily(fam);
            if (!storedUser.familyId) {
               const updatedUser = { ...storedUser, familyId: fam.id };
               setUser(updatedUser);
               TokenService.setUser(updatedUser);
            }
          } else {
            setFamily(null);
          }
        } catch (err) {
           console.error("Error loading family in checkSession:", err);
        }
      } else {
        TokenService.clearSession();
        setUser(null);
        setToken(null);
        setFamily(null);
        setIsAuthenticated(false);
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

  useEffect(() => {
    const performLogout = () => {
      setUser(null);
      setToken(null);
      setFamily(null);
      setIsAuthenticated(false);
    };

    const handleStorageChange = (e: Event) => {
      const storageEvent = e as StorageEvent;
      if (storageEvent.key === 'auth_token' && !storageEvent.newValue) {
        performLogout();
      }
    };

    const handleAuthLogout = () => {
      performLogout();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-logout', handleAuthLogout);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-logout', handleAuthLogout);
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await AuthService.login(email, password);
    if (response.success && response.data) {
      const { token: newToken, user: newUser } = response.data;
      setToken(newToken);
      setUser(newUser);
      setIsAuthenticated(true);
      
      try {
          const fam = await FamilyService.getMyFamily();
          setFamily(fam);
      } catch {
          setFamily(null);
      }
    } else {
      throw new Error(response.error?.message || 'Login failed');
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const response = await AuthService.register(name, email, password);
    if (response.success && response.data) {
      const { token: newToken, user: newUser } = response.data;
      setToken(newToken);
      setUser(newUser);
      setIsAuthenticated(true);
      setFamily(null);
    } else {
      throw new Error(response.error?.message || 'Register failed');
    }
  }, []);

  const logout = useCallback(() => {
    TokenService.clearSession();
    setUser(null);
    setToken(null);
    setFamily(null);
    setIsAuthenticated(false);
  }, []);

  const createFamily = useCallback(async (name: string) => {
    try {
      const newFam = await FamilyService.create(name);
      // Force refresh to get latest state from DB
      const refreshedFam = await FamilyService.getMyFamily(true);
      setFamily(refreshedFam || newFam);
      
      if (user) {
        const updatedUserFromApi = await UserService.getUser(user.id);
        const userWithFamily = { ...updatedUserFromApi, familyId: (refreshedFam || newFam).id };
        setUser(userWithFamily);
        TokenService.setUser(userWithFamily);
      }
    } catch (error) {
      console.error('Error creating family in provider:', error);
      throw error;
    }
  }, [user]);

  const joinByCode = useCallback(async (code: string) => {
    try {
      const newFam = await FamilyService.joinByCode(code);
      const refreshedFam = await FamilyService.getMyFamily(true);
      setFamily(refreshedFam || newFam);
      if (user) {
        const updatedUserFromApi = await UserService.getUser(user.id);
        const userWithFamily = { ...updatedUserFromApi, familyId: (refreshedFam || newFam).id };
        setUser(userWithFamily);
        TokenService.setUser(userWithFamily);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '';
      if (errorMsg.toLowerCase().includes('already member') || errorMsg.toLowerCase().includes('ya eres miembro')) {
        const fam = await FamilyService.getMyFamily(true);
        if (fam) {
          setFamily(fam);
          if (user) {
            const updatedUserFromApi = await UserService.getUser(user.id);
            const userWithFamily = { ...updatedUserFromApi, familyId: fam.id };
            setUser(userWithFamily);
            TokenService.setUser(userWithFamily);
          }
          return;
        }
      }
      throw error;
    }
  }, [user]);

  const joinByLink = useCallback(async (token: string) => {
    try {
      const newFam = await FamilyService.joinByLink(token);
      const refreshedFam = await FamilyService.getMyFamily(true);
      setFamily(refreshedFam || newFam);
      if (user) {
        const updatedUserFromApi = await UserService.getUser(user.id);
        const userWithFamily = { ...updatedUserFromApi, familyId: (refreshedFam || newFam).id };
        setUser(userWithFamily);
        TokenService.setUser(userWithFamily);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '';
      if (errorMsg.toLowerCase().includes('already member') || errorMsg.toLowerCase().includes('ya eres miembro')) {
        const fam = await FamilyService.getMyFamily(true);
        if (fam) {
          setFamily(fam);
          if (user) {
            const updatedUserFromApi = await UserService.getUser(user.id);
            const userWithFamily = { ...updatedUserFromApi, familyId: fam.id };
            setUser(userWithFamily);
            TokenService.setUser(userWithFamily);
          }
          return;
        }
      }
      throw error;
    }
  }, [user]);

  const updateFamily = useCallback(async (familyId: string, name: string) => {
    const updatedFam = await FamilyService.update(familyId, name);
    setFamily(updatedFam);
  }, []);

  const deleteFamily = useCallback(async (familyId: string) => {
    await FamilyService.delete(familyId);
    setFamily(null);
    if (user) {
      const updatedUser = { ...user, familyId: undefined };
      setUser(updatedUser);
      TokenService.setUser(updatedUser);
    }
  }, [user]);

  const refreshFamily = useCallback(async () => {
    try {
      const fam = await FamilyService.getMyFamily();
      setFamily(fam);
    } catch (error) {
      console.error('Error refreshing family:', error);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        family,
        levels,
        login,
        register,
        logout,
        createFamily,
        joinFamily: joinByCode,
        joinByLink,
        updateFamily,
        deleteFamily,
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
