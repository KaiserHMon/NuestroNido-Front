'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Bird } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/hooks/use-auth';
import { useFamilia } from '@/hooks/use-familia';

// Lazy load form
const RegisterForm = dynamic(
  () => import('@/components/auth/register-form').then((mod) => ({ default: mod.RegisterForm })),
  {
    loading: () => <FormSkeleton />,
    ssr: false,
  }
);

function FormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-10 bg-muted rounded animate-pulse" />
      <div className="h-10 bg-muted rounded animate-pulse" />
      <div className="h-10 bg-muted rounded animate-pulse" />
      <div className="h-10 bg-muted rounded animate-pulse" />
    </div>
  );
}

export function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { familia, isLoading: familiaLoading } = useFamilia();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      sessionStorage.setItem('pendingInvitationCode', code);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated && !authLoading && !familiaLoading) {
      if (familia) {
        router.push('/dashboard');
      } else {
        router.push('/home');
      }
    }
  }, [isAuthenticated, authLoading, familiaLoading, familia, router]);

  if (authLoading || familiaLoading) {
    return null; // Let the parent's Suspense fallback handle it
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Bird className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">NuestroNido</h1>
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-1">Crear Cuenta</h2>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Gestiona tu hogar de manera fácil y divertida
          </p>
        </div>

        <div className="bg-card rounded-lg shadow-md border border-border p-5">
          <RegisterForm onSuccess={() => router.push('/home')} />
        </div>

        <div className="text-center mt-4 text-sm sm:text-base text-muted-foreground space-y-2">
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
