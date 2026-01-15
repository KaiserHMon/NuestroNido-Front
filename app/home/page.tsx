'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bird, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { CrearFamiliaCard } from '@/components/familia/crear-familia-card';
import { UnirseAFamiliaCard } from '@/components/familia/unirse-familia-card';
import { SupportDialog } from '@/components/dialogs/support-dialog';
import { Familia } from '@/lib/types';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, usuario, isLoading } = useAuth();
  const [_familia, _setFamilia] = useState<Familia | null>(null);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!isLoading && isAuthenticated) {
      const familiaGuardada = localStorage.getItem('familia');
      if (familiaGuardada) {
        Promise.resolve().then(() => {
          _setFamilia(JSON.parse(familiaGuardada));
          router.push('/dashboard');
        });
      }
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
            <Bird className="w-8 h-8 text-primary-foreground animate-bounce" />
          </div>
          <p className="text-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !usuario) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-card bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center">
                <Bird className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground">NuestroNido</h1>
            </div>
            
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Volver al inicio</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
            ¡Bienvenido, {usuario.nombre}!
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Selecciona cómo deseas comenzar con tu familia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto items-start">
          <CrearFamiliaCard onSuccess={() => router.push('/dashboard')} />
          <UnirseAFamiliaCard onSuccess={() => router.push('/dashboard')} />
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground text-sm">
            ¿Necesitas ayuda?{' '}
            <button
              onClick={() => setIsSupportOpen(true)}
              className="text-primary hover:underline font-medium"
            >
              Contacta con soporte
            </button>
          </p>
        </div>
      </main>

      <SupportDialog open={isSupportOpen} onOpenChange={setIsSupportOpen} />
    </div>
  );
}
