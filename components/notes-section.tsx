'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Note } from '@/lib/types';
import { NoteCard } from '@/components/note-card';
import { NoteFilter } from '@/components/note-filter';
import { ExpandedNoteModal } from '@/components/expanded-note-modal';
import { CreateNoteDialog } from '@/components/dialogs/create-note-dialog';
import { Button } from '@/components/ui/button';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { Plus } from 'lucide-react';
import { NoteService } from '@/services/note-service';
import { useAuth } from '@/hooks/use-auth';
import { useFamily } from '@/hooks/use-family';
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
  title: string;
  content: string;
}

export function NotesSection() {
  const { user } = useAuth();
  const { family } = useFamily();
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isNewNoteOpen, setIsNewNoteOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [noteToEdit, setNoteToEdit] = useState<Note | undefined>(undefined);
  const [noteToExpand, setNoteToExpand] = useState<Note | null>(null);

  const fetchNotes = useCallback(async () => {
    if (!family) return;
    try {
      setLoading(true);
      const data = await NoteService.getNotes();
      const memberIds = new Set(family.members.map(m => m.id));
      const filteredData = data.filter(n => memberIds.has(n.user_id));
      setNotes(filteredData);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Error al cargar las notas');
    } finally {
      setLoading(false);
    }
  }, [family]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleCreateNote = async (data: NoteFormData) => {
    if (!family || !user) return;

    try {
      const newNote = await NoteService.createNote({
        title: data.title,
        content: data.content,
        family_id: family.id,
      });

      setNotes((prev) => [newNote, ...prev]);
      setIsNewNoteOpen(false);
      toast.success('Nota creada');
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error('Error al crear la nota');
    }
  };

  const handleEditNote = async (data: NoteFormData) => {
    if (!family || !user || !noteToEdit) return;

    try {
      const updatedNote = await NoteService.updateNote(noteToEdit.id, {
        title: data.title,
        content: data.content,
      });

      setNotes((prev) =>
        prev.map((n) => (n.id === updatedNote.id ? updatedNote : n))
      );
      setNoteToEdit(undefined);
      setIsNewNoteOpen(false);
      toast.success('Nota actualizada');
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Error al actualizar la nota');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await NoteService.deleteNote(noteId);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      toast.success('Nota eliminada');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Error al eliminar la nota');
    }
  };

  const onConfirmDelete = async () => {
    if (noteToDelete) {
      await handleDeleteNote(noteToDelete);
      setNoteToDelete(null);
    }
  };

  const filteredNotes = useMemo(() => {
    const filtered =
      activeFilters.length === 0
        ? notes
        : notes.filter((note) => activeFilters.includes(note.user_id));

    return [...filtered].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [notes, activeFilters]);

  if (loading && notes.length === 0) {
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
            setNoteToEdit(undefined);
            setIsNewNoteOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Nota
        </Button>
      </div>

      {family && family.members.length > 0 ? (
        <NoteFilter
          members={family.members}
          activeFilters={activeFilters}
          onFilterChange={setActiveFilters}
        />
      ) : null}

      {filteredNotes.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No hay notas</EmptyTitle>
            <EmptyDescription>
              {activeFilters.length > 0
                ? 'No hay notas que coincidan con los filtros seleccionados'
                : 'Aún no hay notas. ¡Crea una para comenzar!'}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
            <span>
              Mostrando {filteredNotes.length} de {notes.length} nota
              {notes.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={() => setNoteToDelete(note.id)}
                onEdit={() => setNoteToEdit(note)}
                onClick={() => setNoteToExpand(note)}
                currentUserId={user?.id}
              />
            ))}
          </div>
        </div>
      )}

      <ExpandedNoteModal
        note={noteToExpand}
        open={!!noteToExpand}
        onOpenChange={(open: boolean) => !open && setNoteToExpand(null)}
        onEdit={setNoteToEdit}
        onDelete={setNoteToDelete}
        currentUserId={user?.id}
      />

      <CreateNoteDialog
        open={isNewNoteOpen || !!noteToEdit}
        onOpenChange={(open: boolean) => {
          if (!open) setNoteToEdit(undefined);
          setIsNewNoteOpen(open);
        }}
        onSubmit={noteToEdit ? handleEditNote : handleCreateNote}
        noteToEdit={
          noteToEdit
            ? {
                title: noteToEdit.title || '',
                content: noteToEdit.content || '',
              }
            : undefined
        }
      />

      <AlertDialog open={!!noteToDelete} onOpenChange={() => setNoteToDelete(null)}>
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
