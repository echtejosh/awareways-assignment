import type { UserSummary } from "@/domain/users/entities/user-summary"

/**
 * Search input used by the user picker and empty states.
 */
export type SearchUsersInput = {
  search?: string
  limit: number
}

/**
 * Create-user command used by the modal flow.
 */
export type CreateUserInput = {
  name: string
}

/**
 * Core user-directory port consumed by UI use cases.
 */
export interface UserDirectoryRepository {
  searchUsers(input: SearchUsersInput): Promise<UserSummary[]>
  createUser(input: CreateUserInput): Promise<UserSummary>
}
