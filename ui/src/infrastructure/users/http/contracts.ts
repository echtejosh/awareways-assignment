export type UserSummaryApiDto = {
  id: string
  name: string
}

export type SearchUsersApiResponse = {
  data: UserSummaryApiDto[]
  meta: {
    search: string | null
    limit: number
    count: number
  }
}

export type CreateUserApiRequest = {
  name: string
}

export type CreateUserApiResponse = {
  data: UserSummaryApiDto
}
