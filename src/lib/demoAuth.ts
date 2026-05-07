import { ngoCredentialsList } from "./statePollutionData";

export type Role = "device" | "admin" | "ngo";

export const DEMO_MODE_ENABLED =
  import.meta.env.VITE_ENABLE_DEMO_MODE !== "false";

export const DEMO_DEVICE = {
  id: "ARIGO_001",
  password: "airguard123",
} as const;

export const DEMO_ADMIN = {
  username: "admin",
  password: "admin@123",
} as const;

export interface DeviceLoginResult {
  ok: boolean;
  deviceId?: string;
}

export function authenticateDevice(deviceId: string, password: string): DeviceLoginResult {
  const id = deviceId.trim();
  if (!id || !password) return { ok: false };
  if (DEMO_MODE_ENABLED && id === DEMO_DEVICE.id && password === DEMO_DEVICE.password) {
    return { ok: true, deviceId: id };
  }
  return { ok: false };
}

export function authenticateAdmin(username: string, password: string): boolean {
  if (!DEMO_MODE_ENABLED) return false;
  return username.trim() === DEMO_ADMIN.username && password === DEMO_ADMIN.password;
}

export interface NgoLoginResult {
  ok: boolean;
  ngoName?: string;
  state?: string;
}

export function authenticateNgo(username: string, password: string): NgoLoginResult {
  if (!DEMO_MODE_ENABLED) return { ok: false };
  const matched = ngoCredentialsList.find(
    (c) => c.username === username.trim() && c.password === password,
  );
  if (!matched) return { ok: false };
  return { ok: true, ngoName: matched.ngoName, state: matched.state };
}
