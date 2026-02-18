import { fetchClient, ApiError } from '@/lib/api-client';

export interface ListItem {
  id: string;
  title: string;
  family_id: string;
  category: string | undefined;
  quantity: number;
  purchased: boolean;
  created_at: string;
}

export const ListService = {
  async getItems(category?: string): Promise<ListItem[]> {
    const queryString = category ? `?category=${encodeURIComponent(category)}` : '';
    return fetchClient<ListItem[]>(`/api/v1/lists/items${queryString}`);
  },

  async getCategories(): Promise<string[]> {
    const categories = await fetchClient<string[]>('/api/v1/lists/categories');
    return categories.filter(cat => cat !== 'Otros');
  },

  async create(item: {
    title: string;
    family_id: string;
    category?: string;
    quantity?: number;
    purchased?: boolean;
  }): Promise<ListItem> {
    return fetchClient<ListItem>('/api/v1/lists/items', {
      method: 'POST',
      body: item,
    });
  },

  async update(itemId: string, updates: Partial<ListItem>): Promise<ListItem> {
    return fetchClient<ListItem>(`/api/v1/lists/items/${itemId}`, {
      method: 'PUT',
      body: updates,
    });
  },

  async delete(itemId: string): Promise<void> {
    return fetchClient(`/api/v1/lists/items/${itemId}`, {
      method: 'DELETE',
    });
  },

  async deleteBatch(itemIds: string[]): Promise<void> {
    try {
      return await fetchClient(`/api/v1/lists/items/batch`, {
        method: 'POST',
        body: { ids: itemIds },
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        await Promise.all(itemIds.map((id) => ListService.delete(id)));
        return;
      }
      throw error;
    }
  },
};
