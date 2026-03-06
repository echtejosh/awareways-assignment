import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import type { Activity } from "@/domain/events/entities/activity"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

type EventCountsChartProps = {
  activities?: Activity[]
  isLoading: boolean
}

type TimelinePoint = {
  timestamp: string
  label: string
  events: number
}

const chartConfig = {
  events: {
    label: "Events",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

function LoadingChart() {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-base">Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[260px] w-full" />
      </CardContent>
    </Card>
  )
}

export function EventCountsChart({ activities, isLoading }: EventCountsChartProps) {
  if (isLoading) {
    return <LoadingChart />
  }

  if (!activities) {
    return null
  }

  const chartData = buildTimelineData(activities)

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-base">Activity Timeline</CardTitle>
        <CardDescription>
          Event volume over time for the currently loaded activity stream.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart
              data={chartData}
              margin={{ top: 12, right: 12, left: -16, bottom: 8 }}
            >
              <defs>
                <linearGradient id="timelineFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-events)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--color-events)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
              />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    labelFormatter={(_, payload) => payload?.[0]?.payload?.timestamp ?? ""}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="events"
                stroke="var(--color-events)"
                strokeWidth={2}
                fill="url(#timelineFill)"
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <p className="py-8 text-sm text-muted-foreground">
            No activity points available for the current filter selection.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function buildTimelineData(activities: Activity[]): TimelinePoint[] {
  const sortedActivities = [...activities].sort(
    (left, right) =>
      new Date(left.occurredAt).getTime() - new Date(right.occurredAt).getTime()
  )

  const buckets = new Map<string, TimelinePoint>()

  for (const activity of sortedActivities) {
    const occurredAt = new Date(activity.occurredAt)

    if (Number.isNaN(occurredAt.getTime())) {
      continue
    }

    const timestamp = occurredAt.toISOString()
    const existing = buckets.get(timestamp)

    if (existing) {
      existing.events += 1
      continue
    }

    buckets.set(timestamp, {
      timestamp: occurredAt.toLocaleString(),
      label: formatTimelineLabel(occurredAt, sortedActivities.length),
      events: 1,
    })
  }

  return Array.from(buckets.values())
}

function formatTimelineLabel(value: Date, activityCount: number): string {
  if (activityCount <= 8) {
    return value.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return value.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  })
}
