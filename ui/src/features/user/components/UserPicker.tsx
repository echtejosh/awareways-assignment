import { useEffect, useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ChevronDown, Plus } from "lucide-react"

import type { UserSummary } from "@/domain/users/entities/user-summary"
import { userQueryKeys } from "@/application/users/query-keys"
import { searchUsersUseCase } from "@/infrastructure/di/container"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { SidebarInput } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { CreateUserDialog } from "@/features/user/components/CreateUserDialog"

type UserPickerProps = {
  userId: string
  onSelect: (userId: string) => void
  className?: string
  mode?: "default" | "sidebar"
  placeholder?: string
}

const RESULT_LIMIT = 12

/**
 * Searchable user combobox used by the sidebar and empty-state flows.
 */
export function UserPicker({
  userId,
  onSelect,
  className,
  mode = "default",
  placeholder = "Select or search a user",
}: UserPickerProps) {
  const [draft, setDraft] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const blurTimeoutRef = useRef<number | null>(null)
  const InputComponent = mode === "sidebar" ? SidebarInput : Input
  const normalizedSearch = draft.trim().toLowerCase()

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current !== null) {
        window.clearTimeout(blurTimeoutRef.current)
      }
    }
  }, [])

  const selectedUserQuery = useQuery({
    queryKey: userQueryKeys.detail(userId),
    queryFn: async () => {
      const users = await searchUsersUseCase.execute({
        search: userId,
        limit: 5,
      })

      return users.find((user) => user.id === userId) ?? null
    },
    staleTime: 30_000,
    enabled: userId.length > 0,
  })

  const usersQuery = useQuery({
    queryKey: userQueryKeys.search(normalizedSearch, RESULT_LIMIT),
    queryFn: () =>
      searchUsersUseCase.execute({
        search: normalizedSearch || undefined,
        limit: RESULT_LIMIT,
      }),
    staleTime: 30_000,
    retry: 0,
    enabled: isOpen,
  })

  const selectedLabel = selectedUserQuery.data?.name ?? userId

  useEffect(() => {
    if (!isOpen) {
      setDraft(selectedLabel)
    }
  }, [isOpen, selectedLabel])

  /**
   * Delays closing so dropdown item clicks can complete after the input loses focus.
   */
  function scheduleClose() {
    blurTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(false)
    }, 120)
  }

  /**
   * Cancels any pending close timer when focus returns to the control.
   */
  function cancelClose() {
    if (blurTimeoutRef.current !== null) {
      window.clearTimeout(blurTimeoutRef.current)
      blurTimeoutRef.current = null
    }
  }

  /**
   * Opens the suggestion list and clears the draft so the user can start a fresh search.
   */
  function openSearch() {
    cancelClose()
    setDraft("")
    setIsOpen(true)
  }

  /**
   * Applies the selected user to the URL-backed page scope.
   */
  function handleSelectUser(user: UserSummary) {
    setDraft(user.name)
    onSelect(user.id)
    setIsOpen(false)
  }

  /**
   * Switches from picker mode into the create-user modal flow.
   */
  function openCreateUser() {
    cancelClose()
    setIsOpen(false)
    setIsCreateOpen(true)
  }

  /**
   * Auto-selects a newly created user after the dialog succeeds.
   */
  function handleCreated(user: UserSummary) {
    setDraft(user.name)
    onSelect(user.id)
  }

  const availableUsers = usersQuery.data ?? []

  return (
    <div className={cn("relative", className)}>
      <DropdownMenu modal={false} open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <div className="relative">
            <InputComponent
              value={isOpen ? draft : selectedLabel}
              placeholder={placeholder}
              className="pr-9"
              onFocus={openSearch}
              onClick={() => {
                cancelClose()
                setIsOpen(true)
              }}
              onChange={(event) => {
                setDraft(event.target.value)
                setIsOpen(true)
              }}
              onBlur={scheduleClose}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setIsOpen(false)
                  return
                }

                if (event.key === "Enter") {
                  event.preventDefault()

                  if (availableUsers.length > 0) {
                    handleSelectUser(availableUsers[0])
                    return
                  }

                  if (draft.trim().length > 0) {
                    openCreateUser()
                  }
                }
              }}
            />
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 opacity-60" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={8}
          className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[var(--radix-dropdown-menu-trigger-width)] rounded-2xl"
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <DropdownMenuItem
            onMouseDown={(event) => event.preventDefault()}
            onSelect={(event) => {
              event.preventDefault()
              openCreateUser()
            }}
          >
            <Plus className="size-4" />
            <span>Create User</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {usersQuery.isLoading ? (
            <p className="px-2 py-2 text-xs text-muted-foreground">Loading users...</p>
          ) : null}
          {usersQuery.isError ? (
            <p className="px-2 py-2 text-xs text-destructive">
              Failed to load users.
            </p>
          ) : null}
          {!usersQuery.isLoading &&
          !usersQuery.isError &&
          availableUsers.length === 0 ? (
            <p className="px-2 py-2 text-xs text-muted-foreground">
              No users found. Create one to continue.
            </p>
          ) : null}
          {!usersQuery.isLoading &&
          !usersQuery.isError
            ? availableUsers.map((user) => (
                <DropdownMenuItem
                  key={user.id}
                  onMouseDown={(event) => event.preventDefault()}
                  onSelect={(event) => {
                    event.preventDefault()
                    handleSelectUser(user)
                  }}
                >
                  <div className="grid gap-0.5">
                    <span className="truncate text-sm">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.id}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))
            : null}
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateUserDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreated={handleCreated}
        initialName={draft}
      />
    </div>
  )
}
