import { fetchClient } from '@/lib/api-client';
import { Usuario } from '@/lib/types';

interface ApiUserResponse {
  id: string;
  name: string;
  color?: { id?: string; name?: string; bg?: string };
  level?: { name?: string; image_url?: string };
  task_completed?: number;
}

export const UserService = {
  async getUser(userId: string): Promise<Usuario> {
    const response = await fetchClient<ApiUserResponse>(`/api/users/${userId}`);
    const colorData = response.color || { name: 'Gris', bg: '#9CA3AF', id: 'default' };
    const levelData = response.level || {};

    return {
      id: response.id,
      nombre: response.name,
      familiaId: undefined,
      color: {
        id: colorData.id || 'default',
        nombre: colorData.name || 'Gris',
        bg: colorData.bg || '#9CA3AF',
        text: '#FFFFFF',
        accent: colorData.bg || '#9CA3AF',
        wcagContrast: 4.5,
      },
      puntos: response.task_completed || 0,
      nivel: levelData.name
        ? {
            nombre: levelData.name,
            imageUrl: levelData.image_url,
          }
        : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },

  async updateUser(userId: string, data: { name: string }): Promise<Usuario> {
    const response = await fetchClient<ApiUserResponse>(`/api/users/${userId}`, {
      method: 'PUT',
      body: data,
    });
    const colorData = response.color || { name: 'Gris', bg: '#9CA3AF', id: 'default' };

    return {
      id: response.id,
      nombre: response.name,
      familiaId: undefined,
      color: {
        id: colorData.id || 'default',
        nombre: colorData.name || 'Gris',
        bg: colorData.bg || '#9CA3AF',
        text: '#FFFFFF',
        accent: colorData.bg || '#9CA3AF',
        wcagContrast: 4.5,
      },
      puntos: response.task_completed || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },
};
