import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Hexagon } from "lucide-react"

export function VersionSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          size="lg"
          className="cursor-default hover:bg-transparent hover:text-sidebar-foreground active:bg-transparent active:text-sidebar-foreground"
        >
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 min-w-0 items-center justify-center rounded-lg bg-[var(--chart-5)] px-2 text-black">
                <Hexagon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-base font-semibold">Awareways</span>
                <span className="truncate text-sm font-medium text-sidebar-foreground/80">
                  User Activity
                </span>
              </div>
            </div>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
