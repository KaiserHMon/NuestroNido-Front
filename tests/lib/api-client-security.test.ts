import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('API_BASE_URL Security Check', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should throw an error when NEXT_PUBLIC_API_URL is not set', async () => {
    delete process.env.NEXT_PUBLIC_API_URL;

    await expect(import('@/lib/api-client')).rejects.toThrow(
      'NEXT_PUBLIC_API_URL environment variable is not set'
    );
  });

  it('should use the environment variable when set', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';
    const { API_BASE_URL } = await import('@/lib/api-client');
    expect(API_BASE_URL).toBe('https://api.example.com');
  });
});

