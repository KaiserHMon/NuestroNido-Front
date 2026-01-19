'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TokenService } from '@/services/token-service';
import { fetchClient } from '@/lib/api-client';
import { Usuario, Familia } from '@/lib/types';
import { UserService } from '@/services/user-service';
import { parseJwt } from '@/lib/jwt-utils';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get('token');
        const refreshToken = searchParams.get('refresh_token');

        if (!token) {
          throw new Error('No access token received');
        }

        // Store tokens
        TokenService.setToken(token);
        // If you have a mechanism for refresh tokens, store it too. 
        // TokenService currently might only support access token based on previous files read.
        
        // Decode token to get user ID
        const decoded = parseJwt(token);
        if (!decoded || !decoded.sub) {
           throw new Error('Invalid token');
        }
        
        const userId = decoded.sub;

        // Fetch user details and family details
        const [userResponse, familyResponse] = await Promise.allSettled([
          UserService.getUser(userId),
          fetchClient<Familia>('/api/families/me'),
        ]);

        let usuario: Usuario;

        if (userResponse.status === 'fulfilled') {
          usuario = userResponse.value;
        } else {
             // Fallback if user fetch fails
             usuario = {
              id: userId,
              nombre: 'Usuario', 
              createdAt: new Date(),
              updatedAt: new Date(),
            };
        }

        if (familyResponse.status === 'fulfilled' && familyResponse.value) {
           usuario.familiaId = familyResponse.value.id;
           TokenService.setUser(usuario);
           router.push('/dashboard');
        } else {
           TokenService.setUser(usuario);
           router.push('/home');
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
        <p className="text-muted-foreground">Autenticando...</p>
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
      <AuthCallbackContent />
    </Suspense>
  );
}
