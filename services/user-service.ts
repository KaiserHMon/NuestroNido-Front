import { fetchClient } from '@/lib/api-client';
import { Usuario } from '@/lib/types';
import { mapColor } from '@/lib/colors';

interface ApiUserResponse {
  id: string;
  name: string;
  color?: { id?: string; name?: string; bg?: string } | string;
  level?: {
    id: string;
    name: string;
    level_number: number;
    required_progress: number;
    image_url?: string;
  };
  experience_points?: number;
}

export const UserService = {
  async getUser(userId: string): Promise<Usuario> {
    const response = await fetchClient<ApiUserResponse>(`/api/v1/users/${userId}`);
    
    const colorData = mapColor(response.color, response.id);

    const levelData = response.level;

    return {
      id: response.id,
      nombre: response.name,
      familiaId: undefined,
      color: colorData,
      experience_points: response.experience_points || 0,
      nivel: levelData
        ? {
            id: levelData.id,
            name: levelData.name,
            level_number: levelData.level_number,
            required_progress: levelData.required_progress,
            image_url: levelData.image_url,
          }
        : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },

  async updateUser(userId: string, data: { name: string }): Promise<Usuario> {
    const response = await fetchClient<ApiUserResponse>(`/api/v1/users/${userId}`, {
      method: 'PUT',
      body: data,
    });
    
    const colorData = mapColor(response.color, response.id);

    // Note: Update usually returns the updated user, but level might not change immediately unless explicitly returned
    const levelData = response.level;

    return {
      id: response.id,
      nombre: response.name,
      familiaId: undefined,
      color: colorData,
      experience_points: response.experience_points || 0,
      nivel: levelData
        ? {
            id: levelData.id,
            name: levelData.name,
            level_number: levelData.level_number,
            required_progress: levelData.required_progress,
            image_url: levelData.image_url,
          }
        : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },

  async deleteUser(userId: string): Promise<void> {
    await fetchClient(`/api/v1/users/${userId}`, {
      method: 'DELETE',
    });
  },
};
