'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { useFamily } from '@/hooks/use-family';
import { useTranslations } from 'next-intl';

// Lazy load forms
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
  const { family, isLoading: familyLoading } = useFamily(); // Renamed from familia to family
  const [activeTab, setActiveTab] = useState<'login' | 'forgot-password'>('login');
  const t = useTranslations('Auth');

  useEffect(() => {
    if (isAuthenticated && !authLoading && !familyLoading) {
      if (family) {
        // Renamed from familia to family
        router.push('/dashboard');
      } else {
        router.push('/home');
      }
    }
  }, [isAuthenticated, authLoading, familyLoading, family, router]); // Included family in dependency array

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'forgot-password') {
      Promise.resolve().then(() => {
        setActiveTab('forgot-password');
      });
    }
  }, [searchParams]);

  if (authLoading || familyLoading) {
    return null; // Let the parent's Suspense fallback handle it
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center mb-2">
            <Image
              src="/logo.png"
              alt="NuestroNido Logo"
              width={261}
              height={64}
              className="h-16 w-auto object-contain"
              priority
            />
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">
            {t('common.logo_subtitle')}
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
            {t('login.no_account')}{' '}
            <button
              onClick={() => router.push('/register')}
              className="text-primary hover:underline font-medium"
            >
              {t('login.create_one')}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
