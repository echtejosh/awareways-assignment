import { useState } from "react"

import type { UserSummary } from "@/domain/users/entities/user-summary"
import { useApplyUserIdParam } from "@/features/user/use-apply-user-id-param"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CreateUserDialog } from "@/features/user/components/CreateUserDialog"
import { UserPicker } from "@/features/user/components/UserPicker"

type NoUserSelectedStateProps = {
  title: string
  description: string
}

export function NoUserSelectedState({
  title,
  description,
}: NoUserSelectedStateProps) {
  const applyUserId = useApplyUserIdParam()
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  function handleCreated(user: UserSummary) {
    applyUserId(user.id)
  }

  return (
    <>
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {title}
          </CardTitle>
          <CardDescription className="max-w-2xl text-sm text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4 rounded-xl bg-muted p-5">
            <div className="space-y-1">
              <p className="text-sm font-semibold">A. Create a user</p>
              <p className="text-sm text-muted-foreground">
                Create a user directory entry first. The application generates the UUID
                for you.
              </p>
            </div>
            <Button onClick={() => setIsCreateOpen(true)}>Create User</Button>
          </div>
          <div className="space-y-4 rounded-xl bg-muted p-5">
            <div className="space-y-1">
              <p className="text-sm font-semibold">B. Select a user</p>
              <p className="text-sm text-muted-foreground">
                Pick an existing user to scope this page and load the relevant data.
              </p>
            </div>
            <UserPicker userId="" onSelect={applyUserId} placeholder="Search users by name or UUID" />
          </div>
        </CardContent>
      </Card>
      <CreateUserDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreated={handleCreated}
      />
    </>
  )
}
