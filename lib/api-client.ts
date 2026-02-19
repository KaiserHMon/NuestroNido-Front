import { TokenService } from '@/services/token-service';

// Use relative URL to route requests through the Next.js API proxy
// This ensures HttpOnly cookies are automatically attached and prevents CORS issues
export const API_BASE_URL = '';

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

export async function fetchClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, requiresAuth = true } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  // Requests are routed through the local proxy (/api/...) which handles authentication
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.status === 401 && requiresAuth) {
    // Attempt to refresh the session via the proxy
    try {
      const refreshResponse = await fetch('/api/auth/refresh', {
        method: 'POST',
      });

      if (refreshResponse.ok) {
        // The refresh response automatically updates the HttpOnly cookies

        // Retry the original request
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (!retryResponse.ok) {
          const retryData = await retryResponse.json().catch(() => ({}));
          throw new ApiError(retryResponse.status, retryResponse.statusText, retryData);
        }

        return retryResponse.json() as T;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    }

    // If refresh failed, clear local session data and logout
    TokenService.clearSession();

    // Call logout endpoint to clear cookies
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-logout'));
    }
  }

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(response.status, response.statusText, responseData);
  }

  return responseData as T;
}
