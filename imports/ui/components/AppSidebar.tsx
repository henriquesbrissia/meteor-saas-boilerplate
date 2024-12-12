import { LayoutDashboard, UserPen, Users } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "../elements/sidebar";
import { ROUTES } from "../utils/routes";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: ROUTES.DASHBOARD,
    icon: LayoutDashboard
  },
  {
    title: "Profile",
    url: ROUTES.PROFILE,
    icon: UserPen
  },
  {
    title: "Teams",
    url: "#",
    icon: Users
  }
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="font-semibold">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
