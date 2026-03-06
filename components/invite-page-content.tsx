'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/auth-provider';
import { toast } from 'sonner';
import { InvitationPreview } from '@/components/invitation-preview';
import { Bird } from 'lucide-react';

interface InvitePageContentProps {
  token: string;
}

export function InvitePageContent({ token }: InvitePageContentProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, joinByLink, family } = useAuthContext();
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      sessionStorage.setItem('pendingInviteToken', token);
      router.push(`/register?invite=${token}`);
      return;
    }

    if (family) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, family, router, token]);

  const handleConfirmJoin = async () => {
    setIsJoining(true);
    try {
      await joinByLink(token);
      toast.success('¡Te has unido a la familia!');
      // Give a small delay for state to propagate before navigating
      setTimeout(() => {
        router.push('/dashboard');
      }, 100);
    } catch (error) {
      console.error('Error joining family by link:', error);
      
      let errorMessage = 'El enlace de invitación ha expirado o no es válido.';
      if (error instanceof Error) {
        if (error.message.toLowerCase().includes('already member') || 
            error.message.toLowerCase().includes('ya eres miembro')) {
          toast.info('Ya eres miembro de esta familia.');
          router.push('/dashboard');
          return;
        }
      }
      
      toast.error(errorMessage);
      setIsJoining(false);
      // Don't redirect to home immediately on error, let the user see the message
    }
  };

  const handleCancel = () => {
    router.push('/home');
  };

  if (isLoading || !isAuthenticated || family) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto animate-pulse">
          <Bird className="w-8 h-8 text-primary-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {isJoining ? (
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto animate-bounce">
            <Bird className="w-10 h-10 text-primary-foreground" />
          </div>
          <div className="space-y-2">
            <p className="text-foreground text-xl font-bold">Uniéndote al nido...</p>
            <p className="text-muted-foreground">Estamos preparando tu nuevo espacio familiar</p>
          </div>
        </div>
      ) : (
        <InvitationPreview token={token} onConfirm={handleConfirmJoin} onCancel={handleCancel} />
      )}
    </div>
  );
}
