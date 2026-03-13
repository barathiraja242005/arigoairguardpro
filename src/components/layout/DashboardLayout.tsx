import { useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { pageStyles } from "@/lib/design-system";

const DashboardLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <SidebarProvider>
      <div className={`flex w-full ${pageStyles.wrapper}`}>
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border/50 flex items-center px-4 bg-card/60 backdrop-blur-md">
            <SidebarTrigger />
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </header>
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
