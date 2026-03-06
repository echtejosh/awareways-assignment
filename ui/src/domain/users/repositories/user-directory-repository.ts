import type { UserSummary } from "@/domain/users/entities/user-summary"

export type SearchUsersInput = {
  search?: string
  limit: number
}

export type CreateUserInput = {
  name: string
}

export interface UserDirectoryRepository {
  searchUsers(input: SearchUsersInput): Promise<UserSummary[]>
  createUser(input: CreateUserInput): Promise<UserSummary>
}
