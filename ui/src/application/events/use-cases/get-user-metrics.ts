import type { UserId } from "@/domain/common/value-objects/user-id"
import type {
  EventRepository,
  MetricsFilters,
} from "@/domain/events/repositories/event-repository"

export class GetUserMetricsUseCase {
  private readonly eventRepository: EventRepository

  constructor(eventRepository: EventRepository) {
    this.eventRepository = eventRepository
  }

  execute(userId: UserId, filters: MetricsFilters) {
    return this.eventRepository.getMetrics(userId, filters)
  }
}
