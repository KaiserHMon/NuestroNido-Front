'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Leaderboard } from '@/components/leaderboard';
import { MiembroAvatar } from '@/components/ui/miembro-avatar';
import { EliminarMiembroDialog } from '@/components/dialogs/eliminar-miembro-dialog';
import { EliminarFamiliaDialog } from '@/components/dialogs/eliminar-familia-dialog';
import { EditarPerfilDialog } from '@/components/dialogs/editar-perfil-dialog';
import { InvitarMiembrosDialog } from '@/components/dialogs/invitar-miembros-dialog';
import { Familia, Miembro, Usuario } from '@/lib/types';

export function MiembrosSection() {
  const [familia, setFamilia] = useState<Familia | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [esCreador, setEsCreador] = useState(false);
  const [miembroAEliminar, setMiembroAEliminar] = useState<Miembro | null>(null);
  const [dialogEliminarOpen, setDialogEliminarOpen] = useState(false);
  const [dialogEliminarFamiliaOpen, setDialogEliminarFamiliaOpen] = useState(false);
  const [miembroAEditar, setMiembroAEditar] = useState<Miembro | null>(null);
  const [dialogEditarOpen, setDialogEditarOpen] = useState(false);
  const [invitarDialogOpen, setInvitarDialogOpen] = useState(false);

  useEffect(() => {
    const familiaGuardada = localStorage.getItem('familia');
    const usuarioGuardado = localStorage.getItem('usuario');

    if (familiaGuardada) {
      const familiaData: Familia = JSON.parse(familiaGuardada);
      // Usar Promise para evitar setState directo en effect
      Promise.resolve().then(() => {
        setFamilia(familiaData);
      });
    }

    if (usuarioGuardado) {
      const usuarioData = JSON.parse(usuarioGuardado);
      // Usar Promise para evitar setState directo en effect
      Promise.resolve().then(() => {
        setUsuario(usuarioData);
        if (familiaGuardada) {
          const familiaData: Familia = JSON.parse(familiaGuardada);
          setEsCreador(familiaData.creadorId === usuarioData.id);
        }
      });
    }
  }, []);

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

    // Simulación - en realidad esto iría al backend
    const familiaActualizada: Familia = {
      ...familia,
      miembros: familia.miembros.filter((m) => m.id !== miembroAEliminar.id),
    };

    localStorage.setItem('familia', JSON.stringify(familiaActualizada));
    setFamilia(familiaActualizada);
    setMiembroAEliminar(null);
  };

  const handleConfirmarEdicion = async (miembroActualizado: Miembro) => {
    if (!familia) return;

    // Actualizar el miembro en la familia
    const familiaActualizada: Familia = {
      ...familia,
      miembros: familia.miembros.map((m) =>
        m.id === miembroActualizado.id ? miembroActualizado : m
      ),
    };

    // Si es el usuario actual, también actualizar en localStorage
    if (usuario?.id === miembroActualizado.id) {
      const usuarioActualizado = {
        ...usuario,
        nombre: miembroActualizado.nombre,
      };
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      setUsuario(usuarioActualizado);
    }

    localStorage.setItem('familia', JSON.stringify(familiaActualizada));
    setFamilia(familiaActualizada);
    setMiembroAEditar(null);
  };

  const handleMiembroAgregado = () => {
    const familiaGuardada = localStorage.getItem('familia');
    if (familiaGuardada) {
      setFamilia(JSON.parse(familiaGuardada));
    }
    setInvitarDialogOpen(false);
  };

  if (!familia || !usuario) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
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
              <Card
                key={miembro.id}
                className="border border-border bg-card overflow-hidden h-full"
              >
                <CardContent className="p-3 space-y-3 flex flex-col h-full">
                  {/* Header del Card */}
                  <div className="flex items-start justify-between gap-2">
                    <MiembroAvatar nombre={miembro.nombre} color={miembro.color} size="md" />
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {esMiembro && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEliminarMiembro(miembro)}
                            className="h-8 w-8 p-0 hover:bg-destructive/10 text-destructive"
                            title="Salir de la familia"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditarPerfil(miembro)}
                            className="h-8 w-8 p-0 hover:bg-primary/10 text-primary"
                            title="Editar perfil"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {esCreador && !esMiembro && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEliminarMiembro(miembro)}
                          className="h-8 w-8 p-0 hover:bg-destructive/10 text-destructive"
                          title="Eliminar miembro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Nombre y rol */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{miembro.nombre}</h4>
                      {esMiembro && (
                        <Badge className="text-xs bg-primary/20 text-primary border border-primary/30">
                          Tú
                        </Badge>
                      )}
                    </div>
                    {miembro.rolId === 'creador' && (
                      <Badge className="mt-1 bg-primary text-primary-foreground">Creador</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
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
          onMiembroAgregado={handleMiembroAgregado}
        />
      )}
    </div>
  );
}
