'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/nuestro-nido-logo.png';
import { useAuth } from '@/hooks/use-auth';
import { useFamily } from '@/hooks/use-family';
import { CreateFamilyCard } from '@/components/family/create-family-card';
import { JoinFamilyCard } from '@/components/family/join-family-card';
import { SupportDialog } from '@/components/dialogs/support-dialog';
import { SettingsDialog } from '@/components/dialogs/settings-dialog';
import { FamilyService } from '@/services/family-service';
import { toast } from 'sonner';

export default function HomeSelectionPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { family, isLoading: familyLoading, joinFamily, joinByLink } = useFamily();
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isCheckingFamily, setIsCheckingFamily] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      if (authLoading) return;

      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      if (family) {
        router.push('/dashboard');
        return;
      }

      // Check for pending invitation by link (Token)
      const pendingToken = localStorage.getItem('pendingInviteToken');
      if (pendingToken) {
        try {
          setIsCheckingFamily(true);
          await joinByLink(pendingToken);
          localStorage.removeItem('pendingInviteToken');
          toast.success('¡Te has unido a la familia exitosamente!');
          router.push('/dashboard');
          return;
        } catch (error) {
          console.error('Error joining with pending link:', error);
          // If it fails, maybe the token is invalid/expired, remove it to avoid loops
          localStorage.removeItem('pendingInviteToken');
          toast.error('No se pudo procesar el enlace de invitación.');
        }
      }

      // Check for pending invitation by code
      const pendingCode = localStorage.getItem('pendingInvitationCode');
      if (pendingCode) {
        try {
          setIsCheckingFamily(true);
          await joinFamily(pendingCode);
          localStorage.removeItem('pendingInvitationCode');
          toast.success('¡Te has unido a la familia exitosamente!');
          router.push('/dashboard');
          return;
        } catch (error) {
          console.error('Error joining with pending code:', error);
          localStorage.removeItem('pendingInvitationCode');
          toast.error('No se pudo procesar la invitación. El código podría ser inválido.');
        }
      }

      // Fallback check
      if (!family) {
        try {
          const existingFamily = await FamilyService.getMyFamily();
          if (existingFamily) {
            router.push('/dashboard');
            return;
          }
        } catch (error) {
          console.error('Error checking existing family:', error);
        }
      }

      setIsCheckingFamily(false);
    };

    checkStatus();
  }, [isAuthenticated, authLoading, family, router, joinFamily]);

  if (authLoading || familyLoading || (isAuthenticated && isCheckingFamily)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Image
            src={logo}
            alt="Cargando..."
            className="h-16 w-auto object-contain mx-auto mb-4 animate-pulse"
          />
          <p className="text-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-card bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-2">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Image
                src={logo}
                alt="NuestroNido Logo"
                className="h-14 sm:h-16 lg:h-20 w-auto object-contain"
              />
            </Link>

            <div className="flex items-center gap-2">
              <SettingsDialog />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
            ¡Bienvenido, {user.name}!
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Selecciona cómo deseas comenzar con tu familia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto items-start">
          <CreateFamilyCard onSuccess={() => router.push('/dashboard')} />
          <JoinFamilyCard onSuccess={() => router.push('/dashboard')} />
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground text-sm">
            ¿Necesitas ayuda?{' '}
            <button
              onClick={() => setIsSupportOpen(true)}
              className="text-primary hover:underline font-medium"
            >
              Contacta con soporte
            </button>
          </p>
        </div>
      </main>

      <SupportDialog open={isSupportOpen} onOpenChange={setIsSupportOpen} />
    </div>
  );
}
