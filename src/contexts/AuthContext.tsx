import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Role } from "@/lib/demoAuth";

interface DeviceSession {
  role: "device";
  deviceId: string;
}

interface AdminSession {
  role: "admin";
}

interface NgoSession {
  role: "ngo";
  ngoName: string;
  state: string;
  premium: boolean;
}

export type Session = DeviceSession | AdminSession | NgoSession;

interface AuthContextValue {
  session: Session | null;
  hydrated: boolean;
  signInDevice: (deviceId: string) => void;
  signInAdmin: () => void;
  signInNgo: (ngoName: string, state: string) => void;
  setNgoPremium: (premium: boolean) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "arigo_session_v1";

function readStoredSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    if (parsed && typeof parsed === "object" && "role" in parsed) return parsed;
  } catch {
    // ignore
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSession(readStoredSession());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      if (session.role === "device") {
        localStorage.setItem("deviceId", session.deviceId);
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [session, hydrated]);

  const signInDevice = useCallback((deviceId: string) => {
    setSession({ role: "device", deviceId });
  }, []);

  const signInAdmin = useCallback(() => {
    setSession({ role: "admin" });
  }, []);

  const signInNgo = useCallback((ngoName: string, state: string) => {
    setSession({ role: "ngo", ngoName, state, premium: false });
  }, []);

  const setNgoPremium = useCallback((premium: boolean) => {
    setSession((prev) => (prev?.role === "ngo" ? { ...prev, premium } : prev));
  }, []);

  const signOut = useCallback(() => {
    setSession(null);
    localStorage.removeItem("deviceId");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ session, hydrated, signInDevice, signInAdmin, signInNgo, setNgoPremium, signOut }),
    [session, hydrated, signInDevice, signInAdmin, signInNgo, setNgoPremium, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export function useRequireRole(role: Role): Session | null {
  const { session } = useAuth();
  if (session?.role === role) return session;
  return null;
}
