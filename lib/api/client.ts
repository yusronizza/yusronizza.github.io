const API_BASE = "/api/v1";

type ApiResponse<T> = { data: T };
type ListResponse<T> = { data: T[]; meta: { total: number; limit: number; next_cursor: string | null; prev_cursor: string | null } };

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly field: string | null = null
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  const json = await res.json();
  if (!res.ok) {
    const err = json?.error ?? {};
    throw new ApiError(err.code ?? "UNKNOWN", err.message ?? "Unknown error", res.status, err.field ?? null);
  }
  return json;
}

export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  return request<ApiResponse<T>>(path);
}

export async function apiGetList<T>(path: string): Promise<ListResponse<T>> {
  return request<ListResponse<T>>(path);
}

export async function apiPost<T, B = unknown>(path: string, body: B): Promise<ApiResponse<T>> {
  return request<ApiResponse<T>>(path, { method: "POST", body: JSON.stringify(body) });
}
