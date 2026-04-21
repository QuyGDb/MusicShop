import axios, { InternalAxiosRequestConfig, AxiosRequestConfig, AxiosInstance, AxiosResponseHeaders, AxiosInterceptorManager, AxiosResponse } from 'axios';
import createAuthRefresh from 'axios-auth-refresh';
import { getAccessToken, setAccessToken } from './tokenStore';

/**
 * Custom Axios instance type that reflects the behavior of the response interceptor
 * (it returns response.data directly) and adds the onUnauthorized hook.
 */
export interface AppAxiosInstance extends AxiosInstance {
  onUnauthorized?: () => void;
  // Overload methods to reflect that they return T instead of AxiosResponse<T>
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  defaults: AxiosInstance['defaults'];
  interceptors: {
    request: AxiosInterceptorManager<InternalAxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
  };
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
}) as AppAxiosInstance;

/**
 * Request Interceptor: Attach the access token to the Authorization header.
 * We read from the in-memory tokenStore for security.
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Refresh Token Logic for axios-auth-refresh
 */
const refreshAuthLogic = async (failedRequest: { response: AxiosResponse }) => {
  // Skip refresh logic for auth endpoints to avoid infinite loops
  if (failedRequest.response.config.url?.includes('/auth/login') || 
      failedRequest.response.config.url?.includes('/auth/refresh')) {
    return Promise.reject(failedRequest);
  }

  try {
    const response = await axios.post(
      `${axiosInstance.defaults.baseURL}/auth/refresh`,
      {},
      { withCredentials: true }
    );

    const { accessToken } = response.data.data;
    setAccessToken(accessToken);

    // Update the header of the failed request and resume it
    if (failedRequest.response.config.headers) {
      failedRequest.response.config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    return Promise.resolve();
  } catch (refreshError) {
    // If refresh fails, clear auth state and notify UI
    setAccessToken(null);
    axiosInstance.onUnauthorized?.();
    return Promise.reject(refreshError);
  }
};

// Instantiate the interceptor
createAuthRefresh(axiosInstance, refreshAuthLogic);

/**
 * Response Interceptor: 
 * Return data directly (matching legacy HttpClient behavior).
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => Promise.reject(error)
);

export default axiosInstance;
