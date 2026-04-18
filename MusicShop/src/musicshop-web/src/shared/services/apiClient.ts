const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export interface ApiError extends Error {
  response?: {
    data: any; // The raw error response from API
    status: number;
  };
}

/**
 * A lightweight wrapper around the native fetch API to mimic Axios-like behavior
 * such as baseURL, header injection, and default JSON handling.
 */
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<{ data: T }> {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // Get token from localStorage (Vite/Client-side only)
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  try {
    const response = await fetch(url, config);
    
    // Parse JSON safely
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        // Mocking Axios error behavior for consistent handle in services
        const error = new Error(data?.message || 'API Request failed') as ApiError;
        error.response = { data, status: response.status };
        throw error;
    }

    return { data };
  } catch (error) {
    throw error;
  }
}

const api = {
  get: <T>(url: string, options?: RequestInit) => apiRequest<T>(url, { ...options, method: 'GET' }),
  post: <T>(url: string, body: unknown, options?: RequestInit) => 
    apiRequest<T>(url, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: <T>(url: string, body: unknown, options?: RequestInit) => 
    apiRequest<T>(url, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(url: string, body: unknown, options?: RequestInit) => 
    apiRequest<T>(url, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(url: string, options?: RequestInit) => apiRequest<T>(url, { ...options, method: 'DELETE' }),
};

export default api;
