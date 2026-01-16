'use client';

import { useEffect, useState, useCallback } from 'react';
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

interface ApiNote {
  id: string;
  title: string;
  content: string;
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

  const fetchNotas = useCallback(async () => {
    if (!familia) return;
    try {
      setLoading(true);
      const data = await NoteService.getNotes() as unknown as ApiNote[];

      const mappedNotas: Nota[] = data.map((apiNote) => {
        const creatorMember = familia.miembros.find((m) => m.id === apiNote.user_id);
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
          titulo: apiNote.title,
          contenido: apiNote.content || '',
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
  }, [familia]);

  useEffect(() => {
    fetchNotas();
  }, [fetchNotas]);

  const handleCrearNota = async (data: NoteFormData) => {
    if (!familia || !usuario) return;

    try {
      await NoteService.create({
        title: data.titulo,
        content: data.contenido,
        family_id: familia.id,
        user_id: usuario.id,
      });
            fetchNotas();
            setIsNuevaNotaOpen(false);
            toast.success('Nota creada');
          } catch (error) {
              console.error('Error creating note:', error);
              toast.error('Error al crear la nota');
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

  // Filter by creator (user_id) instead of assignees
  const notasFiltradas = (
    filtrosActivos.length === 0
      ? notas
      : notas.filter((nota) => filtrosActivos.some((filtroId) => nota.user_id === filtroId))
  ).sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());

  if (loading && notas.length === 0) {
    return <SectionSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Notas</h2>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsNuevaNotaOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Nota
        </Button>
      </div>

      {familia && familia.miembros.length > 0 && (
        <NotaFilter
          miembros={familia.miembros}
          filtrosActivos={filtrosActivos}
          onFilterChange={setFiltrosActivos}
        />
      )}

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
              const creador = familia?.miembros.find((m) => m.id === nota.user_id);
              return (
                <NotaCard
                  key={nota.id}
                  nota={nota}
                  creador={creador}
                  onDelete={() => handleDeleteNota(nota.id)}
                />
              );
            })}
          </div>
        </div>
      )}

      <CrearNotaDialog
        open={isNuevaNotaOpen}
        onOpenChange={setIsNuevaNotaOpen}
        onSubmit={handleCrearNota}
      />
    </div>
  );
}
