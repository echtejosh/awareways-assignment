import { ApiRequestError, type ApiErrorPayload } from "@/infrastructure/http/api-request-error"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api"

function withBaseUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}

async function parseJsonResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? ""

  if (!contentType.includes("application/json")) {
    return null
  }

  return response.json()
}

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

