import { fetchClient } from '@/lib/api-client';
import { Tarea } from '@/lib/types';

export const TaskService = {
  async getTasks(filter?: string): Promise<Tarea[]> {
    const params = new URLSearchParams();
    if (filter) params.append('filter_by', filter);

    // Using string concat for query params as fetchClient helper doesn't auto-handle object params yet
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return fetchClient<Tarea[]>(`/api/v1/tasks/${queryString}`);
  },

  async create(task: {
    title: string;
    family_id: string;
    assigned_to_user_id?: string;
    recurrence_type: 'none' | 'daily' | 'weekly' | 'monthly';
    week_days?: string | null;
    status?: string;
    due_date: string;
    end_date?: string | null;
  }): Promise<Tarea> {
    return fetchClient<Tarea>('/api/v1/tasks/', {
      method: 'POST',
      body: task,
    });
  },

  async update(taskId: string, updates: Record<string, unknown>): Promise<Tarea> {
    return fetchClient<Tarea>(`/api/v1/tasks/${taskId}`, {
      method: 'PUT',
      body: updates,
    });
  },

  async delete(taskId: string): Promise<void> {
    return fetchClient(`/api/v1/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },
};
