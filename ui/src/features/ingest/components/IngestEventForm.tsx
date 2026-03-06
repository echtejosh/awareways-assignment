import { useMemo, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"
import { toast } from "sonner"

import { eventQueryKeys } from "@/application/events/query-keys"
import {
  currentLocalDateTimeInput,
} from "@/application/events/services/filter-parsers"
import type { Activity } from "@/domain/events/entities/activity"
import type { EventType } from "@/domain/events/value-objects/event-type"
import { EVENT_TYPES } from "@/domain/events/value-objects/event-type"
import { UserId } from "@/domain/common/value-objects/user-id"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/date-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  buildEventRequestCurlCommand,
  type SubmittedEventRequest,
} from "@/features/ingest/submitted-event-request"
import { ApiRequestError } from "@/infrastructure/http/api-request-error"
import { ingestEventUseCase } from "@/infrastructure/di/container"

const payloadSchema = z.record(z.string(), z.unknown())

type IngestEventFormProps = {
  userId: string
  onSuccessResponse?: (activity: Activity) => void
  onSubmittedRequest?: (request: SubmittedEventRequest) => void
}

type FormErrors = {
  occurred_at?: string
  payload?: string
  "payload.points"?: string
}

export function IngestEventForm({
  userId,
  onSuccessResponse,
  onSubmittedRequest,
}: IngestEventFormProps) {
  const queryClient = useQueryClient()
  const defaultOccurredAt = new Date(currentLocalDateTimeInput())

  const [eventType, setEventType] = useState<EventType>("training_started")
  const [occurredDate, setOccurredDate] = useState<Date | undefined>(defaultOccurredAt)
  const [occurredTime, setOccurredTime] = useState(
    `${`${defaultOccurredAt.getHours()}`.padStart(2, "0")}:${`${defaultOccurredAt.getMinutes()}`.padStart(2, "0")}`
  )
  const [payloadText, setPayloadText] = useState("{\n  \"training_id\": \"safety-101\"\n}")
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [isCurlDialogOpen, setIsCurlDialogOpen] = useState(false)
  const [isExamplesDialogOpen, setIsExamplesDialogOpen] = useState(false)

  const mutation = useMutation<Activity, Error, {
    userId: UserId
    eventType: EventType
    occurredAt: string
    payload: Record<string, unknown>
  }>({
    mutationFn: ingestEventUseCase.execute.bind(ingestEventUseCase),
    onSuccess: (activity) => {
      toast.success("Event ingested successfully.")
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.metrics(userId) })
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.activities(userId) })
      onSuccessResponse?.(activity)
    },
    onError: (error) => {
      if (error instanceof ApiRequestError && error.status === 422) {
        const incomingErrors = error.errors ?? {}
        setFormErrors({
          occurred_at: incomingErrors.occurred_at?.[0],
          payload: incomingErrors.payload?.[0],
          "payload.points": incomingErrors["payload.points"]?.[0],
        })
      }
    },
  })

  const payloadHint = useMemo(() => {
    if (eventType === "points_scored") {
      return '{\n  "points": 10,\n  "reason": "quiz_bonus"\n}'
    }
    return '{\n  "training_id": "safety-101"\n}'
  }, [eventType])

  const curlPreview = useMemo(() => {
    const result = buildSubmittedEventRequest({
      userId,
      eventType,
      occurredDate,
      occurredTime,
      payloadText,
    })

    if (!result.ok) {
      return {
        command: null,
        errors: result.errors,
      }
    }

    return {
      command: buildEventRequestCurlCommand(result.request),
      errors: null,
    }
  }, [eventType, occurredDate, occurredTime, payloadText, userId])

  const orderedPayloadExamples = useMemo(() => {
    return [
      eventType,
      ...EVENT_TYPES.filter((type) => type !== eventType),
    ].map((type) => ({
      type,
      title: payloadExampleTitles[type],
      description: payloadExampleDescriptions[type],
      payload: payloadExamples[type],
    }))
  }, [eventType])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormErrors({})

    const result = buildSubmittedEventRequest({
      userId,
      eventType,
      occurredDate,
      occurredTime,
      payloadText,
    })

    if (!result.ok) {
      setFormErrors(result.errors)
      return
    }

    const requestPayload = result.request

    onSubmittedRequest?.(requestPayload)

    mutation.mutate({
      userId: UserId.create(userId),
      eventType: requestPayload.event_type,
      occurredAt: requestPayload.occurred_at,
      payload: requestPayload.payload,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Create Event</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label>User ID</Label>
            <Input value={userId} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event_type">Event Type</Label>
            <Select value={eventType} onValueChange={(value) => setEventType(value as EventType)}>
              <SelectTrigger id="event_type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="occurred_at">Occurred At</Label>
            <DatePicker
              id="occurred_at"
              date={occurredDate}
              onSelect={setOccurredDate}
              time={occurredTime}
              onTimeChange={setOccurredTime}
              className="w-full"
            />
            {formErrors.occurred_at ? (
              <p className="text-sm text-destructive">{formErrors.occurred_at}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="payload">Payload JSON</Label>
            <Textarea
              id="payload"
              value={payloadText}
              onChange={(event) => setPayloadText(event.target.value)}
              className="min-h-[190px] font-mono text-sm"
              placeholder={payloadHint}
            />
            <p className="text-xs text-muted-foreground">
              Use an object payload. For <code>points_scored</code>, include
              <code> points</code> as integer &gt;= 1.
            </p>
            {formErrors.payload ? (
              <p className="text-sm text-destructive">{formErrors.payload}</p>
            ) : null}
            {formErrors["payload.points"] ? (
              <p className="text-sm text-destructive">{formErrors["payload.points"]}</p>
            ) : null}
          </div>

          {mutation.isError && !(mutation.error instanceof ApiRequestError && mutation.error.status === 422) ? (
            <Alert variant="destructive">
              <AlertTitle>Failed to ingest event</AlertTitle>
              <AlertDescription>{mutation.error.message}</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Submitting..." : "Submit Event"}
            </Button>
            <Dialog open={isExamplesDialogOpen} onOpenChange={setIsExamplesDialogOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline">
                  Open Examples
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-6xl">
                <DialogHeader>
                  <DialogTitle>Payload Examples</DialogTitle>
                  <DialogDescription>
                    Reference payload shapes for each supported activity event type.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 md:grid-cols-2">
                  {orderedPayloadExamples.map((example) => (
                    <div
                      key={example.type}
                      className="space-y-3 rounded-xl bg-muted p-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold">{example.title}</h3>
                          {example.type === eventType ? (
                            <span className="rounded-full bg-background px-2 py-0.5 text-xs font-medium text-foreground">
                              Current selection
                            </span>
                          ) : null}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {example.description}
                        </p>
                      </div>
                      <pre className="overflow-x-auto rounded-xl bg-background p-4 text-xs leading-6 text-foreground">
                        {JSON.stringify(example.payload, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isCurlDialogOpen} onOpenChange={setIsCurlDialogOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline">
                  View cURL
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>cURL Request</DialogTitle>
                  <DialogDescription>
                    Use this command to fire the same event payload through the API.
                  </DialogDescription>
                </DialogHeader>
                {curlPreview.command ? (
                  <pre className="overflow-x-auto rounded-xl bg-muted p-4 text-xs leading-6 text-foreground">
                    {curlPreview.command}
                  </pre>
                ) : (
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>Fix the current form state before a valid cURL command can be generated.</p>
                    <ul className="space-y-2">
                      {Object.values(curlPreview.errors ?? {}).map((message) => (
                        <li key={message}>{message}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function buildSubmittedEventRequest({
  userId,
  eventType,
  occurredDate,
  occurredTime,
  payloadText,
}: {
  userId: string
  eventType: EventType
  occurredDate: Date | undefined
  occurredTime: string
  payloadText: string
}): { ok: true; request: SubmittedEventRequest } | { ok: false; errors: FormErrors } {
  const isoOccurredAt = buildOccurredAtIso(occurredDate, occurredTime)
  if (!isoOccurredAt) {
    return {
      ok: false,
      errors: {
        occurred_at: "Occurred at must be a valid date and time.",
      },
    }
  }

  let parsedPayload: Record<string, unknown>

  try {
    const candidate = JSON.parse(payloadText) as unknown
    parsedPayload = payloadSchema.parse(candidate)
  } catch {
    return {
      ok: false,
      errors: {
        payload: "Payload must be valid JSON object.",
      },
    }
  }

  if (
    eventType === "points_scored" &&
    (typeof parsedPayload.points !== "number" || parsedPayload.points < 1)
  ) {
    return {
      ok: false,
      errors: {
        "payload.points": "Points scored events require payload.points >= 1.",
      },
    }
  }

  return {
    ok: true,
    request: {
      user_id: userId,
      event_type: eventType,
      occurred_at: isoOccurredAt,
      payload: parsedPayload,
    },
  }
}

function buildOccurredAtIso(date: Date | undefined, time: string): string | null {
  if (!date || !/^\d{2}:\d{2}$/.test(time)) {
    return null
  }

  const [hours, minutes] = time.split(":").map(Number)

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null
  }

  const combined = new Date(date)
  combined.setHours(hours, minutes, 0, 0)

  if (Number.isNaN(combined.getTime())) {
    return null
  }

  return combined.toISOString()
}

const payloadExamples: Record<EventType, Record<string, unknown>> = {
  training_started: {
    training_id: "safety-101",
    source: "dashboard_launch",
  },
  progress_made: {
    training_id: "safety-101",
    progress: 60,
    step: "module_3",
  },
  points_scored: {
    points: 25,
    reason: "quiz_bonus",
  },
  training_completed: {
    training_id: "safety-101",
    certificate_id: "cert-8842",
  },
}

const payloadExampleTitles: Record<EventType, string> = {
  training_started: "Training Started",
  progress_made: "Progress Made",
  points_scored: "Points Scored",
  training_completed: "Training Completed",
}

const payloadExampleDescriptions: Record<EventType, string> = {
  training_started:
    "Use this when a user begins a training flow or re-enters it as a new session.",
  progress_made:
    "Use this when the user advances through a training and you want to persist progress context.",
  points_scored:
    "Use this when the user earns score-based progress. payload.points must be an integer greater than or equal to 1.",
  training_completed:
    "Use this when the training is finished and you want it counted toward completion metrics.",
}
