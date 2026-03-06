import type { EventType } from "@/domain/events/value-objects/event-type"

export type SubmittedEventRequest = {
  user_id: string
  event_type: EventType
  occurred_at: string
  payload: Record<string, unknown>
}

export function buildEventRequestCurlCommand(request: SubmittedEventRequest) {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api"
  const resolvedBaseUrl = apiBaseUrl.startsWith("http")
    ? apiBaseUrl
    : `${window.location.origin}${apiBaseUrl.startsWith("/") ? apiBaseUrl : `/${apiBaseUrl}`}`
  const requestBody = JSON.stringify(request, null, 2).replace(/'/g, "'\\''")

  return [
    `curl -X POST "${resolvedBaseUrl}/events" \\`,
    '  -H "Content-Type: application/json" \\',
    `  -d '${requestBody}'`,
  ].join("\n")
}
