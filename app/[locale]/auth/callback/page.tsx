'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { TokenService } from '@/services/token-service';
import { fetchClient } from '@/lib/api-client';
import { User, Family } from '@/lib/types';
import { UserService } from '@/services/user-service';
import { parseJwt } from '@/lib/jwt-utils';
import { useTranslations } from 'next-intl';

function AuthCallbackPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('Common');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        let token = searchParams.get('token');
        const code = searchParams.get('code');

        if (!token && code) {
           try {
             const response = await fetchClient<{ access_token?: string; data?: { access_token: string } }>(`/api/v1/auth/callback?code=${code}`, {
               requiresAuth: false
             });
             token = response.data?.access_token || response.access_token || null;
           } catch (err) {
             console.error("Error exchanging code:", err);
             throw new Error("Failed to exchange code for token");
           }
        }

        if (!token) {
          throw new Error('No access token received');
        }

        TokenService.setToken(token);
        
        const decoded = parseJwt(token);
        if (!decoded || !decoded.sub) {
           throw new Error('Invalid token');
        }
        
        const userId = decoded.sub;

        const [userResponse, familyResponse] = await Promise.allSettled([
          UserService.getUser(userId),
          fetchClient<Family>('/api/v1/families/me'),
        ]);

        let user: User;

        if (userResponse.status === 'fulfilled') {
          user = userResponse.value;
        } else {
             user = {
              id: userId,
              name: 'User', 
              experience_points: 0,
              level: undefined,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
        }

        if (familyResponse.status === 'fulfilled' && familyResponse.value) {
           user.familyId = familyResponse.value.id;
           TokenService.setUser(user);
           window.location.href = '/dashboard';
        } else {
           TokenService.setUser(user);
           window.location.href = '/home';
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
    <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    }>
      <AuthCallbackPageContent />
    </Suspense>
  );
}
