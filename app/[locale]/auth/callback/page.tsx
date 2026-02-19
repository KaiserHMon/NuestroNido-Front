'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { AuthService } from '@/services/auth-service';
import { fetchClient } from '@/lib/api-client';
import { useTranslations } from 'next-intl';

function AuthCallbackPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('Common');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get('token');
        const code = searchParams.get('code');

        if (token || code) {
          // Call local proxy to set session cookies
          const params = new URLSearchParams();
          if (token) params.set('token', token);
          if (code) params.set('code', code);

          await fetchClient(`/api/auth/callback?${params.toString()}`);

          // Verify session via cookie and get user data
          const user = await AuthService.getMe();

          if (user) {
             if (user.familyId) {
               window.location.href = '/dashboard';
             } else {
               window.location.href = '/home';
             }
          } else {
            throw new Error('Failed to verify session');
          }
        } else {
           router.push('/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        router.push('/login?error=auth_failed');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">{t('authenticating')}</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AuthCallbackPageContent />
    </Suspense>
  );
}
