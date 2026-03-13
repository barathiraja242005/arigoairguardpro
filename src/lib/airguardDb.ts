import { ref, update } from "firebase/database";
import { database } from "./firebase";

export type AirguardReading = Record<string, unknown>;

export interface AirguardDeviceStatus {
  online: boolean;
  last_seen: string;
  battery_percent?: number;
  firmware_version?: string;
  signal_strength?: number;
}

export interface AirguardUserLocation {
  lat: number;
  lng: number;
  label?: string;
  city?: string;
  state?: string;
  updated_at?: string;
}

function pad2(value: number): string {
  return value.toString().padStart(2, "0");
}

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  return `${year}-${month}-${day}`;
}

export function toTimeKey(date: Date): string {
  const hours = pad2(date.getHours());
  const minutes = pad2(date.getMinutes());
  const seconds = pad2(date.getSeconds());
  return `${hours}:${minutes}:${seconds}`;
}

function assertValidFirebaseKey(key: string, label: string): void {
  if (!key.trim()) throw new Error(`${label} cannot be empty`);
  // Firebase RTDB disallows: . # $ [ ] /
  if (/[.#$\[\]/]/.test(key)) {
    throw new Error(
      `${label} contains invalid characters. Avoid: . # $ [ ] / (got: ${key})`,
    );
  }
}

function deviceRoot(deviceId: string): string {
  assertValidFirebaseKey(deviceId, "deviceId");
  return `airguard_devices/${deviceId}`;
}

export async function writeAirguardReading(params: {
  deviceId: string;
  reading: AirguardReading;
  at?: Date;
}): Promise<{ dateKey: string; timeKey: string; iso: string }>{
  const at = params.at ?? new Date();
  const dateKey = toDateKey(at);
  const timeKey = toTimeKey(at);
  const iso = at.toISOString();

  const root = deviceRoot(params.deviceId);

  const readingWithMeta = {
    ...params.reading,
    recorded_at: iso,
  };

  const updates: Record<string, unknown> = {
    [`${root}/latest_reading`]: readingWithMeta,
    [`${root}/history/${dateKey}/${timeKey}`]: readingWithMeta,
  };

  await update(ref(database), updates);

  return { dateKey, timeKey, iso };
}

export async function setAirguardDeviceStatus(params: {
  deviceId: string;
  status: AirguardDeviceStatus;
}): Promise<void> {
  const root = deviceRoot(params.deviceId);
  await update(ref(database), {
    [`${root}/device_status`]: params.status,
  });
}

export async function setAirguardUserLocation(params: {
  deviceId: string;
  location: AirguardUserLocation;
}): Promise<void> {
  const root = deviceRoot(params.deviceId);
  await update(ref(database), {
    [`${root}/user_location`]: params.location,
  });
}
