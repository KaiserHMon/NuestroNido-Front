'use client';

import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import logo from '@/public/nuestro-nido-logo.png';
import { useTranslations } from 'next-intl';

export function LandingHeader() {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout, user, family } = useAuth();
  const t = useTranslations('Landing.header');

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const dashboardRoute = user?.familyId || family ? '/dashboard' : '/home';

  if (isLoading) {
    return (
      <header className="border-b border-card bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={logo}
                alt="NuestroNido Logo"
                className="h-8 sm:h-12 lg:h-14 w-auto object-contain"
                priority
              />{' '}
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-card bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center hover:opacity-80 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <Image
              src={logo}
              alt="NuestroNido Logo"
              className="h-8 sm:h-12 lg:h-14 w-auto object-contain"
              priority
            />{' '}
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-4">
            {isAuthenticated ? (
              <>
                <Link href={dashboardRoute}>
                  <Button
                    variant="ghost"
                    className="text-primary font-bold rounded-full hover:bg-primary/10 flex items-center gap-2 h-9 sm:h-11 px-3 sm:px-6 text-sm sm:text-lg"
                  >
                    <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">{t('dashboard')}</span>
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-destructive font-bold rounded-full hover:bg-destructive/10 flex items-center gap-2 h-9 sm:h-11 px-3 sm:px-6 text-sm sm:text-lg"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{t('logout')}</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-foreground font-bold rounded-full hover:bg-primary/10 h-9 sm:h-11 px-3.5 sm:px-7 text-sm sm:text-lg"
                  >
                    {t('login')}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full shadow-tactile h-9 sm:h-11 px-4 sm:px-9 text-sm sm:text-lg transition-all hover:scale-105 active:scale-95">
                    {t('start')}
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
