import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Map,
  Sliders,
  Bell,
  Settings,
  LogOut,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { navStyles } from "@/lib/design-system";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Map View", url: "/map", icon: Map },
  { title: "Controls", url: "/controls", icon: Sliders },
  { title: "Alerts", url: "/alerts", icon: Bell },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deviceId] = useState(localStorage.getItem("deviceId") || "Unknown");

  const handleSignOut = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("deviceId");

    toast({
      title: "Signed Out",
      description: "You have been successfully signed out",
    });

    navigate("/");
  };

  return (
    <Sidebar className="border-r border-sidebar-border/50 bg-sidebar backdrop-blur-md">
      <SidebarHeader className="border-b border-sidebar-border/50 p-4">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20"
          >
            <Leaf className="w-6 h-6 text-green-500" />
          </motion.div>
          <div>
            <h2 className="font-bold text-lg bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              AriGo
            </h2>
            <p className="text-xs text-muted-foreground">Air GuardPro</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive
                          ? navStyles.activeLink
                          : navStyles.inactiveLink
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50 p-4">
        <div className="mb-3 p-3 rounded-lg bg-gradient-glass border border-border/50">
          <div className="text-xs text-muted-foreground mb-1">
            Connected Device
          </div>
          <div className="font-medium text-sm font-mono">{deviceId}</div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all duration-200"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
