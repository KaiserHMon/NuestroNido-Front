'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bird } from 'lucide-react';
import { RegisterForm } from '@/components/auth/register-form';
import { useAuth } from '@/hooks/use-auth';

export function RegisterPageContent() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      // Verificar si tiene familia
      const familia = localStorage.getItem('familia');
      if (familia) {
        router.push('/dashboard');
      } else {
        router.push('/home');
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

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Bird className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">NuestroNido</h1>
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-1">Crear Cuenta</h2>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Gestiona tu familia de manera fácil y divertida
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-card rounded-lg shadow-md border border-border p-5">
          <RegisterForm onSuccess={() => router.push('/home')} />
        </div>

        {/* Footer Links */}
        <div className="text-center mt-4 text-xs text-muted-foreground space-y-2">
          <p>Al continuar, aceptas nuestros términos de servicio</p>
          <p>
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-primary hover:underline font-medium"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
