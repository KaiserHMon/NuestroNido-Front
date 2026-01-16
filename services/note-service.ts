import { fetchClient } from '@/lib/api-client';
import { Nota } from '@/lib/types';

export const NoteService = {
  async getNotes(): Promise<Nota[]> {
    return fetchClient<Nota[]>('/api/notes/');
  },

  async create(note: {
    title: string;
    family_id: string;
    user_id: string;
    content?: string;
  }): Promise<Nota> {
    return fetchClient<Nota>('/api/notes/', {
      method: 'POST',
      body: note,
    });
  },

  async update(noteId: string, updates: Partial<Nota>): Promise<Nota> {
    return fetchClient<Nota>(`/api/notes/${noteId}`, {
      method: 'PUT',
      body: updates,
    });
  },

  async delete(noteId: string): Promise<void> {
    return fetchClient(`/api/notes/${noteId}`, {
      method: 'DELETE',
    });
  },
};
