'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Nota, Miembro } from '@/lib/types';
import { NotaCard } from '@/components/nota-card';
import { NotaFilter } from '@/components/nota-filter';
import { CrearNotaDialog } from '@/components/dialogs/crear-nota-dialog';
import { Button } from '@/components/ui/button';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { Plus } from 'lucide-react';
import { NoteService } from '@/services/note-service';
import { useAuth } from '@/hooks/use-auth';
import { useFamilia } from '@/hooks/use-familia';
import { toast } from 'sonner';
import { SectionSkeleton } from '@/components/ui/section-skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ApiNote {
  id: string;
  titulo: string;
  contenido: string;
  user_id: string;
  family_id: string;
  created_at: string;
}

interface NoteFormData {
  titulo: string;
  contenido: string;
}

export function NotasSection() {
  const { usuario } = useAuth();
  const { familia } = useFamilia();
  const [notas, setNotas] = useState<Nota[]>([]);
  const [filtrosActivos, setFiltrosActivos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isNuevaNotaOpen, setIsNuevaNotaOpen] = useState(false);
  const [notaAEliminar, setNotaAEliminar] = useState<string | null>(null);
  const [notaAEditar, setNotaAEditar] = useState<Nota | undefined>(undefined);

  // Index members by ID for faster lookups
  const miembrosMap = useMemo(() => {
    if (!familia) return new Map<string, Miembro>();
    return new Map(familia.miembros.map((m) => [m.id, m]));
  }, [familia]);

  const fetchNotas = useCallback(async () => {
    if (!familia) return;
    try {
      setLoading(true);
      const data = await NoteService.getNotes() as unknown as ApiNote[];

      const mappedNotas: Nota[] = data.map((apiNote) => {
        const creatorMember = miembrosMap.get(apiNote.user_id);
        const color = creatorMember
          ? creatorMember.color
          : {
              id: 'temp',
              nombre: 'Gris',
              bg: '#9CA3AF',
              text: '#FFFFFF',
              accent: '#9CA3AF',
              wcagContrast: 4.5,
            };

        return {
          id: apiNote.id,
          titulo: apiNote.titulo,
          contenido: apiNote.contenido || '',
          colorCreador: color,
          fechaCreacion: apiNote.created_at,
          familiaId: apiNote.family_id,
          user_id: apiNote.user_id, // Store for filtering
        };
      });

      setNotas(mappedNotas);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Error al cargar las notas');
    } finally {
      setLoading(false);
    }
  }, [familia, miembrosMap]);

  useEffect(() => {
    fetchNotas();
  }, [fetchNotas]);

  const handleCrearNota = async (data: NoteFormData) => {
    if (!familia || !usuario) return;

    try {
      const newNote = await NoteService.create({
        titulo: data.titulo,
        contenido: data.contenido,
        family_id: familia.id,
        user_id: usuario.id,
      }) as unknown as ApiNote;

      const creatorMember = miembrosMap.get(newNote.user_id);
      const color = creatorMember
        ? creatorMember.color
        : {
            id: 'temp',
            nombre: 'Gris',
            bg: '#9CA3AF',
            text: '#FFFFFF',
            accent: '#9CA3AF',
            wcagContrast: 4.5,
          };

      const mappedNote: Nota = {
        id: newNote.id,
        titulo: newNote.titulo,
        contenido: newNote.contenido || '',
        colorCreador: color,
        fechaCreacion: newNote.created_at,
        familiaId: newNote.family_id,
        user_id: newNote.user_id,
      };

      setNotas((prev) => [mappedNote, ...prev]);
      setIsNuevaNotaOpen(false);
      toast.success('Nota creada');
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error('Error al crear la nota');
    }
  };

  const handleEditNota = async (data: NoteFormData) => {
    if (!familia || !usuario || !notaAEditar) return;

    try {
      const updatedNote = await NoteService.update(notaAEditar.id, {
        titulo: data.titulo,
        contenido: data.contenido,
      }) as unknown as ApiNote;

      setNotas((prev) =>
        prev.map((n) =>
          n.id === updatedNote.id
            ? {
                ...n,
                titulo: updatedNote.titulo,
                contenido: updatedNote.contenido || '',
              }
            : n
        )
      );
      setNotaAEditar(undefined);
      setIsNuevaNotaOpen(false); // Close dialog if open
      toast.success('Nota actualizada');
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Error al actualizar la nota');
    }
  };

  const handleDeleteNota = async (noteId: string) => {
    try {
          await NoteService.delete(noteId);
          setNotas(prev => prev.filter(n => n.id !== noteId));
          toast.success('Nota eliminada');
      } catch (error) {
          console.error('Error deleting note:', error);
          toast.error('Error al eliminar la nota');
      }
  };

  const onConfirmDelete = async () => {
    if (notaAEliminar) {
      await handleDeleteNota(notaAEliminar);
      setNotaAEliminar(null); // Close dialog
    }
  };

  const notasFiltradas = useMemo(() => {
    const filtered = filtrosActivos.length === 0
      ? notas
      : notas.filter((nota) => nota.user_id && filtrosActivos.includes(nota.user_id));
    
    return [...filtered].sort((a, b) => 
      new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
    );
  }, [notas, filtrosActivos]);

  if (loading && notas.length === 0) {
    return <SectionSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Notas</h2>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => {
          setNotaAEditar(undefined);
          setIsNuevaNotaOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Nota
        </Button>
      </div>

      {familia && familia.miembros.length > 0 ? (
        <NotaFilter
          miembros={familia.miembros}
          filtrosActivos={filtrosActivos}
          onFilterChange={setFiltrosActivos}
        />
      ) : null}

      {notasFiltradas.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No hay notas</EmptyTitle>
            <EmptyDescription>
              {filtrosActivos.length > 0
                ? 'No hay notas que coincidan con los filtros seleccionados'
                : 'Aún no hay notas. ¡Crea una para comenzar!'}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {notasFiltradas.length} de {notas.length} nota{notas.length > 1 ? 's' : ''}
          </div>
          <div className="space-y-3">
            {notasFiltradas.map((nota) => {
              const creador = miembrosMap.get(nota.user_id || '');
              return (
                <NotaCard
                  key={nota.id}
                  nota={nota}
                  creador={creador}
                  onDelete={() => setNotaAEliminar(nota.id)}
                  onEdit={() => setNotaAEditar(nota)}
                  currentUserId={usuario?.id}
                />
              );
            })}
          </div>
        </div>
      )}

      <CrearNotaDialog
        open={isNuevaNotaOpen || !!notaAEditar}
        onOpenChange={(open) => {
          if (!open) setNotaAEditar(undefined);
          setIsNuevaNotaOpen(open);
        }}
        onSubmit={notaAEditar ? handleEditNota : handleCrearNota}
        notaAEditar={
          notaAEditar
            ? {
                titulo: notaAEditar.titulo || '',
                contenido: notaAEditar.contenido,
              }
            : undefined
        }
      />

      <AlertDialog open={!!notaAEliminar} onOpenChange={() => setNotaAEliminar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La nota será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
