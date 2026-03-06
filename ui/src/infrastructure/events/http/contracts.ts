import type { EventType } from "@/domain/events/value-objects/event-type"

export type ActivityApiDto = {
  id: string
  user_id: string
  event_type: EventType
  occurred_at: string
  payload: Record<string, unknown>
  ingested_at: string
}

export type ActivitiesApiResponse = {
  data: ActivityApiDto[]
  meta: {
    user_id: string
    limit: number
    from: string | null
    to: string | null
    count: number
  }
}

export type MetricsApiResponse = {
  data: {
    user_id: string
    from: string
    to: string
    total_events: number
    event_counts: Record<EventType, number>
    total_points: number
    completed_trainings: number
    started_trainings: number
    progress_events: number
    active_days: number
    latest_activity: string | null
  }
}

export type CreateEventApiRequest = {
  user_id: string
  event_type: EventType
  occurred_at: string
  payload: Record<string, unknown>
}

export type CreateEventApiResponse = {
  data: ActivityApiDto
}
