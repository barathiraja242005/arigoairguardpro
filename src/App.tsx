import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MapView from "./pages/MapView";
import Controls from "./pages/Controls";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NGOLogin from "./pages/NGOLogin";
import NGODashboard from "./pages/NGODashboard";
import AdminPollutionMap from "./pages/AdminPollutionMap";
import DashboardLayout from "./components/layout/DashboardLayout";
import NotFound from "./pages/NotFound";
import GlobalAIChatbot from "./components/chat/GlobalAIChatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/controls" element={<Controls />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/ngo-login" element={<NGOLogin />} />
          <Route path="/ngo-dashboard" element={<NGODashboard />} />
          <Route path="/admin-pollution-map" element={<AdminPollutionMap />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <GlobalAIChatbot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
