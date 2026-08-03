const API_BASE = `${process.env.API_URL ?? "http://localhost:8080"}/api/v1`;

export function buildUrl(path: string, qs: URLSearchParams): string {
  const q = qs.toString();
  return q ? `${path}?${q}` : path;
}

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly field: string | null = null
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...init,
    });
  } catch {
    throw new ApiError("NETWORK_ERROR", "Network request failed", 0);
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new ApiError(
      "PARSE_ERROR",
      `HTTP ${res.status}: unexpected response format`,
      res.status
    );
  }

  if (!res.ok) {
    const err = (json as { error?: { code?: string; message?: string; field?: string | null } })
      ?.error ?? {};
    throw new ApiError(
      err.code ?? "UNKNOWN",
      err.message ?? "Unknown error",
      res.status,
      err.field ?? null
    );
  }
  return json as T;
}
