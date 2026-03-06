import { Link, Outlet, useLocation, useSearchParams } from "react-router-dom"

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardTopbarFilters } from "@/features/dashboard/components/DashboardTopbarFilters"

function userQuerySearch(userId: string): string {
  if (!userId) {
    return ""
  }

  const params = new URLSearchParams({ user_id: userId })
  return `?${params.toString()}`
}

export function AppLayout() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const userId = searchParams.get("user_id")?.trim() ?? ""
  const pageLabel =
    location.pathname === "/ingest"
      ? "Ingest Event"
      : location.pathname === "/api-docs"
        ? "API Docs"
        : "Dashboard"
  const dashboardHref = `/dashboard${userQuerySearch(userId)}`
  const isDashboardRoute = location.pathname === "/dashboard"

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex shrink-0 items-center justify-between gap-4 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <SidebarTrigger className="-ml-1" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link to={dashboardHref}>Application</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{pageLabel}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {isDashboardRoute ? <DashboardTopbarFilters /> : null}
        </header>

        <div className="flex flex-1 px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
