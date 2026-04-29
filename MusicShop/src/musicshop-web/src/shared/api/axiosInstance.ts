import axios, { InternalAxiosRequestConfig, AxiosRequestConfig, AxiosInstance, AxiosResponseHeaders, AxiosInterceptorManager, AxiosResponse } from 'axios';
import createAuthRefresh from 'axios-auth-refresh';
import { getAccessToken, setAccessToken } from './tokenStore';
import { ApiProblemDetails } from '../types/api';

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
 * Singleton promise for handling concurrent refresh token requests.
 */
let refreshPromise: Promise<void> | null = null;

/**
 * Refresh Token Logic for axios-auth-refresh
 */
const refreshAuthLogic = async (failedRequest: { response: AxiosResponse }) => {
  // Skip refresh logic for auth endpoints to avoid infinite loops
  if (failedRequest.response.config.url?.includes('/auth/login') ||
    failedRequest.response.config.url?.includes('/auth/refresh')) {
    return Promise.reject(failedRequest);
  }

  // If a refresh is already in progress, wait for it
  if (refreshPromise) {
    await refreshPromise;
    
    // Update the failed request header with the new token after the existing refresh is done
    const token = getAccessToken();
    if (failedRequest.response.config.headers && token) {
      failedRequest.response.config.headers['Authorization'] = `Bearer ${token}`;
    }
    return Promise.resolve();
  }

  // Create a new refresh promise
  refreshPromise = (async () => {
    try {
      const response = await axios.post(
        `${axiosInstance.defaults.baseURL}/auth/refresh`,
        {},
        { withCredentials: true }
      );

      const { accessToken } = response.data.data;
      setAccessToken(accessToken);
    } catch (refreshError) {
      setAccessToken(null);
      axiosInstance.onUnauthorized?.();
      throw refreshError;
    } finally {
      refreshPromise = null;
    }
  })();

  await refreshPromise;

  // Update the header of the initial failed request
  const token = getAccessToken();
  if (failedRequest.response.config.headers && token) {
    failedRequest.response.config.headers['Authorization'] = `Bearer ${token}`;
  }

  return Promise.resolve();
};

// Instantiate the interceptor
createAuthRefresh(axiosInstance, refreshAuthLogic);

/**
 * Response Interceptor: 
 * Return data directly (matching legacy HttpClient behavior).
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    const data = error.response?.data as ApiProblemDetails;

    // 1. Try to extract from ProblemDetails (RFC 7807)
    if (data?.errors) {
      const firstErrorKey = Object.keys(data.errors)[0];
      const firstErrorMessage = data.errors[firstErrorKey][0];
      error.message = `${firstErrorKey}: ${firstErrorMessage}`;
    } else if (data?.detail) {
      error.message = data.detail;
    } else if (data?.title) {
      error.message = data.title;
    }

    return Promise.reject(new Error(error.message));
  }
);

export default axiosInstance;
