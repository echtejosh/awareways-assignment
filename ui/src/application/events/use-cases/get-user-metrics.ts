import type { UserId } from "@/domain/common/value-objects/user-id"
import type {
  EventRepository,
  MetricsFilters,
} from "@/domain/events/repositories/event-repository"

/**
 * Reads the aggregate metrics model for one user.
 */
export class GetUserMetricsUseCase {
  private readonly eventRepository: EventRepository

  constructor(eventRepository: EventRepository) {
    this.eventRepository = eventRepository
  }

  /**
   * Delegates the metrics query to the repository port.
   */
  execute(userId: UserId, filters: MetricsFilters) {
    return this.eventRepository.getMetrics(userId, filters)
  }
}
