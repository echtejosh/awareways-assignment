import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"

import { eventQueryKeys } from "@/application/events/query-keys"
import { useUserIdParam } from "@/features/user/use-user-id-param"
import { NoUserSelectedState } from "@/features/user/components/NoUserSelectedState"
import { ActivitiesTable } from "@/features/dashboard/components/ActivitiesTable"
import { EventCountsChart } from "@/features/dashboard/components/EventCountsChart"
import { MetricsCards } from "@/features/dashboard/components/MetricsCards"
import { readDashboardSearchFilters } from "@/features/dashboard/dashboard-search-filters"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Card,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { getErrorMessage } from "@/infrastructure/http/api-request-error"
import {
  getUserActivitiesUseCase,
  getUserMetricsUseCase,
} from "@/infrastructure/di/container"

/**
 * Dashboard entry page that composes the metrics cards, timeline, and activity table.
 */
export function DashboardPage() {
  const [searchParams] = useSearchParams()
  const { userId, userIdObject, hasUserId, isValidUserId } = useUserIdParam()
  const appliedFilters = readDashboardSearchFilters(searchParams)

  const metricsQuery = useQuery({
    queryKey: eventQueryKeys.metrics(userId, appliedFilters.from, appliedFilters.to),
    queryFn: () =>
      getUserMetricsUseCase.execute(userIdObject!, {
        from: appliedFilters.from,
        to: appliedFilters.to,
      }),
    enabled: isValidUserId,
  })

  const activitiesQuery = useQuery({
    queryKey: eventQueryKeys.activities(
      userId,
      appliedFilters.from,
      appliedFilters.to,
      appliedFilters.limit
    ),
    queryFn: () =>
      getUserActivitiesUseCase.execute(userIdObject!, {
        from: appliedFilters.from,
        to: appliedFilters.to,
        limit: appliedFilters.limit,
      }),
    enabled: isValidUserId,
  })

  if (!hasUserId) {
    return (
      <NoUserSelectedState
        title="No user selected"
        description="Create a user or select an existing one to load the activity dashboard."
      />
    )
  }

  if (!isValidUserId) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Invalid user ID</AlertTitle>
        <AlertDescription>
          The current <code>user_id</code> query parameter is not a valid UUID.
        </AlertDescription>
      </Alert>
    )
  }

  const isLoading = metricsQuery.isLoading || activitiesQuery.isLoading
  const error = metricsQuery.error ?? activitiesQuery.error

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden bg-card">
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-5">
            <div className="space-y-4">
              <div className="space-y-1">
                <h1 className="text-3xl font-semibold tracking-tight">
                  User Activity Dashboard
                </h1>
                <CardDescription className="max-w-2xl text-sm text-muted-foreground">
                  Review the user timeline, engagement totals, and event mix from a
                  single dashboard view.
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Failed to load dashboard data</AlertTitle>
          <AlertDescription>{getErrorMessage(error)}</AlertDescription>
        </Alert>
      ) : null}

      <MetricsCards metrics={metricsQuery.data} isLoading={isLoading} />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <EventCountsChart
          activities={activitiesQuery.data?.items}
          isLoading={isLoading}
        />
        <ActivitiesTable
          activities={activitiesQuery.data?.items}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
