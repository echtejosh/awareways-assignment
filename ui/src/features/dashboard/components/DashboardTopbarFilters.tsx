import { useMemo } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { MoreHorizontal, RefreshCcw, RotateCcw } from "lucide-react"
import { useSearchParams } from "react-router-dom"

import { eventQueryKeys } from "@/application/events/query-keys"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUserIdParam } from "@/features/user/use-user-id-param"
import {
  createDashboardSearchParams,
  DASHBOARD_LIMIT_OPTIONS,
  filtersForPreset,
  readDashboardSearchFilters,
  type DashboardRangePreset,
} from "@/features/dashboard/dashboard-search-filters"

export function DashboardTopbarFilters() {
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  const { userId, isValidUserId } = useUserIdParam()
  const filters = useMemo(
    () => readDashboardSearchFilters(searchParams),
    [searchParams]
  )

  function commitFilters(nextFilters: typeof filters) {
    setSearchParams(createDashboardSearchParams(searchParams, nextFilters))
  }

  function handlePresetChange(value: string) {
    const preset = value as DashboardRangePreset
    commitFilters(filtersForPreset(preset, filters.limit))
  }

  function handleLimitChange(value: string) {
    commitFilters({
      ...filters,
      limit: Number.parseInt(value, 10),
    })
  }

  function clearRange() {
    commitFilters({
      range: "all",
      limit: filters.limit,
    })
  }

  function resetFilters() {
    commitFilters({
      range: "all",
      limit: 20,
    })
  }

  function refreshData() {
    queryClient.invalidateQueries({ queryKey: eventQueryKeys.metrics(userId) })
    queryClient.invalidateQueries({ queryKey: eventQueryKeys.activities(userId) })
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Tabs
          value={filters.range}
          onValueChange={handlePresetChange}
          className="w-full sm:w-auto"
        >
          <TabsList className="w-full justify-start rounded-full bg-card p-1 sm:w-auto">
            <TabsTrigger value="all" className="rounded-full px-3">
              All time
            </TabsTrigger>
            <TabsTrigger value="1d" className="rounded-full px-3">
              24h
            </TabsTrigger>
            <TabsTrigger value="7d" className="rounded-full px-3">
              7d
            </TabsTrigger>
            <TabsTrigger value="30d" className="rounded-full px-3">
              30d
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Select value={`${filters.limit}`} onValueChange={handleLimitChange}>
          <SelectTrigger className="w-full rounded-full sm:w-[124px]">
            <SelectValue placeholder="Rows" />
          </SelectTrigger>
          <SelectContent align="end">
            {DASHBOARD_LIMIT_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option} rows
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full bg-card">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Dashboard actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-2xl">
            <DropdownMenuItem onClick={refreshData} disabled={!isValidUserId}>
              <RefreshCcw className="h-4 w-4" />
              Refresh data
            </DropdownMenuItem>
            <DropdownMenuItem onClick={clearRange}>
              <RotateCcw className="h-4 w-4" />
              Clear range
            </DropdownMenuItem>
            <DropdownMenuItem onClick={resetFilters}>
              <RotateCcw className="h-4 w-4" />
              Reset filters
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
