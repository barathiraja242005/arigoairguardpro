/**
 * DeviceMap — personal map view for the device user.
 * Shows their device location (from Firebase) plus surrounding pollution hotspots.
 * Reuses the same Leaflet stack as NGO/Admin dashboards.
 */

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Wind, Activity, RadioTower } from "lucide-react";

import PollutionMap, { type PollutionPoint } from "@/components/map/PollutionMap";
import MapSidebar from "@/components/map/MapSidebar";
import DetailPanel from "@/components/map/DetailPanel";
import ThemeToggle from "@/components/ui/ThemeToggle";

import { pollutionHotspots } from "@/data/pollutionHotspots";
import { getNearbyNGOs } from "@/data/ngoData";
import { getAqiColor } from "@/lib/statePollutionData";
import { useAirguardDeviceAnalytics } from "@/hooks/useAirguardDeviceAnalytics";
import { useAuth } from "@/contexts/AuthContext";

/** Haversine distance in km */
function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(x));
}

const NEARBY_RADIUS_KM = 350;

const DeviceMap = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const deviceId = session?.role === "device" ? session.deviceId : "AIRGUARD_001";
  const { latestMetrics, location, status } = useAirguardDeviceAnalytics(deviceId);

  const [selectedPollutant, setSelectedPollutant] = useState<string | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<PollutionPoint | null>(null);

  const deviceCoord = useMemo(() => {
    if (location?.lat !== undefined && location?.lng !== undefined) {
      return { lat: location.lat, lng: location.lng };
    }
    return null;
  }, [location?.lat, location?.lng]);

  /** Hotspots near the device (or all if no device location yet). */
  const hotspotsNearMe = useMemo<PollutionPoint[]>(() => {
    if (!deviceCoord) return pollutionHotspots;
    return pollutionHotspots
      .map((p) => ({ point: p, dist: distanceKm(deviceCoord, { lat: p.lat, lng: p.lng }) }))
      .filter(({ dist }) => dist <= NEARBY_RADIUS_KM)
      .sort((a, b) => a.dist - b.dist)
      .map(({ point }) => point);
  }, [deviceCoord]);

  const nearbyNGOs = useMemo(() => {
    if (!selectedPoint) return [];
    return getNearbyNGOs(selectedPoint.state, 3);
  }, [selectedPoint]);

  const aqi = latestMetrics.aqi;
  const aqiColor = aqi !== undefined ? getAqiColor(aqi) : "hsl(220,15%,55%)";
  const isOnline = status?.online !== false;

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden">
      <MapSidebar
        data={hotspotsNearMe}
        selectedPollutant={selectedPollutant}
        setSelectedPollutant={setSelectedPollutant}
        selectedSeverity={selectedSeverity}
        setSelectedSeverity={setSelectedSeverity}
        title="Live Map"
        subtitle={`${deviceId} · pollution within ~${NEARBY_RADIUS_KM} km`}
      />

      <div className="relative flex-1">
        <ThemeToggle />

        {/* Top bar: device identity + AQI */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute top-4 right-4 z-[1000] flex flex-wrap items-center gap-2 max-w-[calc(100%-2rem)] justify-end"
        >
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 bg-card/90 backdrop-blur-md rounded-lg px-3 py-2 shadow-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="text-[10px] font-semibold">Dashboard</span>
          </button>

          <div className="flex items-center gap-2 bg-card/90 backdrop-blur-md rounded-lg px-3 py-2 shadow-lg border border-border">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-black"
              style={{ background: aqiColor }}
            >
              {aqi !== undefined ? Math.round(aqi) : "—"}
            </div>
            <div>
              <p className="text-[10px] font-bold text-foreground leading-none">{deviceId}</p>
              <p className="text-[9px] text-muted-foreground">Current AQI</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-card/90 backdrop-blur-md rounded-lg px-3 py-2 shadow-lg border border-border">
            <RadioTower className={`w-3.5 h-3.5 ${isOnline ? "text-emerald-500" : "text-destructive"}`} />
            <span className="text-[10px] font-semibold text-foreground">{isOnline ? "Online" : "Offline"}</span>
          </div>
        </motion.div>

        {/* No-location banner */}
        {!deviceCoord && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-card/95 backdrop-blur-md rounded-xl px-4 py-3 shadow-lg border border-warning/30 max-w-md">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-foreground">Awaiting device location</p>
                <p className="text-[11px] text-muted-foreground">
                  Showing all India hotspots. Once your device reports its GPS, we'll center the map and
                  filter hotspots within {NEARBY_RADIUS_KM} km.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom-left summary */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-6 left-16 z-[1000] hidden md:block"
        >
          <div className="bg-card/90 backdrop-blur-md rounded-xl px-4 py-3 shadow-lg border border-border">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                  {hotspotsNearMe.length} hotspots nearby
                </span>
              </div>
              {latestMetrics.dustDensity !== undefined && (
                <>
                  <span className="w-px h-4 bg-border" />
                  <div className="flex items-center gap-2">
                    <Activity className="w-3 h-3 text-secondary" />
                    <span className="text-[10px] text-muted-foreground">
                      PM2.5 {latestMetrics.dustDensity.toFixed(0)} µg/m³
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        <PollutionMap
          data={hotspotsNearMe}
          selectedPollutant={selectedPollutant}
          selectedSeverity={selectedSeverity}
          onSelectPoint={setSelectedPoint}
          isPremium
          deviceLocation={
            deviceCoord
              ? { ...deviceCoord, label: location?.label ?? deviceId, aqi }
              : undefined
          }
        />

        <DetailPanel
          point={selectedPoint}
          onClose={() => setSelectedPoint(null)}
          nearbyNGOs={nearbyNGOs}
          showAISuggestions={false}
        />
      </div>

      {/* Map marker styles (shared with admin/ngo dashboards) */}
      <style>{`
        @keyframes marker-pulse {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .custom-pollution-marker { background: transparent !important; border: none !important; }
        .pollution-popup-custom .leaflet-popup-content-wrapper {
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          padding: 4px;
          border: 1px solid rgba(0,0,0,0.06);
        }
        .state-label-tooltip {
          background: rgba(255,255,255,0.95) !important;
          border: 2px solid hsl(140,45%,38%) !important;
          border-radius: 10px !important;
          padding: 6px 14px !important;
          font-weight: 800 !important;
          font-size: 12px !important;
          color: hsl(0,0%,9%) !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important;
          letter-spacing: 0.3px !important;
        }
        .state-label-tooltip::before { display: none !important; }
      `}</style>
    </div>
  );
};

export default DeviceMap;
