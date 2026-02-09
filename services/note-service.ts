import { fetchClient } from '@/lib/api-client';
import { Nota } from '@/lib/types';

export const NoteService = {
  async getNotes(): Promise<Nota[]> {
    return fetchClient<Nota[]>('/api/v1/notes/');
  },

  async create(note: {
    titulo: string;
    family_id: string;
    user_id: string;
    contenido?: string;
  }): Promise<Nota> {
    return fetchClient<Nota>('/api/v1/notes/', {
      method: 'POST',
      body: note,
    });
  },

  async update(noteId: string, updates: Partial<Nota>): Promise<Nota> {
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
