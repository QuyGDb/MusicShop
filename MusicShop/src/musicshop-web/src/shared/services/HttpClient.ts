import { HttpError } from './HttpError';

export interface HttpOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
}

class HttpClient {
  private baseURL: string;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // Subscribe to token refresh
  private onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  // Subscribe a request to retry after refresh
  private addRefreshSubscriber(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  // Build URL with query parameters
  private buildURL(endpoint: string, params?: HttpOptions['params']): string {
    const url = new URL(
      endpoint.startsWith('/') ? endpoint.slice(1) : endpoint,
      this.baseURL.endsWith('/') ? this.baseURL : `${this.baseURL}/`
    );

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    return url.toString();
  }

  // Build headers
  private buildHeaders(customHeaders?: HeadersInit): Headers {
    const headers = new Headers(customHeaders);
    headers.set('Content-Type', 'application/json');

    // Get token from localStorage in raw React setup
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  // Core request method
  private async request<T>(
    endpoint: string,
    options: HttpOptions = {}
  ): Promise<T> {
    const { params, headers: customHeaders, ...fetchOptions } = options;
    const url = this.buildURL(endpoint, params);
    const headers = this.buildHeaders(customHeaders);

    const config: RequestInit = {
      ...fetchOptions,
      headers,
      credentials: 'include',
    };

    const response = await fetch(url, config);

    // 1. Handle 401 Unauthorized (Expired Token)
    if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        
        // We attempt refresh if we had an accessToken (session exists)
        // The refreshToken is now strictly in an HttpOnly cookie
        const hasSession = !!localStorage.getItem('accessToken');

        if (hasSession) {
          try {
            // Attempt to refresh token using raw fetch to avoid recursion
            // Credentials 'include' ensures the HttpOnly cookie is sent
            const refreshResponse = await fetch(this.buildURL('/auth/refresh'), {
              method: 'POST',
            });

            if (refreshResponse.ok) {
              const data = await refreshResponse.json();
              const newToken = data.accessToken;

              // Persist new access token and user data
              localStorage.setItem('accessToken', newToken);
              if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
              }

              this.onTokenRefreshed(newToken);
              this.isRefreshing = false;

              // Retry the original request
              return this.request<T>(endpoint, options);
            }
          } catch (error) {
            console.error('Failed to auto-refresh token:', error);
          }
        }

        // If refresh fails or no session, perform cleanup
        this.isRefreshing = false;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        // We don't throw here yet, we let the 401 bubble up as an HttpError below
      } else {
        // If already refreshing, wait for it to complete
        return new Promise<T>((resolve, reject) => {
          this.addRefreshSubscriber((token: string) => {
            this.request<T>(endpoint, options).then(resolve).catch(reject);
          });
        });
      }
    }

    // Parse JSON safely
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new HttpError(
        data?.message || 'Request failed',
        response.status,
        data
      );
    }

    return data as T;
  }

  // Public methods
  get<T>(endpoint: string, options?: HttpOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: unknown, options?: HttpOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put<T>(endpoint: string, body?: unknown, options?: HttpOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  patch<T>(endpoint: string, body?: unknown, options?: HttpOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string, options?: HttpOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export { HttpClient };
