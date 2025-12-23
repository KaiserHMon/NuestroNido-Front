'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  ShoppingCart,
  Users,
  StickyNote,
  Bird,
  LogOut,
  Settings,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MiembrosSection } from '@/components/miembros-section';
import { CalendarioSection } from '@/components/calendario-section';
import { ListaSection } from '@/components/lista-section';
import { NotasSection } from '@/components/notas-section';
import { FamiliaActions } from '@/components/familia/familia-actions';
import { InvitarMiembrosDialog } from '@/components/dialogs/invitar-miembros-dialog';
import { Familia, Usuario } from '@/lib/types';

type Section = 'miembros' | 'calendario' | 'lista' | 'notas';

export default function NuestroNidoApp() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>('miembros');
  const [familia, setFamilia] = useState<Familia | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [esCreador, setEsCreador] = useState(false);
  const [invitarDialogOpen, setInvitarDialogOpen] = useState(false);

  useEffect(() => {
    // Cargar datos de localStorage
    const familiaGuardada = localStorage.getItem('familia');
    const usuarioGuardado = localStorage.getItem('usuario');

    if (!familiaGuardada || !usuarioGuardado) {
      router.push('/login');
      return;
    }

    const familiaData: Familia = JSON.parse(familiaGuardada);
    const usuarioData: Usuario = JSON.parse(usuarioGuardado);

    // Usar Promise para evitar setState directo en effect
    Promise.resolve().then(() => {
      setFamilia(familiaData);
      setUsuario(usuarioData);
      setEsCreador(familiaData.creadorId === usuarioData.id);
    });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('usuario');
    router.push('/login');
  };

  const handleFamiliaActualizada = () => {
    // Recargar familia del localStorage
    const familiaGuardada = localStorage.getItem('familia');
    if (familiaGuardada) {
      setFamilia(JSON.parse(familiaGuardada));
    }
  };

  const handleMiembroAgregado = () => {
    // Recargar familia del localStorage
    const familiaGuardada = localStorage.getItem('familia');
    if (familiaGuardada) {
      setFamilia(JSON.parse(familiaGuardada));
    }
    setInvitarDialogOpen(false);
  };

  if (!familia || !usuario) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
            <Bird className="w-8 h-8 text-primary-foreground animate-bounce" />
          </div>
          <p className="text-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-card bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center">
                <Bird className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h1 className="text-base sm:text-lg font-bold text-foreground">NuestroNido</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">{familia.nombre}</p>
              </div>

              {/* Familia Actions - Desktop */}
              {esCreador && (
                <div className="ml-auto hidden sm:block">
                  <FamiliaActions
                    familia={familia}
                    esCreador={esCreador}
                    onFamiliaActualizada={handleFamiliaActualizada}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Settings Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {}}
                className="h-8 w-8 sm:h-10 sm:w-10 p-0 hover:bg-primary/10 text-primary"
                title="Configuración"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="h-8 w-8 sm:h-10 sm:w-10 p-0 hover:bg-destructive/10 text-destructive"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-primary backdrop-blur-sm border-b border-primary sticky top-[57px] sm:top-[65px] z-10">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex gap-1 sm:gap-2 overflow-x-auto py-2 sm:py-3 scrollbar-hide items-center">
            <Button
              variant="ghost"
              onClick={() => setActiveSection('miembros')}
              className={`flex items-center gap-1.5 sm:gap-2 whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-10 ${
                activeSection === 'miembros'
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground'
                  : 'text-primary-foreground'
              }`}
            >
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Miembros</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveSection('calendario')}
              className={`flex items-center gap-1.5 sm:gap-2 whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-10 ${
                activeSection === 'calendario'
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground'
                  : 'text-primary-foreground'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Calendario</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveSection('lista')}
              className={`flex items-center gap-1.5 sm:gap-2 whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-10 ${
                activeSection === 'lista'
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground'
                  : 'text-primary-foreground'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Lista</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveSection('notas')}
              className={`flex items-center gap-1.5 sm:gap-2 whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-10 ${
                activeSection === 'notas'
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground'
                  : 'text-primary-foreground'
              }`}
            >
              <StickyNote className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Notas</span>
            </Button>

            {/* Separador */}
            <div className="w-px h-6 bg-primary-foreground/20 mx-1"></div>

            {/* Invitar Miembros - Botón + */}
            <Button
              variant="ghost"
              onClick={() => setInvitarDialogOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-10 text-primary-foreground hover:bg-primary-foreground/20"
              title="Invitar miembros"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Invitar</span>
            </Button>

            {/* Familia Actions - Nav */}
            {esCreador && (
              <div className="hidden xs:block">
                <FamiliaActions
                  familia={familia}
                  esCreador={esCreador}
                  onFamiliaActualizada={handleFamiliaActualizada}
                  variant="nav"
                />
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        {activeSection === 'miembros' && <MiembrosSection />}
        {activeSection === 'calendario' && <CalendarioSection />}
        {activeSection === 'lista' && <ListaSection />}
        {activeSection === 'notas' && <NotasSection />}
      </main>

      {/* Dialog de Invitar Miembros */}
      {familia && (
        <InvitarMiembrosDialog
          familia={familia}
          open={invitarDialogOpen}
          onOpenChange={setInvitarDialogOpen}
          onMiembroAgregado={handleMiembroAgregado}
        />
      )}
    </div>
  );
}
