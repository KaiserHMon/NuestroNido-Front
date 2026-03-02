'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  ShoppingCart,
  Users,
  StickyNote,
  Bird,
  LogOut,
  Home,
  Trash2,
  Settings,
} from 'lucide-react';
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
    const myMember = family?.members.find((m) => String(m.id) === String(user?.id));
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
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      <header className="border-b border-card bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="NuestroNido Logo"
                width={163}
                height={40}
                className="h-8 sm:h-10 md:h-12 w-auto object-contain"
                priority
              />
              <div className="hidden xs:block w-px h-6 bg-border/40 mx-1" />
              <p className="hidden xs:block text-base sm:text-lg font-bold text-foreground leading-none truncate max-w-[150px] sm:max-w-[300px] font-heading">
                {family.name}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                  title="Ir al inicio"
                >
                  <Home className="w-5 h-5" />
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Navigation */}
      <nav
        className="hidden sm:block bg-primary/95 backdrop-blur-md border-b border-primary/20 sticky top-[56px] md:top-[64px] z-40 shadow-sm"
        aria-label="Navegación principal escritorio"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex gap-1 items-center">
              {[
                { id: 'overview', href: '/dashboard', icon: Bird, label: 'Inicio' },
                { id: 'members', href: '/dashboard/miembros', icon: Users, label: 'Miembros' },
                { id: 'calendar', href: '/dashboard/tareas', icon: Calendar, label: 'Tareas' },
                { id: 'list', href: '/dashboard/lista', icon: ShoppingCart, label: 'Lista' },
                { id: 'notes', href: '/dashboard/notas', icon: StickyNote, label: 'Notas' },
              ].map((item) => (
                <Button
                  key={item.id}
                  asChild
                  variant="ghost"
                  className={`flex items-center gap-2 px-4 h-10 rounded-full transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-destructive text-destructive-foreground shadow-tactile'
                      : 'text-primary-foreground hover:bg-white/10'
                  }`}
                >
                  <Link href={item.href} prefetch={true}>
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                </Button>
              ))}
            </div>

            {isCreator && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full text-primary-foreground hover:bg-white/10"
                  onClick={() => setEditFamilyOpen(true)}
                >
                  <Settings className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full text-primary-foreground hover:bg-white/10"
                  onClick={() => setDeleteFamilyOpen(true)}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border/40 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around h-16 px-2">
          {[
            { id: 'overview', href: '/dashboard', icon: Bird, label: 'Inicio' },
            { id: 'calendar', href: '/dashboard/tareas', icon: Calendar, label: 'Tareas' },
            { id: 'list', href: '/dashboard/lista', icon: ShoppingCart, label: 'Lista' },
            { id: 'notes', href: '/dashboard/notas', icon: StickyNote, label: 'Notas' },
            { id: 'members', href: '/dashboard/miembros', icon: Users, label: 'Nido' },
          ].map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                activeSection === item.id ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${
                activeSection === item.id ? 'bg-primary/10 shadow-sm' : ''
              }`}>
                <item.icon className={`w-5 h-5 ${activeSection === item.id ? 'scale-110' : ''}`} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6 lg:py-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {children}
      </main>

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
