'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Bird } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/hooks/use-auth';
import { useFamily } from '@/hooks/use-family';
import { FamilyService } from '@/services/family-service';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const { family, isLoading: familyLoading } = useFamily();
  const [inviteInfo, setInviteInfo] = useState<{
    family_name: string;
    inviter_name: string | null;
  } | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const invite = searchParams.get('invite');
    if (code) {
      sessionStorage.setItem('pendingInvitationCode', code);
    }
    if (invite) {
      sessionStorage.setItem('pendingInviteToken', invite);
      // Try to fetch info to show a friendly message
      FamilyService.getInvitationInfo(invite)
        .then(setInviteInfo)
        .catch((err) => console.error('Could not fetch invite info', err));
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated && !authLoading && !familyLoading) {
      if (family) {
        router.push('/dashboard');
      } else {
        router.push('/home');
      }
    }
  }, [isAuthenticated, authLoading, familyLoading, family, router]);

  if (authLoading || familyLoading) {
    return null; // Let the parent's Suspense fallback handle it
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-2">
            <Image
              src="/logo.png"
              alt="NuestroNido Logo"
              width={1161}
              height={285}
              className="h-16 w-auto object-contain"
              priority
            />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-1">Crear Cuenta</h2>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Gestiona tu hogar de manera fácil y divertida
          </p>
        </div>

        {inviteInfo && (
          <Alert className="mb-6 bg-primary/5 border-primary/20">
            <Bird className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm text-foreground">
              Te estás registrando para unirte a la familia{' '}
              <strong>{inviteInfo.family_name}</strong>
              {inviteInfo.inviter_name && <span> invitada por {inviteInfo.inviter_name}</span>}.
            </AlertDescription>
          </Alert>
        )}

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
