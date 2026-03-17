import { TokenService } from '@/services/token-service';

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is not set');
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface FetchOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

let refreshPromise: Promise<boolean> | null = null;

async function performRefresh(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      return response.ok;
    } catch (error) {
      // Don't log 401s during refresh as they are expected for unauthenticated users
      if (!(error instanceof ApiError && error.status === 401)) {
        console.error('Error refreshing token:', error);
      }
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function fetchClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, requiresAuth = true } = options;

  const config: RequestInit = {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.status === 401 && requiresAuth) {
    const success = await performRefresh();

    if (success) {
      const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, config);

      if (retryResponse.ok) {
        return retryResponse.json() as T;
      }
    }

    // If we reach here, refresh failed or retry failed
    TokenService.clearSession();

    // Only dispatch logout if we're not already on an auth page
    if (typeof window !== 'undefined') {
      const isAuthPage =
        window.location.pathname.includes('/login') ||
        window.location.pathname.includes('/register');

      if (!isAuthPage) {
        window.dispatchEvent(new Event('auth-logout'));
      }
    }
  }

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(response.status, response.statusText, responseData);
  }

  return responseData as T;
}
