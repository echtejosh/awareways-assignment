import type { EventType } from "@/domain/events/value-objects/event-type"

export type Metrics = {
  userId: string
  from: string
  to: string
  totalEvents: number
  eventCounts: Record<EventType, number>
  totalPoints: number
  completedTrainings: number
  startedTrainings: number
  progressEvents: number
  activeDays: number
  latestActivity: string | null
}
