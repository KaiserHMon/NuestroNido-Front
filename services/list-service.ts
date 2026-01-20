import { fetchClient } from '@/lib/api-client';
// Using generic types mostly as ListItem types in lib/types.ts might need alignment
// but let's try to match existing structures.

// Defining ListItem locally if not in types or ensuring we use the right one.
// lib/types.ts didn't explicitly show ListItem, so I'll infer from usages or create interface.
// Reading openapi schemas: ListItemResponse has title, family_id, category, quantity, purchased, id, created_at.

export interface ListItem {
  id: string;
  title: string;
  family_id: string;
  category: string;
  quantity: number;
  purchased: boolean;
  created_at: string;
}

export const ListService = {
  async getItems(category?: string): Promise<ListItem[]> {
    const queryString = category ? `?category=${encodeURIComponent(category)}` : '';
    return fetchClient<ListItem[]>(`/api/lists/items${queryString}`);
  },

  async getCategories(): Promise<string[]> {
    const categories = await fetchClient<string[]>('/api/lists/categories');
    return categories.filter(cat => cat !== 'Otros');
  },

  async create(item: {
    title: string;
    family_id: string;
    category?: string;
    quantity?: number;
    purchased?: boolean;
  }): Promise<ListItem> {
    return fetchClient<ListItem>('/api/lists/items', {
      method: 'POST',
      body: item,
    });
  },

  async update(itemId: string, updates: Partial<ListItem>): Promise<ListItem> {
    return fetchClient<ListItem>(`/api/lists/items/${itemId}`, {
      method: 'PUT',
      body: updates,
    });
  },

  async delete(itemId: string): Promise<void> {
    return fetchClient(`/api/lists/items/${itemId}`, {
      method: 'DELETE',
    });
  },
};
