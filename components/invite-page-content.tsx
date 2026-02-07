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
  const { isAuthenticated, isLoading, unirsePorLink, familia } = useAuthContext();
  const [isJoining, setIsJoining] = useState(false);

  // Estado para controlar si mostramos la preview o estamos procesando
  // Si no está autenticado, redirigimos a registro inmediatamente
  // Si está autenticado, mostramos preview.

  useEffect(() => {
    // Si aún está cargando el estado inicial de auth, no hacemos nada
    if (isLoading) return;

    // Si NO está autenticado, guardamos el token y mandamos al registro
    if (!isAuthenticated) {
      sessionStorage.setItem('pendingInviteToken', token);
      router.push(`/register?invite=${token}`);
      return;
    }

    // Si ya tiene familia, mandamos al dashboard
    if (familia) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, familia, router, token]);

  const handleConfirmJoin = async () => {
    setIsJoining(true);
    try {
      await unirsePorLink(token);
      toast.success('¡Te has unido a la familia!');
      
      // Esperar un poco para que los estados se asienten (color, nivel, etc.)
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error joining family by link:', error);
      toast.error('El enlace de invitación ha expirado o no es válido.');
      router.push('/home');
      setIsJoining(false);
    }
  };

  const handleCancel = () => {
    router.push('/home');
  };

  if (isLoading || !isAuthenticated || familia) {
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
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto animate-bounce">
            <Bird className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-foreground text-lg font-medium">Uniéndote al nido...</p>
        </div>
      ) : (
        <InvitationPreview 
          token={token} 
          onConfirm={handleConfirmJoin} 
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
