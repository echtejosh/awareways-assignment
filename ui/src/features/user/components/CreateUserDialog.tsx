import { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import type { UserSummary } from "@/domain/users/entities/user-summary"
import { userQueryKeys } from "@/application/users/query-keys"
import { createUserUseCase } from "@/infrastructure/di/container"
import { ApiRequestError } from "@/infrastructure/http/api-request-error"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type CreateUserDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: (user: UserSummary) => void
  initialName?: string
}

export function CreateUserDialog({
  open,
  onOpenChange,
  onCreated,
  initialName = "",
}: CreateUserDialogProps) {
  const queryClient = useQueryClient()
  const [name, setName] = useState(initialName)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setName(initialName)
      setFormError(null)
    }
  }, [initialName, open])

  const mutation = useMutation<UserSummary, Error, { name: string }>({
    mutationFn: createUserUseCase.execute.bind(createUserUseCase),
    onSuccess: (user) => {
      toast.success("User created successfully.")
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all })
      onCreated?.(user)
      onOpenChange(false)
    },
    onError: (error) => {
      if (error instanceof ApiRequestError && error.status === 422) {
        setFormError(error.errors?.name?.[0] ?? error.message)
        return
      }

      setFormError(error.message)
    },
  })

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedName = name.trim()

    if (!normalizedName) {
      setFormError("Name is required.")
      return
    }

    setFormError(null)
    mutation.mutate({ name: normalizedName })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Create a user directory entry. A UUID will be generated automatically.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="create-user-name">Name</Label>
            <Input
              id="create-user-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Safety Team Demo User"
              autoFocus
            />
            {formError ? (
              <p className="text-sm text-destructive">{formError}</p>
            ) : null}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
