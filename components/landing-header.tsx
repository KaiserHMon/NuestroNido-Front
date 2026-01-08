'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bird, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

export function LandingHeader() {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <header className="border-b border-card bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center">
                <Bird className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <span className="text-base sm:text-lg font-bold text-foreground">NuestroNido</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-card bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center">
              <Bird className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
            </div>
            <span className="text-base sm:text-lg font-bold text-foreground">NuestroNido</span>
          </Link>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 sm:h-10 sm:w-10 p-0 hover:bg-primary/10 text-primary"
                    title="Dashboard"
                  >
                    <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="h-8 w-8 sm:h-10 sm:w-10 p-0 hover:bg-destructive/10 text-destructive"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-foreground text-sm sm:text-base px-2 sm:px-4 hover:bg-primary/10">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-br from-primary via-primary to-primary/80 hover:shadow-lg hover:shadow-primary/50 text-sm sm:text-base px-3 sm:px-4 shadow-md shadow-primary/30 transition-all duration-300 active:scale-95">
                    <span className="hidden sm:inline">Comenzar Gratis</span>
                    <span className="sm:hidden">Comenzar</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
