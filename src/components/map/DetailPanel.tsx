/**
 * DetailPanel — Right‑side slide‑out panel (modelled after CURA DetailPanel)
 * Shows selected hotspot details, nearby NGOs, AI suggestions.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Phone,
  Globe,
  Sparkles,
  Building2,
  BarChart2,
  Loader2,
  Wind,
  Activity,
} from "lucide-react";
import { getAqiColor } from "@/lib/statePollutionData";
import type { PollutionPoint } from "./PollutionMap";

/* ─── Nearby NGO type ─── */
interface NearbyNGO {
  name: string;
  city: string;
  state: string;
  contact: string;
  website?: string;
  focus: string[];
  activities: string[];
}

interface DetailPanelProps {
  point: PollutionPoint | null;
  onClose: () => void;
  nearbyNGOs?: NearbyNGO[];
  showAISuggestions?: boolean;
}

/* ─── Pre‑baked AI suggestion templates (no backend needed) ─── */
const AI_SUGGESTIONS: Record<string, string[]> = {
  "PM2.5": [
    "Deploy HEPA‑grade air purifiers in community buildings within 2 km radius.",
    "Issue advisory: use N95 masks outdoors when AQI > 150.",
    "Coordinate with municipal bodies to spray water on unpaved roads to suppress dust.",
    "Setup real‑time AQI display boards near schools and hospitals.",
  ],
  PM10: [
    "Enforce construction‑site dust‑suppression guidelines from CPCB.",
    "Distribute respiratory health kits to vulnerable communities.",
    "Conduct health camps focusing on respiratory screening in the vicinity.",
    "Initiate green‑belt plantation drives along road corridors.",
  ],
  CO2: [
    "Promote EV adoption in the local transport fleet.",
    "Propose a congestion‑pricing pilot to reduce traffic density.",
    "Partner with local industry to monitor stack emissions.",
    "Organise community tree‑planting events to enhance carbon sinks.",
  ],
  SO2: [
    "Alert nearby industrial units about elevated SO₂ — request stack‑data audit.",
    "Distribute lime‑coated filter masks to outdoor workers.",
    "Install passive SO₂ sampling tubes for long‑term trend analysis.",
    "Coordinate with SPCB for targeted industrial inspections.",
  ],
  NO2: [
    "Request traffic police to divert heavy vehicles from residential zones.",
    "Advocate for catalytic‑converter inspection drives in the area.",
    "Setup diffusion‑tube monitoring network for NO₂ profiling.",
    "Conduct public awareness campaign on vehicular emission norms.",
  ],
  O3: [
    "Issue heat‑advisory: avoid outdoor exercise between 12 PM – 4 PM.",
    "Encourage VOC‑free paints and solvents in nearby industries.",
    "Deploy portable ozone monitors in parks and playgrounds.",
    "Engage local media to broadcast ground‑level ozone warnings.",
  ],
};

