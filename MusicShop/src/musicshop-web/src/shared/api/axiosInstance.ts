import axios, { AxiosError, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios';

/**
 * Custom Axios instance type that reflects the behavior of our response interceptor
 * (it returns response.data directly) and adds the onUnauthorized hook.
 */
export interface AppAxiosInstance {
  onUnauthorized?: () => void;
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  defaults: any;
  interceptors: any;
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor: Attach the access token to the Authorization header.
 * We read from localStorage to keep state consistent between tabs.
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.map((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

/**
 * Response Interceptor: 
 * 1. Success: Return data directly (matching legacy HttpClient behavior).
 * 2. Error: Handle 401 Unauthorized with Refresh Token logic.
 */
axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 and avoid infinite loops
    if (
      error.response?.status === 401 && 
      originalRequest &&
      !originalRequest._retry && 
      !originalRequest.url?.includes('/auth/login') && 
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        // Wait for the current refresh to finish
        return new Promise((resolve) => {
          addRefreshSubscriber((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(axiosInstance(originalRequest as any));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt refresh using separate axios call to avoid interceptors or recursion
        const response = await axios.post(
          `${axiosInstance.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);

        isRefreshing = false;
        onTokenRefreshed(accessToken);

        // Update authorization header and retry original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return axiosInstance(originalRequest as any);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = []; // Clear queue on failure

        // Refresh failed (e.g. 400 Bad Request or 401 Logout)
        localStorage.removeItem('accessToken');
        (axiosInstance as any).onUnauthorized?.();
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance as unknown as AppAxiosInstance;
