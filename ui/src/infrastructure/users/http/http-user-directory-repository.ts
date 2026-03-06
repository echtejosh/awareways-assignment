import type {
  CreateUserInput,
  SearchUsersInput,
  UserDirectoryRepository,
} from "@/domain/users/repositories/user-directory-repository"
import type { UserSummary } from "@/domain/users/entities/user-summary"
import type {
  CreateUserApiRequest,
  CreateUserApiResponse,
  SearchUsersApiResponse,
  UserSummaryApiDto,
} from "@/infrastructure/users/http/contracts"
import { fetchJson } from "@/infrastructure/http/fetch-json"

function queryString(params: Record<string, string | number | undefined>): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === "") {
      return
    }

    searchParams.set(key, String(value))
  })

  const serialized = searchParams.toString()
  return serialized ? `?${serialized}` : ""
}

function mapUserSummary(dto: UserSummaryApiDto): UserSummary {
  return {
    id: dto.id,
    name: dto.name,
  }
}

export class HttpUserDirectoryRepository implements UserDirectoryRepository {
  async searchUsers(input: SearchUsersInput): Promise<UserSummary[]> {
    const qs = queryString({
      search: input.search?.trim().toLowerCase(),
      limit: input.limit,
    })

    const response = await fetchJson<SearchUsersApiResponse>(`/users${qs}`)
    return response.data.map(mapUserSummary)
  }

  async createUser(input: CreateUserInput): Promise<UserSummary> {
    const payload: CreateUserApiRequest = {
      name: input.name,
    }

    const response = await fetchJson<CreateUserApiResponse>("/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    return mapUserSummary(response.data)
  }
}
