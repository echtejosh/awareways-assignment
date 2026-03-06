import { CreateUserUseCase } from "@/application/users/use-cases/create-user"
import { GetUserActivitiesUseCase } from "@/application/events/use-cases/get-user-activities"
import { GetUserMetricsUseCase } from "@/application/events/use-cases/get-user-metrics"
import { IngestEventUseCase } from "@/application/events/use-cases/ingest-event"
import { SearchUsersUseCase } from "@/application/users/use-cases/search-users"
import { HttpEventRepository } from "@/infrastructure/events/http/http-event-repository"
import { HttpUserDirectoryRepository } from "@/infrastructure/users/http/http-user-directory-repository"

const eventRepository = new HttpEventRepository()
const userDirectoryRepository = new HttpUserDirectoryRepository()

export const getUserActivitiesUseCase = new GetUserActivitiesUseCase(eventRepository)
export const getUserMetricsUseCase = new GetUserMetricsUseCase(eventRepository)
export const ingestEventUseCase = new IngestEventUseCase(eventRepository)
export const searchUsersUseCase = new SearchUsersUseCase(userDirectoryRepository)
export const createUserUseCase = new CreateUserUseCase(userDirectoryRepository)
