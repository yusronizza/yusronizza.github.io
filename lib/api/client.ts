const getApiBase = () =>
  `${process.env.API_URL ?? "http://localhost:8080"}/api/v1`;

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
  const res = await fetch(`${getApiBase()}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  const json = await res.json();
  if (!res.ok) {
    const err = json?.error ?? {};
    throw new ApiError(
      err.code ?? "UNKNOWN",
      err.message ?? "Unknown error",
      res.status,
      err.field ?? null
    );
  }
  return json;
}
