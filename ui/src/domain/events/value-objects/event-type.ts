export const EVENT_TYPES = [
  "training_started",
  "progress_made",
  "points_scored",
  "training_completed",
] as const

export type EventType = (typeof EVENT_TYPES)[number]

export function isEventType(value: string): value is EventType {
  return EVENT_TYPES.includes(value as EventType)
}

