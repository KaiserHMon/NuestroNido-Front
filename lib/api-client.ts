import { TokenService } from '@/services/token-service';

if (!process.env.NEXT_PUBLIC_API_URL) {
  console.warn(
    'Warning: NEXT_PUBLIC_API_URL environment variable is not set. Using default http://localhost:8000'
  );
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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

  if (requiresAuth) {
    const token = TokenService.getToken();
    if (token) {
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.status === 401 && requiresAuth) {
    const refreshToken = TokenService.getRefreshToken();

    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();

          TokenService.setToken(data.access_token);
          if (data.refresh_token) {
            TokenService.setRefreshToken(data.refresh_token);
          }

          if (config.headers) {
            (config.headers as Record<string, string>)['Authorization'] =
              `Bearer ${data.access_token}`;
          }

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
    }

    TokenService.clearSession();
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
