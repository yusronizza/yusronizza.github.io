const API_BASE = `${process.env.API_URL ?? "http://localhost:8080"}/api/v1`;
const CLIENT_KEY = process.env.API_CLIENT_KEY;

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
  const baseHeaders: Record<string, string> = { "Content-Type": "application/json" };
  if (CLIENT_KEY) baseHeaders["X-Client-Key"] = CLIENT_KEY;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: { ...baseHeaders, ...(init?.headers as Record<string, string> | undefined) },
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
