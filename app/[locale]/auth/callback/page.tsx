'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { TokenService } from '@/services/token-service';
import { fetchClient } from '@/lib/api-client';
import { Family } from '@/lib/types';
import { UserService } from '@/services/user-service';
import { FamilyService } from '@/services/family-service';
import { useTranslations } from 'next-intl';

function AuthCallbackPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('Common');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');

        if (code) {
          try {
            // This call should set the HttpOnly cookies in the browser
            await fetchClient(`/api/v1/auth/callback?code=${code}`, {
              requiresAuth: false,
            });
          } catch (err) {
            console.error('Error exchanging code:', err);
            throw new Error('Failed to exchange code for session');
          }
        }

        // Now fetch the current user to confirm authentication and get data
        const user = await UserService.getMe();

        if (!user) {
          throw new Error('User data could not be retrieved');
        }

        const familyResponse = await FamilyService.getMyFamily();

        if (familyResponse) {
          user.familyId = familyResponse.id;
          TokenService.setUser(user);
          window.location.href = '/dashboard';
        } else {
          TokenService.setUser(user);
          window.location.href = '/home';
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        router.push({
          pathname: '/login',
          query: { error: 'auth_failed' },
        });
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
