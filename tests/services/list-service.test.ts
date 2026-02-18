import { ListService } from '@/services/list-service';
import { fetchClient, ApiError } from '@/lib/api-client';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/lib/api-client', () => ({
  fetchClient: vi.fn(),
  ApiError: class ApiError extends Error {
    status: number;
    constructor(status: number) {
      super();
      this.status = status;
    }
  },
}));

describe('ListService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deleteBatch calls batch endpoint', async () => {
    (fetchClient as any).mockResolvedValue({});
    await ListService.deleteBatch(['1', '2']);
    expect(fetchClient).toHaveBeenCalledWith('/api/v1/lists/items/batch', {
      method: 'POST',
      body: { ids: ['1', '2'] },
    });
  });

  it('deleteBatch falls back to delete on 404', async () => {
    // Mock fetchClient to throw 404 for batch, succeed for single
    (fetchClient as any).mockImplementation((url: string) => {
      if (url.includes('batch')) return Promise.reject(new ApiError(404));
      return Promise.resolve({});
    });

    // We can spy on delete to be sure it's called, but checking fetchClient calls is enough integration test
    const deleteSpy = vi.spyOn(ListService, 'delete');

    await ListService.deleteBatch(['1', '2']);

    expect(deleteSpy).toHaveBeenCalledTimes(2);
    expect(fetchClient).toHaveBeenCalledWith('/api/v1/lists/items/1', { method: 'DELETE' });
    expect(fetchClient).toHaveBeenCalledWith('/api/v1/lists/items/2', { method: 'DELETE' });
  });
});
