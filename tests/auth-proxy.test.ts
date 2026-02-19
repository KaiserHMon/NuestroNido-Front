import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST as LoginHandler } from '@/app/api/auth/login/route';
import { GET as MeHandler } from '@/app/api/auth/me/route';
import { POST as LogoutHandler } from '@/app/api/auth/logout/route';
import { GET as ProxyHandler } from '@/app/api/[...path]/route';
import { NextRequest } from 'next/server';

// Mock cookies
const cookieStore = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
};

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve(cookieStore),
}));

// Mock jwt-utils
vi.mock('@/lib/jwt-utils', () => ({
  parseJwt: vi.fn((token) => {
    if (token === 'valid_token') return { sub: 'user123' };
    return null;
  }),
}));

// Mock fetch
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('Auth Proxy Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_API_URL = 'http://backend';
  });

  describe('Login Route', () => {
    it('should set cookies and return userId on success', async () => {
      // Setup fetch mock for backend login
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: 'valid_token',
          refresh_token: 'refresh_token_123',
        }),
      });

      const req = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
      });

      const res = await LoginHandler(req);
      const data = await res.json();

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/auth/login'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('test@example.com'),
        })
      );

      expect(cookieStore.set).toHaveBeenCalledWith('auth_token', 'valid_token', expect.any(Object));
      expect(cookieStore.set).toHaveBeenCalledWith(
        'refresh_token',
        'refresh_token_123',
        expect.any(Object)
      );
      expect(data).toEqual({ success: true, userId: 'user123' });
    });
  });

  describe('Me Route', () => {
    it('should return user data if token is valid', async () => {
      cookieStore.get.mockReturnValue({ value: 'valid_token' });

      // Setup fetch mock for backend user details
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'user123', name: 'Test User' }),
      });

      const res = await MeHandler();
      const data = await res.json();

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/users/user123'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer valid_token',
          }),
        })
      );

      expect(data).toEqual({ id: 'user123', name: 'Test User' });
    });

    it('should return 401 if no token', async () => {
      cookieStore.get.mockReturnValue(undefined);
      const res = await MeHandler();
      expect(res.status).toBe(401);
    });
  });

  describe('Logout Route', () => {
    it('should delete cookies', async () => {
      const res = await LogoutHandler();
      expect(cookieStore.delete).toHaveBeenCalledWith('auth_token');
      expect(cookieStore.delete).toHaveBeenCalledWith('refresh_token');
    });
  });

  describe('Proxy Route', () => {
    it('should forward request with token', async () => {
      cookieStore.get.mockReturnValue({ value: 'valid_token' });

      // Setup fetch mock
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers(),
        blob: async () => new Blob(['{"data":"ok"}']),
      });

      const req = new NextRequest('http://localhost/api/v1/tasks', {
        method: 'GET',
      });

      // Mock params
      const params = Promise.resolve({ path: ['v1', 'tasks'] });

      const res = await ProxyHandler(req, { params });

      const args = fetchMock.mock.calls[0];
      const url = args[0] as string;
      const options = args[1] as RequestInit;

      expect(url).toContain('/api/v1/tasks');
      expect((options.headers as Headers).get('Authorization')).toBe('Bearer valid_token');

      expect(res.status).toBe(200);
    });
  });
});
