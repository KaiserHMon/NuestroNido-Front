import { fetchClient } from '@/lib/api-client';
import { User } from '@/lib/types';
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
  async getMe(): Promise<User> {
    const response = await fetchClient<ApiUserResponse>('/api/v1/users/me').catch(async (err) => {
      // If 404, retry once after a small delay to handle eventual consistency/latency
      if ((err as { status?: number }).status === 404) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        return fetchClient<ApiUserResponse>('/api/v1/users/me');
      }
      throw err;
    });

    const colorData = mapColor(response.color, response.id);
    const levelData = response.level;

    return {
      id: response.id,
      name: response.name,
      familyId: undefined, // Will be filled if needed or fetched separately
      color: colorData,
      experience_points: response.experience_points || 0,
      level: levelData
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

  async getUser(userId: string): Promise<User> {
    const response = await fetchClient<ApiUserResponse>(`/api/v1/users/${userId}`);
    const colorData = mapColor(response.color, response.id);
    const levelData = response.level;

    return {
      id: response.id,
      name: response.name,
      familyId: undefined,
      color: colorData,
      experience_points: response.experience_points || 0,
      level: levelData
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

  async updateUser(userId: string, data: { name: string }): Promise<User> {
    const response = await fetchClient<ApiUserResponse>(`/api/v1/users/${userId}`, {
      method: 'PUT',
      body: data,
    });
    const colorData = mapColor(response.color, response.id);
    const levelData = response.level;

    return {
      id: response.id,
      name: response.name,
      familyId: undefined,
      color: colorData,
      experience_points: response.experience_points || 0,
      level: levelData
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
