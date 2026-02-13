'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useFamily } from '@/hooks/use-family';
import { Button } from '@/components/ui/button';
import { CreateFamilyCard } from '@/components/family/create-family-card';
import { JoinFamilyCard } from '@/components/family/join-family-card';
import { SupportDialog } from '@/components/dialogs/support-dialog';
import { SettingsDialog } from '@/components/dialogs/settings-dialog';
import { FamilyService } from '@/services/family-service';
import { toast } from 'sonner';

export default function HomeSelectionPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { family, isLoading: familyLoading, joinFamily } = useFamily();
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
      const pendingToken = sessionStorage.getItem('pendingInviteToken');
      if (pendingToken) {
        sessionStorage.removeItem('pendingInviteToken');
        router.push(`/invite/${pendingToken}`);
        return;
      }

      // Check for pending invitation by code
      const pendingCode = sessionStorage.getItem('pendingInvitationCode');
      if (pendingCode) {
        try {
          await joinFamily(pendingCode);
          sessionStorage.removeItem('pendingInvitationCode');
          toast.success('¡Te has unido a la familia exitosamente!');
          router.push('/dashboard');
          return;
        } catch (error) {
          console.error('Error joining with pending code:', error);
          toast.error('No se pudo procesar la invitación. El código podría ser inválido.');
          sessionStorage.removeItem('pendingInvitationCode');
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
          <img src="/logo.png" alt="Cargando..." className="h-16 w-auto object-contain mx-auto mb-4 animate-pulse" />
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
            <div className="flex items-center">
              <img src="/logo.png" alt="NuestroNido Logo" className="h-10 sm:h-12 w-auto object-contain" />
            </div>

            <div className="flex items-center gap-2">
              <SettingsDialog />
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10 text-primary">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Volver al inicio</span>
                </Button>
              </Link>
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
