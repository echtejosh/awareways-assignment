import type { EventType } from "@/domain/events/value-objects/event-type"

export type Activity = {
  id: string
  userId: string
  eventType: EventType
  occurredAt: string
  payload: Record<string, unknown>
  ingestedAt: string
}

export type ActivitiesResult = {
  items: Activity[]
  meta: {
    userId: string
    limit: number
    from: string | null
    to: string | null
    count: number
  }
}

