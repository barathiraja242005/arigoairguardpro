import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { Role } from "@/lib/demoAuth";

interface RequireAuthProps {
  role: Role;
  redirectTo: string;
  children: React.ReactNode;
}

export default function RequireAuth({ role, redirectTo, children }: RequireAuthProps) {
  const { session, hydrated } = useAuth();
  const location = useLocation();

  if (!hydrated) return null;

  if (!session || session.role !== role) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
