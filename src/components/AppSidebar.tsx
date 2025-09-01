import { LayoutDashboard, Plus, Settings } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/app/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "New Project",
    url: "/app/new-project",
    icon: Plus,
  },
  {
    title: "Settings",
    url: "/app/settings/prompts",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className="border-r border-border">
      <SidebarContent>
        <div className="p-4 border-b border-border">
          <SidebarTrigger className="mb-2" />
          <h2 className="text-lg font-semibold text-primary">Navigation</h2>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={
                      isActive(item.url) 
                        ? "bg-accent text-accent-foreground font-medium shadow-sm" 
                        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                    }
                  >
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4 mr-3" />
                      <span>{item.title}</span>
                    </NavLink>
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