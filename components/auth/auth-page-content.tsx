'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Bird } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useFamilia } from '@/hooks/use-familia';

// Lazy load formularios
const LoginForm = dynamic(
  () => import('@/components/auth/login-form').then((mod) => ({ default: mod.LoginForm })),
  {
    loading: () => <FormSkeleton />,
    ssr: false,
  }
);

const ForgotPasswordForm = dynamic(
  () =>
    import('@/components/auth/forgot-password-form').then((mod) => ({
      default: mod.ForgotPasswordForm,
    })),
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
    </div>
  );
}

export function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { familia, isLoading: familiaLoading } = useFamilia();
  const [activeTab, setActiveTab] = useState<'login' | 'forgot-password'>('login');

  useEffect(() => {
    if (isAuthenticated && !authLoading && !familiaLoading) {
      if (familia) {
        router.push('/dashboard');
      } else {
        router.push('/home');
      }
    }
  }, [isAuthenticated, authLoading, familiaLoading, familia, router]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'forgot-password') {
      Promise.resolve().then(() => {
        setActiveTab('forgot-password');
      });
    }
  }, [searchParams]);

  if (authLoading || familiaLoading) {
    return null; // Let the parent's Suspense fallback handle it
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Bird className="w-5 h-5 text-primary-foreground" />
            </div>
                          <h1 className="text-3xl font-bold text-foreground font-serif-custom italic">NuestroNido</h1>          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Gestiona tu hogar de manera fácil y divertida
          </p>
        </div>

        <div className="bg-card rounded-lg shadow-md border border-border p-4 sm:p-5">
          {activeTab === 'login' ? (
            <LoginForm
              onSuccess={() => router.push('/home')}
              onForgotPassword={() => setActiveTab('forgot-password')}
            />
          ) : (
            <ForgotPasswordForm onBack={() => setActiveTab('login')} />
          )}
        </div>

        <div className="text-center mt-4 text-sm sm:text-base text-muted-foreground">
          <p>
            ¿No tienes cuenta?{' '}
            <button
              onClick={() => router.push('/register')}
              className="text-primary hover:underline font-medium"
            >
              Crea una aquí
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
