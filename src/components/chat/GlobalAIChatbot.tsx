import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import AIChatbot from "@/components/chat/AIChatbot";
import { useAuth } from "@/contexts/AuthContext";

const GlobalAIChatbot = () => {
  const location = useLocation();
  const { session } = useAuth();

  const config = useMemo(() => {
    const { pathname } = location;

    if (pathname === "/ngo-dashboard" || pathname === "/admin-pollution-map") {
      return null;
    }

    const ngoState = session?.role === "ngo" ? session.state : "India";

    if (pathname === "/ngo-login") {
      return { stateName: ngoState, focusMode: "ngo-login" as const };
    }

    return { stateName: ngoState, focusMode: "general" as const };
  }, [location, session]);

  if (!config) {
    return null;
  }

  return <AIChatbot stateName={config.stateName} focusMode={config.focusMode} />;
};

export default GlobalAIChatbot;