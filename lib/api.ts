import { getSession } from "next-auth/react";

/**
 * API client for ZAVN backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Use unknown instead of any for data typing where not known
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
    // Replace any usage with more specific or unknown
    const token = (session as { accessToken?: string } | null)?.accessToken;
    
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

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (networkErr) {
    // Only throw if network truly failed (not "client-side error" for ok: false)
    throw new ApiError(
      "Network request failed",
      0,
      networkErr
    );
  }

  // Only throw for server/network errors client-side if not in the 2xx range
  // But don't throw for 4xx errors if window is defined (client-side)
  if (!response.ok) {
    // Try to parse JSON even if not, otherwise fallback
    const errorData: unknown = await response.json().catch(() => ({}));
    // If running in the browser and status is 400–499, don't throw, just return the data
    if (typeof window !== 'undefined' && response.status >= 400 && response.status < 500) {
      // Return error data typed as T so the frontend can handle gracefully
      return errorData as T;
    }
    throw new ApiError(
      (errorData && typeof errorData === "object"
        ? (errorData as { detail?: string; message?: string }).detail ||
          (errorData as { detail?: string; message?: string }).message
        : undefined) || 'An error occurred',
      response.status,
      errorData
    );
  }

  return response.json();
}

// Use unknown instead of any for data typing, require data type as generic parameter
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
