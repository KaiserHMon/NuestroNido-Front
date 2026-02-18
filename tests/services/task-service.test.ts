import { TaskService } from '@/services/task-service';
import { fetchClient } from '@/lib/api-client';
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

describe('TaskService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getTasks calls fetchClient with correct endpoint', async () => {
    (fetchClient as any).mockResolvedValue([]);
    await TaskService.getTasks();
    expect(fetchClient).toHaveBeenCalledWith('/api/v1/tasks/');
  });
});
