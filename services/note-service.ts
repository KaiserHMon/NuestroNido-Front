import { fetchClient } from '@/lib/api-client';
import { Nota, CrearNotaRequest, ActualizarNotaRequest } from '@/lib/types';
import { mapColor } from '@/lib/colors';

export const NoteService = {
  async getNotes(): Promise<Nota[]> {
    const response = await fetchClient<Nota[]>('/api/v1/notes/');
    return response.map(this.mapNota);
  },

  async create(note: CrearNotaRequest): Promise<Nota> {
    const response = await fetchClient<Nota>('/api/v1/notes/', {
      method: 'POST',
      body: note,
    });
    return this.mapNota(response);
  },

  async update(noteId: string, updates: ActualizarNotaRequest): Promise<Nota> {
    const response = await fetchClient<Nota>(`/api/v1/notes/${noteId}`, {
      method: 'PUT',
      body: updates,
    });
    return this.mapNota(response);
  },

  async delete(noteId: string): Promise<void> {
    return fetchClient(`/api/v1/notes/${noteId}`, {
      method: 'DELETE',
    });
  },

  // Helper para mapear el color del usuario en la nota
  mapNota(nota: Nota): Nota {
    return {
      ...nota,
      user: {
        ...nota.user,
        color: mapColor(nota.user.color, nota.user_id),
      },
    };
  },
};
