'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import logo from '@/app/assets/logo.png';

export function LandingHeader() {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout, user, family } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const dashboardRoute = user?.familyId || family ? '/dashboard' : '/home';

  if (isLoading) {
    return (
      <header className="border-b border-card bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src={logo}
                alt="NuestroNido Logo"
                className="h-8 sm:h-12 w-auto object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-card bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity shrink-0">
            <Image
              src={logo}
              alt="NuestroNido Logo"
              className="h-8 sm:h-12 w-auto object-contain"
              priority
            />
          </Link>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link href={dashboardRoute}>
                  <Button
                    variant="ghost"
                    className="text-primary text-sm sm:text-base px-3 sm:px-4 hover:bg-primary/10 flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Dashboard</span>
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-destructive text-sm sm:text-base px-3 sm:px-4 hover:bg-destructive/10 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Salir</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-foreground text-sm sm:text-lg px-3 sm:px-5 hover:bg-primary/10"
                  >
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-br from-primary via-primary to-primary/80 hover:shadow-lg hover:shadow-primary/50 text-sm sm:text-lg px-4 sm:px-6 py-5 sm:py-6 shadow-md shadow-primary/30 transition-all duration-300 active:scale-95">
                    Comenzar
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
