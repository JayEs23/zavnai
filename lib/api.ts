import { getSessionDeduped } from "@/lib/next-auth-session";

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
    const session = await getSessionDeduped();
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
  } catch {
    responseData = {};
  }

  if (!response.ok) {
    if (
      response.status === 401 &&
      typeof window !== "undefined" &&
      (config.headers as Record<string, string>)?.Authorization
    ) {
      const returnTo = encodeURIComponent(
        window.location.pathname + window.location.search
      );
      window.location.assign(`/login?callbackUrl=${returnTo}`);
    }
    const errObj =
      responseData && typeof responseData === "object"
        ? (responseData as {
            detail?: string | unknown[] | { message?: string; reason?: string };
            message?: string;
            error?: {
              message?: string;
              details?: { reason?: string };
            };
          })
        : {};

    // Prefer more user-facing messages from common backend envelopes.
    let errMessage =
      errObj.error?.details?.reason ||
      errObj.error?.message ||
      errObj.message;

    if (!errMessage && errObj.detail !== undefined) {
      errMessage = Array.isArray(errObj.detail)
        ? errObj.detail
            .map((e: unknown) =>
              typeof e === "object" && e && "msg" in e ? (e as { msg: string }).msg : String(e)
            )
            .join("; ")
        : typeof errObj.detail === "object" && errObj.detail
          ? ((errObj.detail as { reason?: string; message?: string }).reason ||
            (errObj.detail as { reason?: string; message?: string }).message ||
            String(errObj.detail))
          : String(errObj.detail);
    }
    return {
      error: {
        message: errMessage || 'An error occurred',
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
  /** POST multipart/form-data (e.g. photo verification). Do not pass JSON. */
  postForm: <T>(endpoint: string, formData: FormData) =>
    request<T>(endpoint, { method: 'POST', body: formData }),
  post: <T, D = unknown>(endpoint: string, data?: D) =>
    request<T>(endpoint, {
      method: 'POST',
      body:
        typeof data !== "undefined"
          ? data instanceof FormData
            ? data
            : JSON.stringify(data)
          : undefined,
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
