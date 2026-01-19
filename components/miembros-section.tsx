'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Leaderboard } from '@/components/leaderboard';
import { EliminarMiembroDialog } from '@/components/dialogs/eliminar-miembro-dialog';
import { EliminarFamiliaDialog } from '@/components/dialogs/eliminar-familia-dialog';
import { EditarPerfilDialog } from '@/components/dialogs/editar-perfil-dialog';
import { InvitarMiembrosDialog } from '@/components/dialogs/invitar-miembros-dialog';
import { Miembro } from '@/lib/types';
import { useFamilia } from '@/hooks/use-familia';
import { useAuth } from '@/hooks/use-auth';
import { FamilyService } from '@/services/family-service';
import { UserService } from '@/services/user-service';
import { toast } from 'sonner';
import { SectionSkeleton } from '@/components/ui/section-skeleton';
import { MiembroCard } from '@/components/miembro-card';

export function MiembrosSection() {
  const { familia, cargarFamiliaGuardada, eliminarFamilia } = useFamilia();
  const { usuario } = useAuth();

  const esCreador = useMemo(() => {
    return familia && usuario ? familia.creadorId === usuario.id : false;
  }, [familia, usuario]);

  const [miembroAEliminar, setMiembroAEliminar] = useState<Miembro | null>(null);
  const [dialogEliminarOpen, setDialogEliminarOpen] = useState(false);
  const [dialogEliminarFamiliaOpen, setDialogEliminarFamiliaOpen] = useState(false);
  const [miembroAEditar, setMiembroAEditar] = useState<Miembro | null>(null);
  const [dialogEditarOpen, setDialogEditarOpen] = useState(false);
  const [invitarDialogOpen, setInvitarDialogOpen] = useState(false);

  const handleEliminarMiembro = (miembro: Miembro) => {
    if (miembro.rolId === 'creador' && familia?.miembros.length === 1) {
      setDialogEliminarFamiliaOpen(true);
    } else {
      setMiembroAEliminar(miembro);
      setDialogEliminarOpen(true);
    }
  };

  const handleEditarPerfil = (miembro: Miembro) => {
    setMiembroAEditar(miembro);
    setDialogEditarOpen(true);
  };

  const handleConfirmarEliminacion = async () => {
    if (!familia || !miembroAEliminar) return;

    try {
      if (miembroAEliminar.id === usuario?.id) {
        await FamilyService.leave();
      } else {
        await FamilyService.removeMember(miembroAEliminar.id);
      }
              cargarFamiliaGuardada();
              setMiembroAEliminar(null);
              toast.success('Miembro eliminado');
          } catch (error) {
              console.error('Error removing member:', error);
              toast.error('Error al eliminar miembro');
          }
      
  };

  const handleConfirmarEdicion = async (miembroActualizado: Miembro) => {
    if (!familia || !usuario) return;

    // Only allow editing self
    if (usuario.id === miembroActualizado.id) {
      try {
        await UserService.updateUser(usuario.id, {
          name: miembroActualizado.nombre,
          // Color update not supported by simple user update yet?
          // UserUpdate schema has 'name'. Color might be separate.
        });
                    // Also need to refresh family to see updated name in list
                    cargarFamiliaGuardada();
                    setMiembroAEditar(null);
                    toast.success('Perfil actualizado');
                } catch (error) {
                    console.error('Error updating profile:', error);
                    toast.error('Error al actualizar perfil');
                }
        
    }
  };

  const handleEliminarFamilia = async () => {
    if (familia) {
      try {
                      await eliminarFamilia(familia.id);
                      // Redirect or state update handled by hook/parent
                      toast.success('Familia eliminada');
                  } catch (error) {
                      console.error('Error deleting family:', error);
                      toast.error('Error al eliminar familia');
                  }
        
    }
  };

  if (!familia || !usuario) {
    return <SectionSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Miembros Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Miembros ({familia.miembros.length})
          </h3>
          <Button onClick={() => setInvitarDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Invitar a Familiar</span>
            <span className="sm:hidden">Invitar</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {familia.miembros.map((miembro) => {
            const esMiembro = usuario?.id === miembro.id;
            return (
              <MiembroCard
                key={miembro.id}
                miembro={miembro}
                esMiembro={esMiembro}
                esCreador={esCreador}
                onEliminar={handleEliminarMiembro}
                onEditar={handleEditarPerfil}
              />
            );
          })}
        </div>
      </div>

      {/* Leaderboard */}
      <Leaderboard miembros={familia.miembros} />

      {/* Dialog de Eliminar Miembro */}
      <EliminarMiembroDialog
        miembro={miembroAEliminar}
        open={dialogEliminarOpen}
        onOpenChange={setDialogEliminarOpen}
        onConfirm={handleConfirmarEliminacion}
        esUsuarioActual={miembroAEliminar?.id === usuario?.id}
      />

      {/* Dialog de Eliminar Familia (cuando el creador es el último) */}
      {familia && (
        <EliminarFamiliaDialog
          familia={familia}
          trigger={null}
          open={dialogEliminarFamiliaOpen}
          onOpenChange={setDialogEliminarFamiliaOpen}
        />
      )}

      {/* Dialog de Editar Perfil */}
      <EditarPerfilDialog
        miembro={miembroAEditar}
        open={dialogEditarOpen}
        onOpenChange={setDialogEditarOpen}
        onConfirm={handleConfirmarEdicion}
      />

      {/* Dialog de Invitar Miembros */}
      {familia && (
        <InvitarMiembrosDialog
          familia={familia}
          open={invitarDialogOpen}
          onOpenChange={setInvitarDialogOpen}
        />
      )}
    </div>
  );
}
