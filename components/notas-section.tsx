'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Nota } from '@/lib/types';
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

  const fetchNotas = useCallback(async () => {
    if (!familia) return;
    try {
      setLoading(true);
      const data = await NoteService.getNotes();
      setNotas(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Error al cargar las notas');
    } finally {
      setLoading(false);
    }
  }, [familia]);

  useEffect(() => {
    fetchNotas();
  }, [fetchNotas]);

  const handleCrearNota = async (data: NoteFormData) => {
    if (!familia || !usuario) return;

    try {
      const newNote = await NoteService.create({
        title: data.titulo,
        content: data.contenido,
        family_id: familia.id,
      });

      setNotas((prev) => [newNote, ...prev]);
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
        title: data.titulo,
        content: data.contenido,
      });

      setNotas((prev) =>
        prev.map((n) => (n.id === updatedNote.id ? updatedNote : n))
      );
      setNotaAEditar(undefined);
      setIsNuevaNotaOpen(false);
      toast.success('Nota actualizada');
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Error al actualizar la nota');
    }
  };

  const handleDeleteNota = async (noteId: string) => {
    try {
      await NoteService.delete(noteId);
      setNotas((prev) => prev.filter((n) => n.id !== noteId));
      toast.success('Nota eliminada');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Error al eliminar la nota');
    }
  };

  const onConfirmDelete = async () => {
    if (notaAEliminar) {
      await handleDeleteNota(notaAEliminar);
      setNotaAEliminar(null);
    }
  };

  const notasFiltradas = useMemo(() => {
    const filtered =
      filtrosActivos.length === 0
        ? notas
        : notas.filter((nota) => filtrosActivos.includes(nota.user_id));

    return [...filtered].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [notas, filtrosActivos]);

  if (loading && notas.length === 0) {
    return <SectionSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Notas Familiares</h2>
          <p className="text-sm text-muted-foreground mt-1">Comparte pensamientos, recordatorios o listas con tu familia</p>
        </div>
        <Button
          className="bg-gradient-to-br from-primary via-primary to-primary/80 hover:shadow-lg hover:shadow-primary/50 text-primary-foreground shadow-md shadow-primary/30 transition-all duration-300 active:scale-95 sm:w-auto w-full"
          onClick={() => {
            setNotaAEditar(undefined);
            setIsNuevaNotaOpen(true);
          }}
        >
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
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
            <span>
              Mostrando {notasFiltradas.length} de {notas.length} nota
              {notas.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notasFiltradas.map((nota) => (
              <NotaCard
                key={nota.id}
                nota={nota}
                onDelete={() => setNotaAEliminar(nota.id)}
                onEdit={() => setNotaAEditar(nota)}
                currentUserId={usuario?.id}
              />
            ))}
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
                titulo: notaAEditar.title || '',
                contenido: notaAEditar.content || '',
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
