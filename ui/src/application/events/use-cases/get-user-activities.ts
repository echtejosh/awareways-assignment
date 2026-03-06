import type { UserId } from "@/domain/common/value-objects/user-id"
import type {
  ActivityFilters,
  EventRepository,
} from "@/domain/events/repositories/event-repository"

/**
 * Reads the recent activity slice for one user.
 */
export class GetUserActivitiesUseCase {
  private readonly eventRepository: EventRepository

  constructor(eventRepository: EventRepository) {
    this.eventRepository = eventRepository
  }

  /**
   * Delegates the activity query to the repository port.
   */
  execute(userId: UserId, filters: ActivityFilters) {
    return this.eventRepository.getActivities(userId, filters)
  }
}
