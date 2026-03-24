/**
 * HTTP API client for ReviewWeb.site API
 * Handles all HTTP requests with proper headers and error handling
 */

import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';
import FormData from 'form-data';
import { API_BASE_URL } from '../config/constants.js';
import { ApiError } from './error-handling-utilities.js';

let apiClient: AxiosInstance | null = null;

export function createApiClient(apiKey: string, baseUrl?: string): AxiosInstance {
  apiClient = axios.create({
    baseURL: baseUrl || API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    timeout: 120000, // 2 minutes default timeout for long operations
  });

  return apiClient;
}

export function getApiClient(): AxiosInstance {
  if (!apiClient) {
    throw new ApiError('API client not initialized. Call createApiClient first.', 'CLIENT_NOT_INITIALIZED');
  }
  return apiClient;
}

export async function apiGet<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
  try {
    const client = getApiClient();
    const response = await client.get<T>(path, config);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function apiPost<T>(
  path: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const client = getApiClient();
    const response = await client.post<T>(path, data, config);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function apiPatch<T>(
  path: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const client = getApiClient();
    const response = await client.patch<T>(path, data, config);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function apiDelete<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
  try {
    const client = getApiClient();
    const response = await client.delete<T>(path, config);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function apiPostFormData<T>(path: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
  if (!apiClient) throw new ApiError('API client not initialized. Call createApiClient() first.', 'API_ERROR');
  try {
    const response = await apiClient.post<T>(path, formData, {
      ...config,
      headers: {
        ...apiClient.defaults.headers.common,
        ...formData.getHeaders(),
      },
      maxContentLength: 50 * 1024 * 1024,
      maxBodyLength: 50 * 1024 * 1024,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      const message = (data as { message?: string; error?: string })?.message
        || (data as { message?: string; error?: string })?.error
        || 'API request failed';
      if (status === 401 || status === 403) throw new ApiError(message, 'AUTH_ERROR', status);
      if (status === 404) throw new ApiError(message, 'NOT_FOUND', status);
      if (status === 429) throw new ApiError(message, 'RATE_LIMITED', status);
      throw new ApiError(message, 'API_ERROR', status);
    }
    throw new ApiError(error instanceof Error ? error.message : 'Unknown error', 'API_ERROR');
  }
}

function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    const status = axiosError.response?.status;
    const data = axiosError.response?.data;

    let message = 'API request failed';
    let code = 'API_ERROR';

    if (data?.message) {
      message = data.message;
    } else if (data?.error) {
      message = data.error;
    } else if (axiosError.message) {
      message = axiosError.message;
    }

    if (status === 401 || status === 403) {
      code = 'AUTH_ERROR';
      message = message || 'Authentication failed. Check your API key.';
    } else if (status === 404) {
      code = 'NOT_FOUND';
    } else if (status === 429) {
      code = 'RATE_LIMITED';
      message = message || 'Rate limit exceeded. Please try again later.';
    } else if (status && status >= 500) {
      code = 'SERVER_ERROR';
    }

    return new ApiError(message, code, status);
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 'UNKNOWN_ERROR');
  }

  return new ApiError('An unknown error occurred', 'UNKNOWN_ERROR');
}
