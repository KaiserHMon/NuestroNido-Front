import { fetchClient } from '@/lib/api-client';
<<<<<<< HEAD
import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/lib/types';
=======
import { Task, ApiTask } from '@/lib/types';
>>>>>>> f4270363c654b6614dcbd07e20f44354ce559592

export const TaskService = {
  async getTasks(): Promise<ApiTask[]> {
    return fetchClient<ApiTask[]>('/api/v1/tasks/');
  },

  async createTask(data: CreateTaskRequest): Promise<Task> {
    return fetchClient<Task>('/api/v1/tasks/', {
      method: 'POST',
      body: data,
    });
  },

  async updateTask(taskId: string, data: UpdateTaskRequest): Promise<Task> {
    return fetchClient<Task>(`/api/v1/tasks/${taskId}`, {
      method: 'PUT',
      body: data,
    });
  },

  async deleteTask(taskId: string): Promise<void> {
    return fetchClient(`/api/v1/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },

  async toggleTask(taskId: string): Promise<Task> {
    return fetchClient<Task>(`/api/v1/tasks/${taskId}/toggle`, {
      method: 'POST',
    });
  },
};
