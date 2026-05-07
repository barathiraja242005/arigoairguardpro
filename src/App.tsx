import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DeviceMap from "./pages/DeviceMap";
import MapView from "./pages/MapView";
import Controls from "./pages/Controls";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import AdminLogin from "./pages/AdminLogin";
import NGOLogin from "./pages/NGOLogin";
import NGODashboard from "./pages/NGODashboard";
import AdminPollutionMap from "./pages/AdminPollutionMap";
import DashboardLayout from "./components/layout/DashboardLayout";
import NotFound from "./pages/NotFound";
import GlobalAIChatbot from "./components/chat/GlobalAIChatbot";
import { AuthProvider } from "./contexts/AuthContext";
import RequireAuth from "./components/auth/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/ngo-login" element={<NGOLogin />} />
              <Route path="/map" element={<MapView />} />

              <Route
                element={
                  <RequireAuth role="device" redirectTo="/login">
                    <DashboardLayout />
                  </RequireAuth>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/controls" element={<Controls />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              <Route
                path="/device-map"
                element={
                  <RequireAuth role="device" redirectTo="/login">
                    <DeviceMap />
                  </RequireAuth>
                }
              />

              <Route
                path="/ngo-dashboard"
                element={
                  <RequireAuth role="ngo" redirectTo="/ngo-login">
                    <NGODashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin-pollution-map"
                element={
                  <RequireAuth role="admin" redirectTo="/admin-login">
                    <AdminPollutionMap />
                  </RequireAuth>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
            <GlobalAIChatbot />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
