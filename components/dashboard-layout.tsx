'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, ShoppingCart, Users, StickyNote, Bird, LogOut, Home, Trash2, Settings } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { DeleteFamilyDialog } from '@/components/dialogs/delete-family-dialog';
import { EditFamilyDialog } from '@/components/dialogs/edit-family-dialog';
import { InviteMembersDialog } from '@/components/dialogs/invite-members-dialog';
import { useAuth } from '@/hooks/use-auth';
import { useFamily } from '@/hooks/use-family';
import { LevelUpListener } from '@/components/level-up-listener';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSection?: 'members' | 'calendar' | 'list' | 'notes' | 'overview';
}

export function DashboardLayout({ children, activeSection = 'overview' }: DashboardLayoutProps) {
  const router = useRouter();
  const { logout, user, isAuthenticated, isLoading: authLoading, refreshFamily } = useAuth();
  const { family, isLoading: familyLoading } = useFamily();

  const isCreator = useMemo(() => {
    const isById = family && user ? String(family.creatorId) === String(user.id) : false;
    const myMember = family?.members.find(m => String(m.id) === String(user?.id));
    const isByRole = myMember?.roleId === 'creator';
    return isById || isByRole;
  }, [family, user]);

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [deleteFamilyOpen, setDeleteFamilyOpen] = useState(false);
  const [editFamilyOpen, setEditFamilyOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      refreshFamily();
    }
  }, [activeSection, isAuthenticated, refreshFamily]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
      return;
    }

    if (!authLoading && isAuthenticated && !familyLoading && !family) {
      router.push('/home');
    }
  }, [isAuthenticated, authLoading, familyLoading, family, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (authLoading || familyLoading || !family || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Cargando..."
            width={261}
            height={64}
            className="h-16 w-auto object-contain mx-auto mb-4 animate-pulse"
            priority
          />
          <p className="text-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-card bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-2">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
<<<<<<< HEAD
              <img src="/logo.png" alt="NuestroNido Logo" className="h-8 sm:h-10 w-auto object-contain" />
              <div className="hidden xs:block w-px h-6 bg-foreground/20 mx-1" />
              <p className="text-base sm:text-lg font-bold text-foreground leading-none truncate max-w-[150px] sm:max-w-[300px] mt-0.5">
=======
              <Image
                src="/logo.png"
                alt="NuestroNido Logo"
                width={163}
                height={40}
                className="h-8 sm:h-10 w-auto object-contain"
                priority
              />
              <div className="hidden xs:block w-px h-6 bg-border/60 mx-1" />
              <p className="text-base sm:text-lg font-bold text-foreground leading-none truncate max-w-[150px] sm:max-w-[300px]">
>>>>>>> f4270363c654b6614dcbd07e20f44354ce559592
                {family.name}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 sm:h-10 sm:w-10 p-0 hover:bg-primary/10 text-muted-foreground hover:text-primary"
                  title="Ir al inicio"
                  aria-label="Ir al inicio"
                >
                  <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="h-8 w-8 sm:h-10 sm:w-10 p-0 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-primary backdrop-blur-sm border-b border-primary sticky top-[48px] sm:top-[56px] z-10" aria-label="Navegación principal">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-1 sm:gap-2 overflow-x-auto py-2 sm:py-3 scrollbar-hide items-center">
              <Button
                asChild
                variant="ghost"
                className={`flex items-center gap-1.5 sm:gap-2 whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-10 ${
                  activeSection === 'overview'
                    ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground'
                    : 'text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground'
                }`}
              >
                <Link href="/dashboard" prefetch={true} aria-current={activeSection === 'overview' ? 'page' : undefined}>
                  <Bird className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Inicio</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                className={`flex items-center gap-1.5 sm:gap-2 whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-10 ${
                  activeSection === 'members'
                    ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground'
                    : 'text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground'
                }`}
              >
                <Link href="/dashboard/miembros" prefetch={true} aria-current={activeSection === 'members' ? 'page' : undefined}>
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Miembros</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                className={`flex items-center gap-1.5 sm:gap-2 whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-10 ${
                  activeSection === 'calendar'
                    ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground'
                    : 'text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground'
                }`}
              >
                <Link href="/dashboard/tareas" prefetch={true} aria-current={activeSection === 'calendar' ? 'page' : undefined}>
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Calendario de Tareas</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                className={`flex items-center gap-1.5 sm:gap-2 whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-10 ${
                  activeSection === 'list'
                    ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground'
                    : 'text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground'
                }`}
              >
                <Link href="/dashboard/lista" prefetch={true} aria-current={activeSection === 'list' ? 'page' : undefined}>
                  <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Lista</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                className={`flex items-center gap-1.5 sm:gap-2 whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-10 ${
                  activeSection === 'notes'
                    ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground'
                    : 'text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground'
                }`}
              >
                <Link href="/dashboard/notas" prefetch={true} aria-current={activeSection === 'notes' ? 'page' : undefined}>
                  <StickyNote className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Notas</span>
                </Link>
              </Button>

              <div className="w-px h-6 bg-primary-foreground/20 mx-1"></div>
            </div>

            {isCreator && (
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 sm:h-10 sm:w-10 p-0 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground shrink-0"
                  title="Configuración de familia"
                  aria-label="Configuración de familia"
                  onClick={() => setEditFamilyOpen(true)}
                >
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 sm:h-10 sm:w-10 p-0 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground shrink-0"
                  title="Eliminar familia"
                  aria-label="Eliminar familia"
                  onClick={() => setDeleteFamilyOpen(true)}
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">{children}</main>

      {family && (
        <>
          <InviteMembersDialog
            family={family}
            open={inviteDialogOpen}
            onOpenChange={setInviteDialogOpen}
          />
          <EditFamilyDialog
            family={family}
            open={editFamilyOpen}
            onOpenChange={setEditFamilyOpen}
            trigger={null}
          />
          <DeleteFamilyDialog
            family={family}
            open={deleteFamilyOpen}
            onOpenChange={setDeleteFamilyOpen}
            trigger={null}
          />
        </>
      )}
      
      <LevelUpListener />
    </div>
  );
}
