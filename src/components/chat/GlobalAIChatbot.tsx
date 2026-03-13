import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import AIChatbot from "@/components/chat/AIChatbot";

const GlobalAIChatbot = () => {
  const location = useLocation();

  const config = useMemo(() => {
    const { pathname } = location;

    if (pathname === "/ngo-dashboard" || pathname === "/admin-pollution-map") {
      return null;
    }

    if (pathname === "/ngo-login") {
      return {
        stateName: localStorage.getItem("ngoState") || "India",
        focusMode: "ngo-login" as const,
      };
    }

    if (pathname === "/login") {
      return {
        stateName: "India",
        focusMode: "general" as const,
      };
    }

    if (pathname === "/admin-login") {
      return {
        stateName: "India",
        focusMode: "general" as const,
      };
    }

    if (pathname === "/map") {
      return {
        stateName: "India",
        focusMode: "general" as const,
      };
    }

    return {
      stateName: localStorage.getItem("ngoState") || "India",
      focusMode: "general" as const,
    };
  }, [location]);

  if (!config) {
    return null;
  }

  return <AIChatbot stateName={config.stateName} focusMode={config.focusMode} />;
};

export default GlobalAIChatbot;