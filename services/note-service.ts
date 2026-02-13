import { fetchClient } from '@/lib/api-client';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '@/lib/types';

export const NoteService = {
  async getNotes(): Promise<Note[]> {
    return fetchClient<Note[]>('/api/v1/notes/');
  },

  async getNote(noteId: string): Promise<Note> {
    return fetchClient<Note>(`/api/v1/notes/${noteId}`);
  },

  async createNote(data: CreateNoteRequest): Promise<Note> {
    return fetchClient<Note>('/api/v1/notes/', {
      method: 'POST',
      body: data,
    });
  },

  async updateNote(noteId: string, data: UpdateNoteRequest): Promise<Note> {
    return fetchClient<Note>(`/api/v1/notes/${noteId}`, {
      method: 'PUT',
      body: data,
    });
  },

  async deleteNote(noteId: string): Promise<void> {
    return fetchClient(`/api/v1/notes/${noteId}`, {
      method: 'DELETE',
    });
  },
};
