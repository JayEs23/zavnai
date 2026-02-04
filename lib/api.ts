import { getSession } from "next-auth/react";

/**
 * API client for ZAVN backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Normalize URL to avoid double slashes
  const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${path}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token from NextAuth session if available
  if (typeof window !== 'undefined') {
    const session = await getSession();
    const token = (session as any)?.accessToken;
    
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    } else {
      // Fallback to localStorage for legacy or non-NextAuth flows
      const localToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (localToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${localToken}`,
        };
      }
    }
  } else {
    // If on server side (SSR), we can't use getSession() from next-auth/react easily without req
    // But this client is mainly used in client components
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.detail || errorData.message || 'An error occurred',
      response.status,
      errorData
    );
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, data?: any) =>
    request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
  put: <T>(endpoint: string, data?: any) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};

