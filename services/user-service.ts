import { fetchClient } from '@/lib/api-client';
import { Usuario } from '@/lib/types';
import { getColorById } from '@/lib/colors';

interface ApiUserResponse {
  id: string;
  name: string;
  color?: { id?: string; name?: string; bg?: string } | string;
  level?: { name?: string; image_url?: string };
  task_completed?: number;
}

export const UserService = {
  async getUser(userId: string): Promise<Usuario> {
    const response = await fetchClient<ApiUserResponse>(`/api/users/${userId}`);
    
    let colorData: { id?: string; name?: string; bg?: string } = { name: 'Gris', bg: '#9CA3AF', id: 'default' };
    if (typeof response.color === 'string') {
        const found = getColorById(response.color);
        if (found) colorData = found;
    } else if (response.color) {
        colorData = response.color;
    }

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
    
    let colorData: { id?: string; name?: string; bg?: string } = { name: 'Gris', bg: '#9CA3AF', id: 'default' };
    if (typeof response.color === 'string') {
        const found = getColorById(response.color);
        if (found) colorData = found;
    } else if (response.color) {
        colorData = response.color;
    }

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

  async deleteUser(userId: string): Promise<void> {
    await fetchClient(`/api/users/${userId}`, {
      method: 'DELETE',
    });
  },
};
