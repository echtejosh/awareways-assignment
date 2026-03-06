export const eventQueryKeys = {
  metrics: (userId: string, from?: string, to?: string) =>
    ["metrics", userId, from ?? "", to ?? ""] as const,
  activities: (userId: string, from?: string, to?: string, limit?: number) =>
    ["activities", userId, from ?? "", to ?? "", limit ?? 20] as const,
}

