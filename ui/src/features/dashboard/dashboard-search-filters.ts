import {
  parseLimit,
  toIsoDateTime,
  type DashboardFilters,
} from "@/application/events/services/filter-parsers"

export const DEFAULT_DASHBOARD_LIMIT = 20

export const DASHBOARD_LIMIT_OPTIONS = ["10", "20", "50", "100"] as const

export const DASHBOARD_RANGE_PRESETS = ["all", "1d", "7d", "30d"] as const

export type DashboardRangePreset = (typeof DASHBOARD_RANGE_PRESETS)[number]

export type DashboardSearchFilters = DashboardFilters & {
  range: DashboardRangePreset
}

export function readDashboardSearchFilters(
  searchParams: URLSearchParams
): DashboardSearchFilters {
  const rangeParam = searchParams.get("range")
  const range = isDashboardRangePreset(rangeParam) ? rangeParam : "all"
  const from = normalizeSearchDate(searchParams.get("from"))
  const to = normalizeSearchDate(searchParams.get("to"))

  return {
    range: from || to ? range : "all",
    from,
    to,
    limit: parseLimit(searchParams.get("limit") ?? `${DEFAULT_DASHBOARD_LIMIT}`),
  }
}

export function createDashboardSearchParams(
  currentSearchParams: URLSearchParams,
  filters: DashboardSearchFilters
): URLSearchParams {
  const nextSearchParams = new URLSearchParams(currentSearchParams)

  writeSearchParam(nextSearchParams, "range", filters.range === "all" ? null : filters.range)
  writeSearchParam(nextSearchParams, "from", filters.from)
  writeSearchParam(nextSearchParams, "to", filters.to)
  writeSearchParam(
    nextSearchParams,
    "limit",
    filters.limit === DEFAULT_DASHBOARD_LIMIT ? null : `${filters.limit}`
  )

  return nextSearchParams
}

export function filtersForPreset(
  preset: DashboardRangePreset,
  limit: number
): DashboardSearchFilters {
  if (preset === "all") {
    return {
      range: "all",
      limit,
    }
  }

  const to = new Date()
  const from = new Date(to)
  from.setDate(from.getDate() - presetToDays(preset))

  return {
    range: preset,
    from: from.toISOString(),
    to: to.toISOString(),
    limit,
  }
}

function normalizeSearchDate(value: string | null): string | undefined {
  if (!value) {
    return undefined
  }

  return toIsoDateTime(value) ?? undefined
}

function presetToDays(preset: Exclude<DashboardRangePreset, "all">): number {
  switch (preset) {
    case "1d":
      return 1
    case "7d":
      return 7
    case "30d":
      return 30
  }
}

function isDashboardRangePreset(value: string | null): value is DashboardRangePreset {
  return DASHBOARD_RANGE_PRESETS.includes((value ?? "") as DashboardRangePreset)
}

function writeSearchParam(
  searchParams: URLSearchParams,
  key: string,
  value?: string | null
): void {
  if (!value) {
    searchParams.delete(key)
    return
  }

  searchParams.set(key, value)
}
