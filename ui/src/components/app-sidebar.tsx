import * as React from "react"
import { NavLink, useLocation, useSearchParams } from "react-router-dom"

import { VersionSwitcher } from "@/components/version-switcher"
import { UserPicker } from "@/features/user/components/UserPicker"
import { useApplyUserIdParam } from "@/features/user/use-apply-user-id-param"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

function userQuerySearch(userId: string): string {
  if (!userId) {
    return ""
  }

  const params = new URLSearchParams({ user_id: userId })
  return `?${params.toString()}`
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const applyUserId = useApplyUserIdParam()
  const userId = searchParams.get("user_id")?.trim() ?? ""
  const data = {
    navMain: [
      {
        title: "Application",
        url: "#",
        items: [
          {
            title: "Dashboard",
            url: `/dashboard${userQuerySearch(userId)}`,
            isActive: location.pathname === "/dashboard",
          },
          {
            title: "Ingest Event",
            url: `/ingest${userQuerySearch(userId)}`,
            isActive: location.pathname === "/ingest",
          },
          {
            title: "API Docs",
            url: `/api-docs${userQuerySearch(userId)}`,
            isActive: location.pathname === "/api-docs",
          },
        ],
      },
    ],
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher />
        <UserPicker
          userId={userId}
          onSelect={applyUserId}
          mode="sidebar"
          placeholder="Search users"
        />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <NavLink to={item.url}>{item.title}</NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
