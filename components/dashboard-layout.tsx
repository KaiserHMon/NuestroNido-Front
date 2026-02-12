'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, ShoppingCart, Users, StickyNote, Bird, LogOut, Home, Trash2, Settings } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EliminarFamiliaDialog } from '@/components/dialogs/eliminar-familia-dialog';
import { EditarFamiliaDialog } from '@/components/dialogs/editar-familia-dialog';
import { InvitarMiembrosDialog } from '@/components/dialogs/invitar-miembros-dialog';
import { useAuth } from '@/hooks/use-auth';
import { useFamilia } from '@/hooks/use-familia';
import { LevelUpListener } from '@/components/level-up-listener';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSection?: 'miembros' | 'calendario' | 'lista' | 'notas' | 'overview';
}

export function DashboardLayout({ children, activeSection = 'overview' }: DashboardLayoutProps) {
  const router = useRouter();
  const { logout, usuario, isAuthenticated, isLoading: authLoading, refreshFamily } = useAuth();
  const { familia, isLoading: familiaLoading } = useFamilia();
  const esCreador = useMemo(() => {
    return familia && usuario ? familia.creadorId === usuario.id : false;
  }, [familia, usuario]);
  const [invitarDialogOpen, setInvitarDialogOpen] = useState(false);
  const [eliminarFamiliaOpen, setEliminarFamiliaOpen] = useState(false);
  const [editarFamiliaOpen, setEditarFamiliaOpen] = useState(false);

  // Refresh family data whenever we navigate between sections
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

    if (!authLoading && isAuthenticated && !familiaLoading && !familia) {
      router.push('/home');
    }
  }, [isAuthenticated, authLoading, familiaLoading, familia, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (authLoading || familiaLoading || !familia || !usuario) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <img src="/logo.png" alt="Cargando..." className="h-16 w-auto object-contain mx-auto mb-4 animate-pulse" />
          <p className="text-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-card bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-2">
          <div className="flex items-start justify-between w-full">
            {/* Logo and Family Name */}
            <div className="flex flex-col items-center flex-1">
              <img src="/logo.png" alt="NuestroNido Logo" className="h-8 sm:h-10 w-auto object-contain" />
              <p className="text-sm sm:text-base font-semibold text-foreground leading-tight mt-1">{familia.nombre}</p>
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
                  activeSection === 'miembros'
                    ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground'
                    : 'text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground'
                }`}
              >
                <Link href="/dashboard/miembros" prefetch={true} aria-current={activeSection === 'miembros' ? 'page' : undefined}>
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Miembros</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                className={`flex items-center gap-1.5 sm:gap-2 whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-10 ${
                  activeSection === 'calendario'
                    ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground'
                    : 'text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground'
                }`}
              >
                <Link href="/dashboard/tareas" prefetch={true} aria-current={activeSection === 'calendario' ? 'page' : undefined}>
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Calendario de Tareas</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                className={`flex items-center gap-1.5 sm:gap-2 whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-10 ${
                  activeSection === 'lista'
                    ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground'
                    : 'text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground'
                }`}
              >
                <Link href="/dashboard/lista" prefetch={true} aria-current={activeSection === 'lista' ? 'page' : undefined}>
                  <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Lista</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                className={`flex items-center gap-1.5 sm:gap-2 whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-10 ${
                  activeSection === 'notas'
                    ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground'
                    : 'text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground'
                }`}
              >
                <Link href="/dashboard/notas" prefetch={true} aria-current={activeSection === 'notas' ? 'page' : undefined}>
                  <StickyNote className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Notas</span>
                </Link>
              </Button>

              <div className="w-px h-6 bg-primary-foreground/20 mx-1"></div>
            </div>

            {esCreador && (
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 sm:h-10 sm:w-10 p-0 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground shrink-0"
                  title="Configuración de familia"
                  aria-label="Configuración de familia"
                  onClick={() => setEditarFamiliaOpen(true)}
                >
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 sm:h-10 sm:w-10 p-0 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground shrink-0"
                  title="Eliminar familia"
                  aria-label="Eliminar familia"
                  onClick={() => setEliminarFamiliaOpen(true)}
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">{children}</main>

      {familia && (
        <>
          <InvitarMiembrosDialog
            familia={familia}
            open={invitarDialogOpen}
            onOpenChange={setInvitarDialogOpen}
          />
          <EditarFamiliaDialog
            familia={familia}
            open={editarFamiliaOpen}
            onOpenChange={setEditarFamiliaOpen}
            trigger={null}
          />
          <EliminarFamiliaDialog
            familia={familia}
            open={eliminarFamiliaOpen}
            onOpenChange={setEliminarFamiliaOpen}
            trigger={null}
          />
        </>
      )}
      
      <LevelUpListener />
    </div>
  );
}
