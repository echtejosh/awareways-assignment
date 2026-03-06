export const userQueryKeys = {
  all: ["users"] as const,
  search: (search: string, limit: number) =>
    [...userQueryKeys.all, "search", search, limit] as const,
  detail: (userId: string) => [...userQueryKeys.all, "detail", userId] as const,
}
