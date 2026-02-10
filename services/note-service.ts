import { fetchClient } from '@/lib/api-client';
import { Nota, CrearNotaRequest, ActualizarNotaRequest } from '@/lib/types';

export const NoteService = {
  async getNotes(): Promise<Nota[]> {
    return fetchClient<Nota[]>('/api/v1/notes/');
  },

  async create(note: CrearNotaRequest): Promise<Nota> {
    return fetchClient<Nota>('/api/v1/notes/', {
      method: 'POST',
      body: note,
    });
  },

  async update(noteId: string, updates: ActualizarNotaRequest): Promise<Nota> {
    return fetchClient<Nota>(`/api/v1/notes/${noteId}`, {
      method: 'PUT',
      body: updates,
    });
  },

  async delete(noteId: string): Promise<void> {
    return fetchClient(`/api/v1/notes/${noteId}`, {
      method: 'DELETE',
    });
  },
};
