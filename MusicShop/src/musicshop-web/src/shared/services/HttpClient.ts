import { HttpError } from './HttpError';

export interface HttpOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
}

class HttpClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
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
