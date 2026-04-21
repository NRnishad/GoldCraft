const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001/api";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  token?: string,
) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });

  const data = (await response.json().catch(() => null)) as ApiResponse<T> | {
    message?: string;
  } | null;

  if (!response.ok) {
    throw new Error(data?.message ?? "Request failed");
  }

  return data as ApiResponse<T>;
}

