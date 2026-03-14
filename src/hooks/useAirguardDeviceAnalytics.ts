import { useEffect, useMemo, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "@/lib/firebase";
import { toDateKey } from "@/lib/airguardDb";

export type AirguardLatestReading = Record<string, unknown> | null;

export interface AirguardDeviceStatus {
  online?: boolean;
  last_seen?: string;
  battery_percent?: number;
  firmware_version?: string;
  signal_strength?: number;
}

export interface AirguardUserLocation {
  lat?: number;
  lng?: number;
  label?: string;
  city?: string;
  state?: string;
  updated_at?: string;
}

export interface AirguardHistoryPoint {
  timeKey: string; // HH:mm:ss
  recordedAt?: string;
  aqi?: number;
  dustDensity?: number;
  coPpm?: number;
  no2Ppm?: number;
  temperature?: number;
  humidity?: number;
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function pickNumber(source: Record<string, unknown> | null, keys: string[]): number | undefined {
  if (!source) return undefined;
  for (const key of keys) {
    if (key in source) {
      const num = toNumber((source as any)[key]);
      if (num !== undefined) return num;
    }
  }
  return undefined;
}

function deviceRoot(deviceId: string): string {
  return `airguard_devices/${deviceId}`;
}

export function useAirguardDeviceAnalytics(deviceId: string) {
  const [latest, setLatest] = useState<AirguardLatestReading>(null);
  const [status, setStatus] = useState<AirguardDeviceStatus | null>(null);
  const [location, setLocation] = useState<AirguardUserLocation | null>(null);
  const [todayHistoryRaw, setTodayHistoryRaw] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const todayKey = useMemo(() => toDateKey(new Date()), []);

  useEffect(() => {
    if (!deviceId) return;

    setLoading(true);
    setError(null);

    const root = deviceRoot(deviceId);

    const unsubLatest = onValue(
      ref(database, `${root}/latest_reading`),
      (snap) => {
        setLatest(snap.exists() ? (snap.val() as Record<string, unknown>) : null);
        setLoading(false);
      },
      (err) => {
        setError(err?.message || "Failed to load latest reading");
        setLoading(false);
      },
    );

    const unsubStatus = onValue(ref(database, `${root}/device_status`), (snap) => {
      setStatus(snap.exists() ? (snap.val() as AirguardDeviceStatus) : null);
    });

    const unsubLocation = onValue(ref(database, `${root}/user_location`), (snap) => {
      setLocation(snap.exists() ? (snap.val() as AirguardUserLocation) : null);
    });

    const unsubHistory = onValue(ref(database, `${root}/history/${todayKey}`), (snap) => {
      setTodayHistoryRaw(snap.exists() ? (snap.val() as Record<string, any>) : null);
    });

    return () => {
      unsubLatest();
      unsubStatus();
      unsubLocation();
      unsubHistory();
    };
  }, [deviceId, todayKey]);

  const latestMetrics = useMemo(() => {
    const obj = (latest ?? null) as Record<string, unknown> | null;

    const aqi = pickNumber(obj, ["After aqi", "aqi", "AQI"]);
    const dustDensity = pickNumber(obj, ["dust_density", "After dust_density", "pm25", "PM2.5"]);
    const coPpm = pickNumber(obj, ["co_ppm", "After co_ppm", "co", "CO"]);
    const no2Ppm = pickNumber(obj, ["no2_ppm", "After no2_ppm", "no2", "NO2"]);
    const temperature = pickNumber(obj, ["temperature", "temp", "Temperature"]);
    const humidity = pickNumber(obj, ["humidity", "Humidity"]);
    const recordedAt = typeof obj?.recorded_at === "string" ? (obj.recorded_at as string) : undefined;

    return { aqi, dustDensity, coPpm, no2Ppm, temperature, humidity, recordedAt };
  }, [latest]);

  const todayHistory = useMemo<AirguardHistoryPoint[]>(() => {
    if (!todayHistoryRaw) return [];

    const points: AirguardHistoryPoint[] = Object.entries(todayHistoryRaw)
      .map(([timeKey, reading]) => {
        const r = (reading ?? null) as Record<string, unknown> | null;
        return {
          timeKey,
          recordedAt: typeof r?.recorded_at === "string" ? (r.recorded_at as string) : undefined,
          aqi: pickNumber(r, ["After aqi", "aqi", "AQI"]),
          dustDensity: pickNumber(r, ["dust_density", "After dust_density", "pm25", "PM2.5"]),
          coPpm: pickNumber(r, ["co_ppm", "After co_ppm", "co", "CO"]),
          no2Ppm: pickNumber(r, ["no2_ppm", "After no2_ppm", "no2", "NO2"]),
          temperature: pickNumber(r, ["temperature", "temp", "Temperature"]),
          humidity: pickNumber(r, ["humidity", "Humidity"]),
        };
      })
      .sort((a, b) => a.timeKey.localeCompare(b.timeKey));

    // Keep only the latest 120 points to avoid over-rendering
    return points.slice(-120);
  }, [todayHistoryRaw]);

  return {
    loading,
    error,
    todayKey,
    latest,
    latestMetrics,
    status,
    location,
    todayHistory,
  };
}
