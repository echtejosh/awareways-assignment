import { ApiRequestError, type ApiErrorPayload } from "@/infrastructure/http/api-request-error"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api"

/**
 * Prefixes relative API paths with the configured base URL or Vite proxy path.
 */
function withBaseUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}

/**
 * Parses JSON only when the backend actually returned a JSON payload.
 */
async function parseJsonResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? ""

  if (!contentType.includes("application/json")) {
    return null
  }

  return response.json()
}

/**
 * Shared JSON fetch wrapper that normalizes API errors into ApiRequestError.
 */
export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(withBaseUrl(path), {
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
    ...init,
  })

  const parsed = await parseJsonResponse(response)

  if (!response.ok) {
    const payload = (parsed ?? {}) as ApiErrorPayload
    throw new ApiRequestError(
      payload.message ?? "The request failed.",
      response.status,
      payload.errors
    )
  }

  return parsed as T
}