const DetailPanel = ({
  point,
  onClose,
  nearbyNGOs = [],
  showAISuggestions = true,
}: DetailPanelProps) => {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setAiSuggestions([]);
  }, [point]);

  const fetchAiSuggestions = () => {
    setAiLoading(true);
    // Simulated delay for UX polish
    setTimeout(() => {
      const key = point?.pollutant ?? "PM2.5";
      const fallback = AI_SUGGESTIONS["PM2.5"];
      setAiSuggestions(AI_SUGGESTIONS[key] ?? fallback);
      setAiLoading(false);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {point && (
        <motion.div
          initial={{ x: 420, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 420, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
          className="absolute top-0 right-0 h-full z-[60] overflow-y-auto border-l"
          style={{
            width: 400,
            background:
              "linear-gradient(180deg, hsl(20,25%,12%) 0%, hsl(20,18%,8%) 100%)",
            borderColor: "hsl(25,30%,20%)",
          }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <X className="w-4 h-4 text-white/60" />
          </button>

          {/* Header banner */}
          <div
            className="px-6 pt-6 pb-5"
            style={{
              background: `linear-gradient(135deg, ${getAqiColor(point.aqi)}35, transparent 70%)`,
            }}
          >
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-3"
              style={{
                background: `${getAqiColor(point.aqi)}25`,
                color: getAqiColor(point.aqi),
                border: `1px solid ${getAqiColor(point.aqi)}40`,
              }}
            >
              <Activity className="w-3 h-3" />
              {point.severity}
            </span>
            <h2 className="text-lg font-extrabold text-white tracking-tight leading-tight">
              {point.label}
            </h2>
            <p className="text-xs text-white/50 mt-1 font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {point.street || point.state}
            </p>
          </div>

          {/* Info grid */}
          <div className="px-6 py-4 grid grid-cols-2 gap-3">
            {[
              {
                label: "AQI",
                value: point.aqi,
                icon: BarChart2,
                colour: getAqiColor(point.aqi),
              },
              {
                label: "Pollutant",
                value: point.pollutant,
                icon: Wind,
                colour: "hsl(25,95%,53%)",
              },
              {
                label: "State",
                value: point.state,
                icon: MapPin,
                colour: "hsl(345,65%,47%)",
              },
              {
                label: "Severity",
                value: point.severity,
                icon: Activity,
                colour: getAqiColor(point.aqi),
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-xl p-3"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className="w-3 h-3" style={{ color: item.colour }} />
                    <span className="text-[9px] font-bold text-white/35 uppercase tracking-wider">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-sm font-extrabold text-white">
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>

          {point.description && (
            <div className="px-6 pb-3">
              <p className="text-xs text-white/50 leading-relaxed">
                {point.description}
              </p>
            </div>
          )}

          {/* Divider */}
          <div
            className="mx-6 h-px my-2"
            style={{ background: "rgba(255,255,255,0.06)" }}
          />

          {/* Nearby NGOs */}
          {nearbyNGOs.length > 0 && (
            <div className="px-6 py-3">
              <h3 className="text-[10px] font-extrabold tracking-widest uppercase text-white/40 mb-3">
                Nearby NGOs
              </h3>
              <div className="space-y-2.5">
                {nearbyNGOs.map((ngo, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-3.5"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(135deg, hsl(25,95%,53%), hsl(345,65%,47%))",
                        }}
                      >
                        <Building2 className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">
                          {ngo.name}
                        </h4>
                        <p className="text-[10px] text-white/40 font-medium">
                          {ngo.city}, {ngo.state}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {ngo.focus.map((f) => (
                        <span
                          key={f}
                          className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                          style={{
                            background: "hsl(25,95%,53%,0.12)",
                            color: "hsl(25,95%,65%)",
                          }}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2.5 flex items-center gap-3">
                      {ngo.contact && (
                        <a
                          href={`tel:${ngo.contact}`}
                          className="flex items-center gap-1 text-[10px] font-semibold"
                          style={{ color: "hsl(25,95%,60%)" }}
                        >
                          <Phone className="w-3 h-3" />
                          {ngo.contact}
                        </a>
                      )}
                      {ngo.website && (
                        <a
                          href={ngo.website}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-[10px] font-semibold"
                          style={{ color: "hsl(200,80%,60%)" }}
                        >
                          <Globe className="w-3 h-3" />
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showAISuggestions && (
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: aiLoading ? 360 : 0 }}
                    transition={{ duration: 2, repeat: aiLoading ? Infinity : 0, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4" style={{ color: "hsl(25,95%,60%)" }} />
                  </motion.div>
                  <span className="text-[10px] font-extrabold tracking-widest uppercase text-white/40">
                    AI Suggestions
                  </span>
                </div>

                <button
                  onClick={fetchAiSuggestions}
                  disabled={aiLoading}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold text-white transition-all duration-200 disabled:opacity-50"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(25,95%,53%), hsl(345,65%,47%))",
                    boxShadow: "0 4px 16px hsl(25,95%,53%,0.20)",
                  }}
                >
                  {aiLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  {aiLoading ? "Analysing…" : "Get AI Suggestions"}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {aiSuggestions.length > 0 ? (
                  <motion.div
                    key="suggestions"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="rounded-xl border p-4"
                    style={{
                      background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
                      borderColor: "rgba(255,255,255,0.08)",
                    }}
                  >
                    <div className="space-y-2">
                      {aiSuggestions.map((suggestion, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.08 }}
                          className="flex gap-2.5 rounded-xl p-3"
                          style={{ background: "rgba(255,255,255,0.03)" }}
                        >
                          <Sparkles
                            className="w-3 h-3 mt-0.5 shrink-0"
                            style={{ color: "hsl(25,95%,60%)" }}
                          />
                          <p className="text-[11px] text-white/65 leading-relaxed font-medium">
                            {suggestion}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : !aiLoading ? (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="rounded-xl border p-4 text-center"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      borderColor: "rgba(255,255,255,0.08)",
                    }}
                  >
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Sparkles className="w-6 h-6 text-white/35 mx-auto mb-2" />
                    </motion.div>
                    <p className="text-xs text-white/45 leading-relaxed">
                      Click "Get AI Suggestions" for targeted pollution reduction strategies for this hotspot.
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DetailPanel;
