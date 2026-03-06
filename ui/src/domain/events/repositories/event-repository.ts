import type { UserId } from "@/domain/common/value-objects/user-id"
import type { ActivitiesResult, Activity } from "@/domain/events/entities/activity"
import type { Metrics } from "@/domain/events/entities/metrics"
import type { EventType } from "@/domain/events/value-objects/event-type"

export type ActivityFilters = {
  from?: string
  to?: string
  limit?: number
}

export type MetricsFilters = {
  from?: string
  to?: string
}

export type CreateEventCommand = {
  userId: UserId
  eventType: EventType
  occurredAt: string
  payload: Record<string, unknown>
}

export interface EventRepository {
  getActivities(userId: UserId, filters: ActivityFilters): Promise<ActivitiesResult>
  getMetrics(userId: UserId, filters: MetricsFilters): Promise<Metrics>
  createEvent(command: CreateEventCommand): Promise<Activity>
}
