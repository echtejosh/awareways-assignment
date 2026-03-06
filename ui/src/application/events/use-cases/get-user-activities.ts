import type { UserId } from "@/domain/common/value-objects/user-id"
import type {
  ActivityFilters,
  EventRepository,
} from "@/domain/events/repositories/event-repository"

export class GetUserActivitiesUseCase {
  private readonly eventRepository: EventRepository

  constructor(eventRepository: EventRepository) {
    this.eventRepository = eventRepository
  }

  execute(userId: UserId, filters: ActivityFilters) {
    return this.eventRepository.getActivities(userId, filters)
  }
}
