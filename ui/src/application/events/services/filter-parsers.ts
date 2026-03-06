export type DashboardFilters = {
  from?: string
  to?: string
  limit: number
}

export function toApiDatetime(input: string): string | undefined {
  if (!input.trim()) {
    return undefined
  }

  const date = new Date(input)
  if (Number.isNaN(date.getTime())) {
    return undefined
  }

  return date.toISOString()
}

export function parseLimit(input: string): number {
  const parsed = Number.parseInt(input, 10)
  if (Number.isNaN(parsed)) {
    return 20
  }

  return Math.max(1, Math.min(100, parsed))
}

export function toIsoDateTime(value: string): string | null {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return parsed.toISOString()
}

export function currentLocalDateTimeInput(): string {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
}

