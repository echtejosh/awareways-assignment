import type { UserId } from "@/domain/common/value-objects/user-id"
import type { EventType } from "@/domain/events/value-objects/event-type"
import type { EventRepository } from "@/domain/events/repositories/event-repository"

export type IngestEventInput = {
  userId: UserId
  eventType: EventType
  occurredAt: string
  payload: Record<string, unknown>
}

export class IngestEventUseCase {
  private readonly eventRepository: EventRepository

  constructor(eventRepository: EventRepository) {
    this.eventRepository = eventRepository
  }

  execute(input: IngestEventInput) {
    return this.eventRepository.createEvent({
      userId: input.userId,
      eventType: input.eventType,
      occurredAt: input.occurredAt,
      payload: input.payload,
    })
  }
}
