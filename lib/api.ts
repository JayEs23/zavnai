import { getSession } from "next-auth/react";

/**
 * API client for ZAVN backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type ApiResponse<T> = {
  data?: T;
  error?: {
    message: string;
    status: number;
    data?: unknown;
  };
};

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
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

  if (typeof window !== 'undefined') {
    const session = await getSession();
    const token = (session as { accessToken?: string } | null)?.accessToken;

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    } else {
      const localToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (localToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${localToken}`,
        };
      }
    }
  }

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (networkErr) {
    // Instead of throwing, return error object
    return {
      error: {
        message: "Network request failed",
        status: 0,
        data: networkErr,
      },
    };
  }

  let responseData: unknown;
  try {
    responseData = await response.json();
  } catch (jsonErr) {
    responseData = {};
  }

  if (!response.ok) {
    return {
      error: {
        message:
          (responseData && typeof responseData === "object"
            ? (responseData as { detail?: string; message?: string }).detail ||
              (responseData as { detail?: string; message?: string }).message
            : undefined) || 'An error occurred',
        status: response.status,
        data: responseData,
      },
      data: undefined,
    };
  }

  return {
    data: responseData as T,
    error: undefined,
  };
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T, D = unknown>(endpoint: string, data?: D) =>
    request<T>(endpoint, {
      method: 'POST',
      body: typeof data !== "undefined" ? JSON.stringify(data) : undefined,
    }),
  put: <T, D = unknown>(endpoint: string, data?: D) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: typeof data !== "undefined" ? JSON.stringify(data) : undefined,
    }),
  patch: <T, D = unknown>(endpoint: string, data?: D) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: typeof data !== "undefined" ? JSON.stringify(data) : undefined,
    }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};
