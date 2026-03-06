import {
  BarChart3,
  CalendarClock,
  CheckCircle2,
  Flag,
  Route,
  Star,
} from "lucide-react"

import type { Metrics } from "@/domain/events/entities/metrics"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type MetricsCardsProps = {
  metrics?: Metrics
  isLoading: boolean
}

type MetricCard = {
  label: string
  value: string
  hint: string
  icon: typeof BarChart3
  tone: string
}

function LoadingCard() {
  return (
    <Card className="overflow-hidden bg-card">
      <CardHeader className="pb-3">
        <Skeleton className="h-4 w-28" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-4 w-32" />
      </CardContent>
    </Card>
  )
}

export function MetricsCards({ metrics, isLoading }: MetricsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </div>
    )
  }

  if (!metrics) {
    return null
  }

  const cards: MetricCard[] = [
    {
      label: "Total Events",
      value: metrics.totalEvents.toLocaleString(),
      hint: "All tracked events in the active scope",
      icon: BarChart3,
      tone: "var(--chart-5)",
    },
    {
      label: "Total Points",
      value: metrics.totalPoints.toLocaleString(),
      hint: "Summed from points_scored payload values",
      icon: Star,
      tone: "var(--chart-3)",
    },
    {
      label: "Completed Trainings",
      value: metrics.completedTrainings.toLocaleString(),
      hint: "training_completed events only",
      icon: CheckCircle2,
      tone: "var(--chart-2)",
    },
    {
      label: "Started Trainings",
      value: metrics.startedTrainings.toLocaleString(),
      hint: "training_started events in current scope",
      icon: Flag,
      tone: "var(--chart-4)",
    },
    {
      label: "Progress Events",
      value: metrics.progressEvents.toLocaleString(),
      hint: "progress_made updates across tracked activity",
      icon: Route,
      tone: "var(--chart-5)",
    },
    {
      label: "Active Days",
      value: metrics.activeDays.toLocaleString(),
      hint: metrics.latestActivity
        ? `Latest activity ${formatLatestActivity(metrics.latestActivity)}`
        : "No activity recorded in the current scope",
      icon: CalendarClock,
      tone: "var(--chart-1)",
    },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map(({ label, value, hint, icon: Icon, tone }) => (
        <Card key={label} className="overflow-hidden bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <CardDescription className="text-sm font-semibold text-muted-foreground">
                  {label}
                </CardDescription>
                <CardTitle className="text-3xl font-semibold tracking-tight">
                  {value}
                </CardTitle>
              </div>
              <div
                className="flex size-11 items-center justify-center rounded-full text-black"
                style={{ backgroundColor: tone }}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">{hint}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function formatLatestActivity(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString()
}
