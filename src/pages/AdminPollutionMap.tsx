/**
 * Admin Pollution Map — CURA-style modular layout (Admin version)
 * Composes: MapSidebar + PollutionMap + DetailPanel + AIChatbot
 * Admin sees ALL states with no restrictions.
 * Enhanced with: Top polluted states ranking, national analytics overlay,
 * state comparison, and live surveillance indicators.
 */

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  ShieldCheck,
  BarChart3,
  TrendingDown,
  TrendingUp,
  Minus,
  AlertTriangle,
  Users,
  Activity,
  Eye,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import PollutionMap, { type PollutionPoint } from "@/components/map/PollutionMap";
import MapSidebar from "@/components/map/MapSidebar";
import DetailPanel from "@/components/map/DetailPanel";
import AIChatbot from "@/components/chat/AIChatbot";
import { pollutionHotspots } from "@/data/pollutionHotspots";
import { getNearbyNGOs } from "@/data/ngoData";
import { indianStates, getAqiColor } from "@/lib/statePollutionData";

/* ─── Component ─── */

const AdminPollutionMap = () => {
  const navigate = useNavigate();

  const [selectedPollutant, setSelectedPollutant] = useState<string | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<PollutionPoint | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  /* Welcome toast */
  useEffect(() => {
    toast.success("Welcome Admin! 🛡️", {
      description: "Full nationwide pollution surveillance active — all 29 states visible.",
    });
  }, []);

  /* All hotspot data */
  const hotspotData: PollutionPoint[] = useMemo(() => {
    if (selectedState) {
      return pollutionHotspots.filter((h) => h.state === selectedState);
    }
    return pollutionHotspots;
  }, [selectedState]);

  /* Nearby NGOs for detail panel */
  const nearbyNGOs = useMemo(() => {
    if (!selectedPoint) return [];
    return getNearbyNGOs(selectedPoint.state, 4);
  }, [selectedPoint]);

  /* National analytics */
  const analytics = useMemo(() => {
    const sorted = [...indianStates].sort((a, b) => b.aqi - a.aqi);
    const topPolluted = sorted.slice(0, 5);
    const cleanest = sorted.slice(-5).reverse();
    const avgAqi = Math.round(indianStates.reduce((s, st) => s + st.aqi, 0) / indianStates.length);
    const unhealthyStates = indianStates.filter((s) => s.aqi > 100).length;
    const improvingStates = indianStates.filter((s) => s.trend === "improving").length;
    const worseningStates = indianStates.filter((s) => s.trend === "worsening").length;
    const totalHotspots = pollutionHotspots.length;
    const emergencyHotspots = pollutionHotspots.filter((h) => h.severity === "Unhealthy").length;

    return {
      topPolluted,
      cleanest,
      avgAqi,
      unhealthyStates,
      improvingStates,
      worseningStates,
      totalHotspots,
      emergencyHotspots,
    };
  }, []);

  const handleStateClick = (stateName: string) => {
    setSelectedState(stateName);
    toast.info(`Viewing ${stateName}`, {
      description: "Showing hotspots in this state. Click map background to reset.",
    });
  };

  const handleLogout = () => {
    navigate("/map");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* ── Sidebar ── */}
      <MapSidebar
        data={hotspotData}
        selectedPollutant={selectedPollutant}
        setSelectedPollutant={setSelectedPollutant}
        selectedSeverity={selectedSeverity}
        setSelectedSeverity={setSelectedSeverity}
        title="Admin Dashboard"
        subtitle="Nationwide Pollution Surveillance"
      />

      {/* ── Map + Detail panel wrapper ── */}
      <div className="relative flex-1">
        {/* ── Top bar: Admin identity + State filter + Analytics toggle ── */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute top-4 right-4 z-[1000] flex items-center gap-2"
        >
          {/* National Avg AQI */}
          <div className="hidden md:flex items-center gap-1.5 bg-card/90 backdrop-blur-md rounded-lg px-3 py-2 shadow-lg border border-border">
            <Activity className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold text-foreground">
              National Avg: {analytics.avgAqi}
            </span>
            <span className="w-px h-4 bg-border mx-0.5" />
            <span className="text-[9px] text-muted-foreground">
              <span className="text-red-400 font-bold">{analytics.unhealthyStates}</span> critical states
            </span>
          </div>

          {/* Analytics Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAnalytics(!showAnalytics)}
            className={`flex items-center gap-1.5 backdrop-blur-md rounded-lg px-3 py-2 shadow-lg border transition-colors ${
              showAnalytics
                ? "bg-primary/20 border-primary/30 text-primary"
                : "bg-card/90 border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="text-[10px] font-semibold">Analytics</span>
          </motion.button>

          {/* State filter badge */}
          {selectedState && (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={() => {
                setSelectedState(null);
                toast.info("Reset", { description: "Showing all states." });
              }}
              className="flex items-center gap-1.5 bg-card/90 backdrop-blur-md rounded-lg px-3 py-2 shadow-lg border border-border text-foreground hover:bg-accent transition-colors"
            >
              <span className="text-[10px] font-bold">📍 {selectedState}</span>
              <span className="text-[9px] text-muted-foreground">✕ Clear</span>
            </motion.button>
          )}

          {/* Admin Identity */}
          <div className="flex items-center gap-2 bg-card/90 backdrop-blur-md rounded-lg px-3 py-2 shadow-lg border border-border">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, hsl(25,95%,53%), hsl(345,65%,47%))",
              }}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-foreground leading-none">Admin</p>
              <p className="text-[9px] text-muted-foreground">All 29 States</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-card/90 backdrop-blur-md rounded-lg px-3 py-2.5 shadow-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="text-[10px] font-semibold">Exit</span>
          </button>
        </motion.div>

        {/* ── Analytics Overlay Panel (bottom-left) ── */}
        <AnimatePresence>
          {showAnalytics && (
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-16 left-16 z-[1000] w-[300px] max-h-[calc(100vh-120px)] overflow-y-auto rounded-2xl shadow-2xl border"
              style={{
                background: "hsl(20,18%,10%)",
                borderColor: "hsl(25,30%,18%)",
                scrollbarWidth: "thin",
              }}
            >
              {/* Close */}
              <button
                onClick={() => setShowAnalytics(false)}
                className="absolute top-3 right-3 z-10 w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X className="w-3 h-3 text-white/50" />
              </button>

              {/* Header */}
              <div
                className="px-5 pt-5 pb-4"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(25,95%,53%,0.15), transparent 70%)",
                }}
              >
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  National Analytics
                </h3>
                <p className="text-[10px] text-white/40 mt-0.5">Real-time surveillance overview</p>
              </div>

              {/* Quick Stats */}
              <div className="px-4 py-3 grid grid-cols-2 gap-2">
                {[
                  { label: "Total Hotspots", value: analytics.totalHotspots, color: "hsl(25,95%,53%)" },
                  { label: "Emergency", value: analytics.emergencyHotspots, color: "#ef4444" },
                  { label: "Improving", value: analytics.improvingStates, color: "#22c55e" },
                  { label: "Worsening", value: analytics.worseningStates, color: "#f59e0b" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl p-3 text-center"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    <div className="text-lg font-black" style={{ color: stat.color }}>
                      {stat.value}
                    </div>
                    <div className="text-[8px] font-bold text-white/35 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="mx-4 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

              {/* Top Polluted States */}
              <div className="px-4 py-3">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-white/40 mb-2.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                  Most Polluted States
                </h4>
                <div className="space-y-2">
                  {analytics.topPolluted.map((state, i) => (
                    <motion.button
                      key={state.state}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => handleStateClick(state.state)}
                      className="w-full flex items-center gap-2.5 rounded-lg p-2.5 transition-all hover:bg-white/5"
                      style={{ background: "rgba(255,255,255,0.02)" }}
                    >
                      <span className="text-[10px] font-black text-white/30 w-4">
                        #{i + 1}
                      </span>
                      <div className="flex-1 text-left">
                        <p className="text-[11px] font-bold text-white">{state.state}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          {state.trend === "improving" ? (
                            <TrendingUp className="w-2.5 h-2.5 text-emerald-400" />
                          ) : state.trend === "worsening" ? (
                            <TrendingDown className="w-2.5 h-2.5 text-red-400" />
                          ) : (
                            <Minus className="w-2.5 h-2.5 text-yellow-400" />
                          )}
                          <span className="text-[9px] text-white/35 capitalize">{state.trend}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black" style={{ color: getAqiColor(state.aqi) }}>
                          {state.aqi}
                        </span>
                        <p className="text-[8px] text-white/30 font-semibold">AQI</p>
                      </div>
                      {/* AQI bar */}
                      <div className="w-10 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min((state.aqi / 200) * 100, 100)}%`,
                            background: getAqiColor(state.aqi),
                          }}
                        />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="mx-4 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

              {/* Cleanest States */}
              <div className="px-4 py-3">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-white/40 mb-2.5 flex items-center gap-1.5">
                  <Eye className="w-3 h-3 text-emerald-400" />
                  Cleanest States
                </h4>
                <div className="space-y-1.5">
                  {analytics.cleanest.map((state, i) => (
                    <motion.button
                      key={state.state}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.06 }}
                      onClick={() => handleStateClick(state.state)}
                      className="w-full flex items-center gap-2.5 rounded-lg p-2 transition-all hover:bg-white/5"
                    >
                      <span className="text-[11px] font-bold text-white/80">{state.state}</span>
                      <span className="ml-auto text-xs font-black text-emerald-400">{state.aqi}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* National Averages */}
              <div className="px-4 py-3">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-white/40 mb-2.5 flex items-center gap-1.5">
                  <Users className="w-3 h-3 text-blue-400" />
                  National Averages
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "PM2.5", value: Math.round(indianStates.reduce((s, st) => s + st.pm25, 0) / indianStates.length), unit: "µg/m³" },
                    { label: "PM10", value: Math.round(indianStates.reduce((s, st) => s + st.pm10, 0) / indianStates.length), unit: "µg/m³" },
                    { label: "CO₂", value: Math.round(indianStates.reduce((s, st) => s + st.co2, 0) / indianStates.length), unit: "ppm" },
                  ].map((avg) => (
                    <div
                      key={avg.label}
                      className="rounded-lg p-2 text-center"
                      style={{ background: "rgba(255,255,255,0.03)" }}
                    >
                      <div className="text-xs font-black text-white">{avg.value}</div>
                      <div className="text-[8px] text-white/30 font-bold">{avg.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Surveillance indicator (bottom-left) ── */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="absolute bottom-6 left-16 z-[1000] hidden md:block"
        >
          <div className="bg-card/90 backdrop-blur-md rounded-xl px-4 py-3 shadow-lg border border-border">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                Surveillance Active
              </span>
              <span className="w-px h-4 bg-border mx-1" />
              <span className="text-[9px] text-muted-foreground">
                {analytics.totalHotspots} hotspots · 29 states
              </span>
            </div>
          </div>
        </motion.div>

        {/* Pollution Map — Admin has full access */}
        <PollutionMap
          data={hotspotData}
          selectedPollutant={selectedPollutant}
          selectedSeverity={selectedSeverity}
          onSelectPoint={setSelectedPoint}
          onStateClick={handleStateClick}
          isPremium={true}
        />

        {/* Detail Panel */}
        <DetailPanel
          point={selectedPoint}
          onClose={() => setSelectedPoint(null)}
          nearbyNGOs={nearbyNGOs}
          showAISuggestions={false}
        />
      </div>

      {/* Floating AI Chatbot */}
      <AIChatbot
        stateName={selectedState || "India"}
        placement="map"
        selectedLocation={
          selectedPoint
            ? {
                label: selectedPoint.label,
                aqi: selectedPoint.aqi,
                pollutant: selectedPoint.pollutant,
                severity: selectedPoint.severity,
                state: selectedPoint.state,
                street: selectedPoint.street,
                description: selectedPoint.description,
              }
            : null
        }
      />

      {/* Map marker & tooltip styles */}
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
        .pollution-popup-custom .leaflet-popup-tip {
          box-shadow: 0 4px 10px rgba(0,0,0,0.08);
        }
        .state-label-tooltip {
          background: rgba(255,255,255,0.95) !important;
          border: 2px solid hsl(25,95%,53%) !important;
          border-radius: 10px !important;
          padding: 6px 14px !important;
          font-weight: 800 !important;
          font-size: 12px !important;
          color: hsl(25,40%,20%) !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important;
          letter-spacing: 0.3px !important;
        }
        .state-label-tooltip-active {
          background: hsl(142,76%,95%) !important;
          border: 2px solid hsl(142,76%,40%) !important;
          border-radius: 10px !important;
          padding: 6px 14px !important;
          font-weight: 800 !important;
          font-size: 12px !important;
          color: hsl(142,50%,25%) !important;
          box-shadow: 0 4px 16px rgba(34,197,94,0.2) !important;
        }
        .state-label-tooltip-locked {
          background: rgba(240,240,240,0.95) !important;
          border: 2px dashed hsl(0,0%,65%) !important;
          border-radius: 10px !important;
          padding: 6px 14px !important;
          font-weight: 700 !important;
          font-size: 11px !important;
          color: hsl(0,0%,45%) !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important;
        }
        .state-label-tooltip::before,
        .state-label-tooltip-active::before,
        .state-label-tooltip-locked::before { display: none !important; }
        .map-access-legend { margin-bottom: 10px !important; }
      `}</style>
    </div>
  );
};

export default AdminPollutionMap;
