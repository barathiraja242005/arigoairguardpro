/**
 * MapSidebar — Animated sidebar for the pollution map (modelled after CURA Sidebar)
 * Pollutant filter pills, severity toggle, live stats, download button.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wind,
  ChevronLeft,
  ChevronRight,
  Download,
  BarChart2,
  AlertTriangle,
  MapPin,
  Flame,
} from "lucide-react";
import { toast } from "sonner";
import type { PollutionPoint } from "./PollutionMap";

interface MapSidebarProps {
  data: PollutionPoint[];
  selectedPollutant: string | null;
  setSelectedPollutant: (v: string | null) => void;
  selectedSeverity: string | null;
  setSelectedSeverity: (v: string | null) => void;
  title?: string;
  subtitle?: string;
}

/* Pollutants we can filter on */
const POLLUTANTS = [
  { key: "PM2.5", icon: Wind, colour: "hsl(25,95%,53%)" },
  { key: "PM10", icon: Wind, colour: "hsl(345,65%,47%)" },
  { key: "CO2", icon: Flame, colour: "hsl(14,70%,52%)" },
  { key: "SO2", icon: AlertTriangle, colour: "hsl(40,80%,52%)" },
  { key: "NO2", icon: BarChart2, colour: "hsl(200,80%,50%)" },
  { key: "O3", icon: MapPin, colour: "hsl(280,60%,55%)" },
];

const SEVERITY_LEVELS = [
  { key: "Good", colour: "#22c55e", label: "Good (0-100)" },
  { key: "Moderate", colour: "#f59e0b", label: "Moderate (101-200)" },
  { key: "Unhealthy", colour: "#ef4444", label: "Unhealthy (200+)" },
];

/* ─── Component ─── */
const MapSidebar = ({
  data,
  selectedPollutant,
  setSelectedPollutant,
  selectedSeverity,
  setSelectedSeverity,
  title = "Pollution Hotspots",
  subtitle = "Air Quality Monitoring",
}: MapSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  /* Compute stats */
  const totalHotspots = data.length;
  const unhealthyCount = data.filter((d) => d.severity === "Unhealthy").length;
  const stateSet = new Set(data.map((d) => d.state));
  const statesAffected = stateSet.size;

  const handleDownload = () => {
    const csvRows = [
      "Label,State,AQI,Pollutant,Severity,Lat,Lng",
      ...data.map(
        (d) =>
          `"${d.label}","${d.state}",${d.aqi},"${d.pollutant}","${d.severity}",${d.lat},${d.lng}`
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pollution_hotspots.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Download started", { description: "CSV file exported" });
  };

  return (
    <motion.div
      animate={{ width: collapsed ? 48 : 320 }}
      transition={{ type: "spring", stiffness: 350, damping: 35 }}
      className="relative h-full shrink-0 z-[50] flex flex-col border-r"
      style={{
        background:
          "linear-gradient(180deg, hsl(20,25%,12%) 0%, hsl(20,18%,8%) 100%)",
        borderColor: "hsl(25,30%,20%)",
      }}
    >
      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-7 z-[60] w-7 h-7 rounded-full flex items-center justify-center shadow-lg border"
        style={{
          background: "hsl(25,95%,53%)",
          borderColor: "hsl(25,95%,45%)",
        }}
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5 text-white" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5 text-white" />
        )}
      </button>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full overflow-y-auto scrollbar-thin"
          >
            {/* Header */}
            <div
              className="px-5 pt-6 pb-4"
              style={{
                background:
                  "linear-gradient(135deg, hsl(25,95%,53%) 0%, hsl(345,65%,47%) 100%)",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Wind className="w-5 h-5 text-white/90" />
                <h2 className="text-base font-extrabold text-white tracking-tight">
                  {title}
                </h2>
              </div>
              <p className="text-xs text-white/70 font-medium">{subtitle}</p>
            </div>

            {/* Pollutant Filters */}
            <div className="px-4 pt-4 pb-2">
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-white/40 mb-2 block">
                Pollutant
              </span>
              <div className="flex flex-wrap gap-2">
                {POLLUTANTS.map((p) => {
                  const active = selectedPollutant === p.key;
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.key}
                      onClick={() =>
                        setSelectedPollutant(active ? null : p.key)
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all duration-200"
                      style={{
                        background: active
                          ? `${p.colour}22`
                          : "rgba(255,255,255,0.04)",
                        color: active ? p.colour : "rgba(255,255,255,0.5)",
                        border: `1.5px solid ${active ? p.colour : "rgba(255,255,255,0.08)"}`,
                        boxShadow: active
                          ? `0 0 12px ${p.colour}25`
                          : "none",
                      }}
                    >
                      <Icon className="w-3 h-3" />
                      {p.key}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Severity Filter */}
            <div className="px-4 pt-2 pb-3">
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-white/40 mb-2 block">
                AQI Level
              </span>
              <div className="flex flex-col gap-1.5">
                {SEVERITY_LEVELS.map((s) => {
                  const active = selectedSeverity === s.key;
                  return (
                    <button
                      key={s.key}
                      onClick={() =>
                        setSelectedSeverity(active ? null : s.key)
                      }
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-semibold transition-all duration-200"
                      style={{
                        background: active
                          ? `${s.colour}18`
                          : "rgba(255,255,255,0.03)",
                        color: active ? s.colour : "rgba(255,255,255,0.55)",
                        border: `1.5px solid ${active ? s.colour : "transparent"}`,
                      }}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ background: s.colour }}
                      />
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="mx-4 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

            {/* Stats Grid */}
            <div className="px-4 py-4 grid grid-cols-3 gap-2">
              {[
                { label: "Hotspots", value: totalHotspots, colour: "hsl(25,95%,53%)" },
                { label: "Emergency", value: unhealthyCount, colour: "#ef4444" },
                { label: "States", value: statesAffected, colour: "hsl(345,65%,47%)" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl p-2.5 text-center"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <div
                    className="text-lg font-black"
                    style={{ color: stat.colour }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-[9px] font-bold text-white/35 tracking-wider uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Download */}
            <div className="mt-auto px-4 pb-5">
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all duration-200"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(25,95%,53%), hsl(345,65%,47%))",
                  boxShadow: "0 4px 16px hsl(25,95%,53%,0.25)",
                }}
              >
                <Download className="w-3.5 h-3.5" />
                Download Report
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MapSidebar;
