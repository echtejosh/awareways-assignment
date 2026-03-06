import type { UserId } from "@/domain/common/value-objects/user-id"
import type { EventType } from "@/domain/events/value-objects/event-type"
import type { EventRepository } from "@/domain/events/repositories/event-repository"

/**
 * Input required to ingest one activity event from the UI.
 */
export type IngestEventInput = {
  userId: UserId
  eventType: EventType
  occurredAt: string
  payload: Record<string, unknown>
}

/**
 * Thin application use case over the event repository write port.
 */
export class IngestEventUseCase {
  private readonly eventRepository: EventRepository

  constructor(eventRepository: EventRepository) {
    this.eventRepository = eventRepository
  }

  /**
   * Submits a single event to the backend write endpoint.
   */
  execute(input: IngestEventInput) {
    return this.eventRepository.createEvent({
      userId: input.userId,
      eventType: input.eventType,
      occurredAt: input.occurredAt,
      payload: input.payload,
    })
  }
}
