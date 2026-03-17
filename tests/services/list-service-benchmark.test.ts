import { describe, it, vi } from 'vitest';
import { ListService } from '../../services/list-service';
import { fetchClient, ApiError } from '../../lib/api-client';

vi.mock('../../lib/api-client', () => ({
  fetchClient: vi.fn(),
  ApiError: class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
    }
  },
}));

describe('deleteBatch Performance Benchmark', () => {
  it('benchmark deleteBatch fallback', async () => {
    vi.mocked(fetchClient).mockImplementation(async (url: string) => {
      if (url.includes('batch')) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        throw new ApiError(404, 'Not Found');
      }
      // simulate network delay for individual deletes
      await new Promise((resolve) => setTimeout(resolve, 50));
      return {};
    });

    const itemIds = Array.from({ length: 100 }, (_, i) => String(i));

    let failed = false;
    const start = global.performance.now();
    try {
      await ListService.deleteBatch(itemIds);
    } catch {
      failed = true;
    }
    const end = global.performance.now();

    console.log(
      `Time taken: ${end - start}ms, Failed: ${failed}, Calls to fetchClient: ${vi.mocked(fetchClient).mock.calls.length}`
    );
  });
});
