import type { UserId } from "@/domain/common/value-objects/user-id"
import type {
  ActivitiesResult,
  Activity,
} from "@/domain/events/entities/activity"
import type { Metrics } from "@/domain/events/entities/metrics"
import type {
  ActivityFilters,
  CreateEventCommand,
  EventRepository,
  MetricsFilters,
} from "@/domain/events/repositories/event-repository"
import type {
  ActivitiesApiResponse,
  ActivityApiDto,
  CreateEventApiRequest,
  CreateEventApiResponse,
  MetricsApiResponse,
} from "@/infrastructure/events/http/contracts"
import { fetchJson } from "@/infrastructure/http/fetch-json"

/**
 * Serializes optional query filters while skipping empty values.
 */
function queryString(params: Record<string, string | number | undefined>): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === "") {
      return
    }
    searchParams.set(key, String(value))
  })

  const serialized = searchParams.toString()
  return serialized ? `?${serialized}` : ""
}

/**
 * Translates backend DTO field names into the UI domain entity shape.
 */
function mapActivity(dto: ActivityApiDto): Activity {
  return {
    id: dto.id,
    userId: dto.user_id,
    eventType: dto.event_type,
    occurredAt: dto.occurred_at,
    payload: dto.payload,
    ingestedAt: dto.ingested_at,
  }
}

/**
 * HTTP-backed implementation of the event repository port.
 */
export class HttpEventRepository implements EventRepository {
  /**
   * Loads the recent activity slice for the selected user.
   */
  async getActivities(
    userId: UserId,
    filters: ActivityFilters
  ): Promise<ActivitiesResult> {
    const qs = queryString({
      from: filters.from,
      to: filters.to,
      limit: filters.limit,
    })

    const response = await fetchJson<ActivitiesApiResponse>(
      `/users/${userId.toString()}/activities${qs}`
    )

    return {
      items: response.data.map(mapActivity),
      meta: {
        userId: response.meta.user_id,
        limit: response.meta.limit,
        from: response.meta.from,
        to: response.meta.to,
        count: response.meta.count,
      },
    }
  }

  /**
   * Loads the aggregate metrics contract consumed by the dashboard cards.
   */
  async getMetrics(userId: UserId, filters: MetricsFilters): Promise<Metrics> {
    const qs = queryString({
      from: filters.from,
      to: filters.to,
    })

    const response = await fetchJson<MetricsApiResponse>(
      `/users/${userId.toString()}/metrics${qs}`
    )

    return {
      userId: response.data.user_id,
      from: response.data.from,
      to: response.data.to,
      totalEvents: response.data.total_events,
      eventCounts: response.data.event_counts,
      totalPoints: response.data.total_points,
      completedTrainings: response.data.completed_trainings,
      startedTrainings: response.data.started_trainings,
      progressEvents: response.data.progress_events,
      activeDays: response.data.active_days,
      latestActivity: response.data.latest_activity,
    }
  }

  /**
   * Sends one activity event to the ingestion endpoint.
   */
  async createEvent(command: CreateEventCommand): Promise<Activity> {
    const payload: CreateEventApiRequest = {
      user_id: command.userId.toString(),
      event_type: command.eventType,
      occurred_at: command.occurredAt,
      payload: command.payload,
    }

    const response = await fetchJson<CreateEventApiResponse>("/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    return mapActivity(response.data)
  }
}
