import type { Activity } from "@/domain/events/entities/activity"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type ActivitiesTableProps = {
  activities?: Activity[]
  isLoading: boolean
}

const EVENT_LABELS: Record<Activity["eventType"], string> = {
  training_started: "Training Started",
  progress_made: "Progress Made",
  points_scored: "Points Scored",
  training_completed: "Training Completed",
}

const EVENT_BADGE_COLORS: Record<Activity["eventType"], string> = {
  training_started: "var(--chart-2)",
  progress_made: "var(--chart-5)",
  points_scored: "var(--chart-3)",
  training_completed: "var(--chart-4)",
}

function renderPayload(payload: Record<string, unknown>): string {
  const text = JSON.stringify(payload)
  if (text.length <= 56) {
    return text
  }

  return `${text.slice(0, 56)}...`
}

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString()
}

function LoadingTable() {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-base">Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}

export function ActivitiesTable({ activities, isLoading }: ActivitiesTableProps) {
  if (isLoading) {
    return <LoadingTable />
  }

  return (
    <Card className="bg-card">
      <CardHeader className="gap-3">
        <CardTitle className="text-base">Recent Activities</CardTitle>
        <CardDescription>
          Latest events returned for the selected scope and activity limit.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activities && activities.length > 0 ? (
          <div className="overflow-hidden rounded-xl bg-card">
            <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Occurred</TableHead>
                <TableHead>Payload</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="text-black"
                      style={{ backgroundColor: EVENT_BADGE_COLORS[activity.eventType] }}
                    >
                      {EVENT_LABELS[activity.eventType]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-foreground/90">
                    {formatDate(activity.occurredAt)}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    <span className="rounded-md bg-muted px-2 py-1">
                      {renderPayload(activity.payload)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
          </div>
        ) : (
          <p className="py-8 text-sm text-muted-foreground">
            No events found for the selected user and filter range.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
