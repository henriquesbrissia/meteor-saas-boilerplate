import { useQueryClient } from "@tanstack/react-query";
import { Crown, LayoutDashboard, LogOut, UserPen, Users } from "lucide-react";
import { Meteor } from "meteor/meteor";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "../../utils/routes";
import { Button } from "../elements/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "../elements/sidebar";

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
    url: ROUTES.TEAMS,
    icon: Users
  },
  {
    title: "Subscription",
    url: ROUTES.SUBSCRIPTION,
    icon: Crown
  }
];

export function AppSidebar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    Meteor.logout();
    queryClient.clear();
    navigate(ROUTES.SIGN_IN);
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="dark:text-gray-200">Meteor SaaS Boilerplate</SidebarGroupLabel>
          <SidebarGroupContent className="font-semibold mt-12">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem className="shadow-inner p-2 dark:hover:bg-gray-800" key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="dark:text-gray-300 dark:hover:text-white">
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
      <SidebarFooter className="p-5">
        <Button 
          variant="outline" 
          size="lg" 
          onClick={handleLogout} 
          className="w-full shadow-sm dark:text-white dark:border-gray-600 dark:hover:bg-gray-800"
        >
          <LogOut />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
