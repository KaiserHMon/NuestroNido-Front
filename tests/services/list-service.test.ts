import { ListService } from '@/services/list-service';
import { fetchClient, ApiError } from '@/lib/api-client';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/lib/api-client', () => ({
  fetchClient: vi.fn(),
  ApiError: class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
    }
  },
}));

describe('ListService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deleteBatch calls batch endpoint', async () => {
    vi.mocked(fetchClient).mockResolvedValue({});
    await ListService.deleteBatch(['1', '2']);
    expect(fetchClient).toHaveBeenCalledWith('/api/v1/lists/items/batch', {
      method: 'POST',
      body: { ids: ['1', '2'] },
    });
  });

  it('deleteBatch throws error if batch fails', async () => {
    // Mock fetchClient to throw 404 for batch
    vi.mocked(fetchClient).mockImplementation((url: string) => {
      if (url.includes('batch')) return Promise.reject(new ApiError(404, 'Not Found'));
      return Promise.resolve({});
    });

    await expect(ListService.deleteBatch(['1', '2'])).rejects.toThrow('Not Found');
  });
});
