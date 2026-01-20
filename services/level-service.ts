import { fetchClient } from '@/lib/api-client';
import { Level } from '@/lib/types';

export const LevelService = {
  async getLevels(): Promise<Level[]> {
    return await fetchClient<Level[]>('/api/levels/');
  },
};
