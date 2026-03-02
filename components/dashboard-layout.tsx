'use client';

import { useState, useEffect } from 'react';
import { useRouter, Link } from '@/i18n/routing';
import {
  Calendar,
  ShoppingCart,
  StickyNote,
  Bird,
  LogOut,
  Home,
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
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

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [sidebarTimeout, setSidebarTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

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

  const handleMouseEnter = () => {
    const timeout = setTimeout(() => {
      setIsSidebarExpanded(true);
    }, 600);
    setSidebarTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (sidebarTimeout) clearTimeout(sidebarTimeout);
    setIsSidebarExpanded(false);
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

  const navItems = [
    { id: 'members', href: '/dashboard/nido' as const, icon: Bird, label: 'Nido' },
    { id: 'calendar', href: '/dashboard/tareas' as const, icon: Calendar, label: 'Tareas' },
    { id: 'list', href: '/dashboard/lista' as const, icon: ShoppingCart, label: 'Lista' },
    { id: 'notes', href: '/dashboard/notas' as const, icon: StickyNote, label: 'Notas' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col sm:flex-row pb-20 sm:pb-0 overflow-hidden">
      {/* Sidebar - Desktop Only */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`hidden sm:flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out z-50 h-screen sticky top-0 overflow-x-hidden ${
          isSidebarExpanded ? 'w-64' : 'w-20'
        }`}
        aria-label="Sidebar principal"
      >
        <div className="p-4 flex items-center justify-center overflow-hidden border-b border-border/40 h-[80px] flex-shrink-0">
          <div className={`transition-all duration-300 transform ${isSidebarExpanded ? 'scale-100 opacity-100' : 'scale-0 opacity-0 w-0'}`}>
            <Image
              src="/logo.png"
              alt="NuestroNido"
              width={163}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          </div>
          <div className={`transition-all duration-300 flex items-center justify-center ${isSidebarExpanded ? 'hidden' : 'block'}`}>
             <Bird className="w-10 h-10 text-primary" />
          </div>
        </div>

        <nav className="flex-1 py-8 flex flex-col gap-6 px-3 overflow-y-auto no-scrollbar overflow-x-hidden">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-4 h-12 px-3 rounded-xl transition-all duration-200 group relative ${
                activeSection === item.id
                  ? 'bg-primary text-primary-foreground shadow-tactile'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <item.icon className={`w-6 h-6 flex-shrink-0 transition-transform ${activeSection === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className={`font-semibold text-base whitespace-nowrap overflow-hidden transition-all duration-300 ${isSidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                {item.label}
              </span>
              
              {!isSidebarExpanded && (
                <div className="absolute left-16 bg-popover text-popover-foreground text-sm px-3 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-[100] border border-border whitespace-nowrap font-medium">
                  {item.label}
                </div>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-border/40 space-y-6 flex-shrink-0 pb-8 overflow-hidden">
          {/* Family and User Info */}
          <div className={`px-2 transition-all duration-300 ${isSidebarExpanded ? 'opacity-100' : 'opacity-100 flex flex-col items-center'}`}>
             <div className={`transition-all duration-300 ${isSidebarExpanded ? 'text-left' : 'text-center'} w-full overflow-hidden`}>
                <p className={`font-bold text-foreground leading-tight truncate ${isSidebarExpanded ? 'text-lg' : 'text-[10px]'}`}>
                  {isSidebarExpanded ? family.name : family.name.substring(0, 2).toUpperCase()}
                </p>
                <p className={`text-muted-foreground font-medium truncate ${isSidebarExpanded ? 'text-sm' : 'text-[8px]'}`}>
                  {isSidebarExpanded ? user.name : user.name.substring(0, 1).toUpperCase()}
                </p>
             </div>
          </div>

          <button
            onClick={handleLogout}
            className={`flex items-center gap-4 h-12 px-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all group relative w-full overflow-hidden`}
            title="Cerrar sesión"
          >
            <LogOut className="w-6 h-6 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
            <span className={`font-semibold text-base whitespace-nowrap transition-all duration-300 ${isSidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
              Salir
            </span>
            {!isSidebarExpanded && (
              <div className="absolute left-16 bg-popover text-popover-foreground text-sm px-3 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none z-[100] border border-border whitespace-nowrap font-medium">
                Cerrar sesión
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Top Header (Minimal) */}
      <header className="sm:hidden border-b border-card bg-card/80 backdrop-blur-md sticky top-0 z-50 h-[56px] flex-shrink-0">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Image
            src="/logo.png"
            alt="NuestroNido"
            width={122}
            height={30}
            className="h-7 w-auto object-contain"
            priority
          />
          <div className="flex items-center gap-3">
             <p className="text-xs font-bold text-foreground max-w-[100px] truncate">{family.name}</p>
             <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8 text-muted-foreground">
                <LogOut className="w-4 h-4" />
             </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 animate-in fade-in slide-in-from-bottom-2 duration-500 no-scrollbar">
           {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border/40 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => (
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

      <LevelUpListener />
    </div>
  );
}
