'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, AuthContextType, Family, Level } from '@/lib/types';
import { AuthService } from '@/services/auth-service';
import { TokenService } from '@/services/token-service';
import { FamilyService } from '@/services/family-service';
import { LevelService } from '@/services/level-service';
import { UserService } from '@/services/user-service';
import { subscribeToPushNotifications } from '@/services/push-notification-service';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [family, setFamily] = useState<Family | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to push notifications when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        subscribeToPushNotifications();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    LevelService.getLevels()
      .then((data) => {
        const sorted = [...data].sort((a, b) => a.level_number - b.level_number);
        setLevels(sorted);
      })
      .catch(console.error);
  }, []);

  const checkSession = useCallback(async () => {
    try {
      // First check if there's a cached user to avoid showing a blank screen
      const storedUser = TokenService.getUser();
      if (!storedUser) {
        setIsLoading(false);
        return;
      }

      setUser(storedUser);
      setIsAuthenticated(true);

      // Re-validate session with backend
      const me = await UserService.getMe();
      if (me) {
        setUser(me);
        setIsAuthenticated(true);
        TokenService.setUser(me);

        try {
          const fam = await FamilyService.getMyFamily();
          if (fam) {
            setFamily(fam);
            if (!me.familyId) {
              const updatedUser = { ...me, familyId: fam.id };
              setUser(updatedUser);
              TokenService.setUser(updatedUser);
            }
          } else {
            setFamily(null);
          }
        } catch (err) {
          console.error('Error loading family in checkSession:', err);
        }
      } else {
        TokenService.clearSession();
        setUser(null);
        setFamily(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      // If 401, clear session. Other errors might be network issues.
      const status =
        error && typeof error === 'object' && 'status' in error
          ? (error as { status: number }).status
          : null;
      if (status === 401) {
        TokenService.clearSession();
        setUser(null);
        setFamily(null);
        setIsAuthenticated(false);
      }
      console.error('Error checking session:', error);
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
      setFamily(null);
      setIsAuthenticated(false);
    };

    const handleAuthLogout = () => {
      performLogout();
    };

    window.addEventListener('auth-logout', handleAuthLogout);

    return () => {
      window.removeEventListener('auth-logout', handleAuthLogout);
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await AuthService.login(email, password);
    if (response.success && response.data) {
      const { user: newUser } = response.data;
      setUser(newUser);
      setIsAuthenticated(true);

      try {
        const fam = await FamilyService.getMyFamily();
        setFamily(fam);
      } catch (error) {
        // User may not have a family yet, log error and reset state
        console.error('Error fetching family during login:', error);
        setFamily(null);
      }
    } else {
      throw new Error(response.error?.message || 'Login failed');
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const response = await AuthService.register(name, email, password);
    if (response.success && response.data) {
      const { user: newUser } = response.data;
      setUser(newUser);
      setIsAuthenticated(true);
      setFamily(null);
    } else {
      throw new Error(response.error?.message || 'Register failed');
    }
  }, []);

  const logout = useCallback(async () => {
    await AuthService.logout();
    setUser(null);
    setFamily(null);
    setIsAuthenticated(false);
  }, []);

  const createFamily = useCallback(
    async (name: string) => {
      try {
        const newFam = await FamilyService.create(name);
        const refreshedFam = await FamilyService.getMyFamily(true);
        setFamily(refreshedFam || newFam);

        if (user) {
          const updatedUserFromApi = await UserService.getMe();
          const userWithFamily = { ...updatedUserFromApi, familyId: (refreshedFam || newFam).id };
          setUser(userWithFamily);
          TokenService.setUser(userWithFamily);
        }
      } catch (error) {
        console.error('Error creating family in provider:', error);
        throw error;
      }
    },
    [user]
  );

  const joinByCode = useCallback(
    async (code: string) => {
      try {
        const newFam = await FamilyService.joinByCode(code);
        const refreshedFam = await FamilyService.getMyFamily(true);
        setFamily(refreshedFam || newFam);
        if (user) {
          const updatedUserFromApi = await UserService.getMe();
          const userWithFamily = { ...updatedUserFromApi, familyId: (refreshedFam || newFam).id };
          setUser(userWithFamily);
          TokenService.setUser(userWithFamily);
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : '';
        if (
          errorMsg.toLowerCase().includes('already member') ||
          errorMsg.toLowerCase().includes('ya eres miembro')
        ) {
          const fam = await FamilyService.getMyFamily(true);
          if (fam) {
            setFamily(fam);
            if (user) {
              const updatedUserFromApi = await UserService.getMe();
              const userWithFamily = { ...updatedUserFromApi, familyId: fam.id };
              setUser(userWithFamily);
              TokenService.setUser(userWithFamily);
            }
            return;
          }
        }
        throw error;
      }
    },
    [user]
  );

  const joinByLink = useCallback(
    async (token: string) => {
      try {
        // 1. Join and get the family object immediately
        const newFam = await FamilyService.joinByLink(token);

        // 2. Set the family in state immediately to avoid redirection issues
        setFamily(newFam);

        // 3. Update user local state if they are logged in
        if (user) {
          const userWithFamily = { ...user, familyId: newFam.id };
          setUser(userWithFamily);
          TokenService.setUser(userWithFamily);
        }

        // 4. Force a refresh and wait for it to ensure consistency
        try {
          const refreshed = await FamilyService.getMyFamily(true);
          if (refreshed) setFamily(refreshed);
        } catch (err) {
          console.warn("Initial family refresh failed after joining, using optimistic state:", err);
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : '';
        if (
          errorMsg.toLowerCase().includes('already member') ||
          errorMsg.toLowerCase().includes('ya eres miembro')
        ) {
          const fam = await FamilyService.getMyFamily(true);
          if (fam) {
            setFamily(fam);
            if (user) {
              const userWithFamily = { ...user, familyId: fam.id };
              setUser(userWithFamily);
              TokenService.setUser(userWithFamily);
            }
          }
          return;
        }
        throw error;
      }
    },
    [user]
  );

  const updateFamily = useCallback(async (familyId: string, name: string) => {
    const updatedFam = await FamilyService.update(familyId, name);
    setFamily(updatedFam);
  }, []);

  const deleteFamily = useCallback(
    async (familyId: string) => {
      await FamilyService.delete(familyId);
      setFamily(null);
      if (user) {
        const updatedUser = { ...user, familyId: undefined };
        setUser(updatedUser);
        TokenService.setUser(updatedUser);
      }
    },
    [user]
  );

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
        refreshFamily,
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
