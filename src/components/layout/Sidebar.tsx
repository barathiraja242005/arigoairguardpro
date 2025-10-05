import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Map,
  Sliders,
  Bell,
  Settings,
  Wind,
  LogOut,
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
    <Sidebar className="border-r border-sidebar-border bg-white dark:bg-card">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Wind className="w-8 h-8 text-primary" />
          </motion.div>
          <div>
            <h2 className="font-bold text-lg">AriGo</h2>
            <p className="text-xs text-muted-foreground">AirGuard Pro</p>
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
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "hover:bg-sidebar-accent/50"
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

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="mb-3">
          <div className="text-xs text-muted-foreground mb-1">
            Connected Device
          </div>
          <div className="font-medium text-sm">{deviceId}</div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
