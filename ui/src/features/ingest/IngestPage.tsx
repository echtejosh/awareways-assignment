import { useState } from "react"

import type { Activity } from "@/domain/events/entities/activity"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUserIdParam } from "@/features/user/use-user-id-param"
import { IngestEventForm } from "@/features/ingest/components/IngestEventForm"
import {
  buildEventRequestCurlCommand,
  type SubmittedEventRequest,
} from "@/features/ingest/submitted-event-request"
import { NoUserSelectedState } from "@/features/user/components/NoUserSelectedState"

export function IngestPage() {
  const { userId, hasUserId, isValidUserId } = useUserIdParam()
  const [lastResponse, setLastResponse] = useState<Activity | null>(null)
  const [lastRequest, setLastRequest] = useState<SubmittedEventRequest | null>(null)

  if (!hasUserId) {
    return (
      <NoUserSelectedState
        title="No user selected"
        description="Create a user or select an existing one before sending activity events."
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

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden bg-card">
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-5">
            <div className="space-y-4">
              <div className="space-y-1">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Ingest Activity Event
                </h1>
                <CardDescription className="max-w-2xl text-sm text-muted-foreground">
                  Create a user event that feeds dashboard metrics and activity timeline.
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <IngestEventForm
          userId={userId}
          onSuccessResponse={setLastResponse}
          onSubmittedRequest={setLastRequest}
        />
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-base">Request Inspector</CardTitle>
            <CardDescription>
              Inspect the latest submitted request and the API response side by side.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="response" className="gap-4">
              <TabsList className="bg-card">
                <TabsTrigger value="response">Response Body</TabsTrigger>
                <TabsTrigger value="curl">cURL Request</TabsTrigger>
              </TabsList>
              <TabsContent value="response">
                {lastResponse ? (
                  <pre className="overflow-x-auto rounded-xl bg-muted p-4 text-xs leading-6 text-foreground">
                    {JSON.stringify({ data: mapResponseActivity(lastResponse) }, null, 2)}
                  </pre>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Submit an event to inspect the response payload here.
                  </p>
                )}
              </TabsContent>
              <TabsContent value="curl">
                {lastRequest ? (
                  <pre className="overflow-x-auto rounded-xl bg-muted p-4 text-xs leading-6 text-foreground">
                    {buildEventRequestCurlCommand(lastRequest)}
                  </pre>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Submit an event to generate the corresponding <code>curl</code> request here.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function mapResponseActivity(activity: Activity) {
  return {
    id: activity.id,
    user_id: activity.userId,
    event_type: activity.eventType,
    occurred_at: activity.occurredAt,
    payload: activity.payload,
    ingested_at: activity.ingestedAt,
  }
}
