/**
 * NGO Dashboard — CURA-style modular layout with Premium membership
 * Composes: MapSidebar + PollutionMap + DetailPanel + AIChatbot
 * NGO user sees only their assigned state (other states restricted unless premium).
 */

import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Heart,
  Crown,
  X,
  Shield,
  Zap,
  Globe2,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  Lock,
  Sparkles,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import PollutionMap, { type PollutionPoint } from "@/components/map/PollutionMap";
import MapSidebar from "@/components/map/MapSidebar";
import DetailPanel from "@/components/map/DetailPanel";
import AIChatbot from "@/components/chat/AIChatbot";
import { getStateByName, type StatePollutionData } from "@/lib/statePollutionData";
import { getHotspotsForState, pollutionHotspots } from "@/data/pollutionHotspots";
import { getNearbyNGOs } from "@/data/ngoData";
import { toast } from "sonner";

/* ─── Component ─── */

const NGODashboard = () => {
  const navigate = useNavigate();

  const [ngoName, setNgoName] = useState("");
  const [stateName, setStateName] = useState("");
  const [stateData, setStateData] = useState<StatePollutionData | undefined>();
  const [selectedPollutant, setSelectedPollutant] = useState<string | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<PollutionPoint | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  /* Auth check */
  useEffect(() => {
    const auth = localStorage.getItem("ngoAuthenticated");
    const name = localStorage.getItem("ngoName");
    const state = localStorage.getItem("ngoState");
    if (!auth || !name || !state) {
      navigate("/ngo-login");
      return;
    }
    setNgoName(name);
    setStateName(state);
    setStateData(getStateByName(state));

    const premium = localStorage.getItem("ngoPremium") === "true";
    setIsPremium(premium);
  }, [navigate]);

  /* Hotspot data — only user's state unless premium */
  const hotspotData: PollutionPoint[] = useMemo(() => {
    if (!stateName) return [];
    if (isPremium) return pollutionHotspots;
    return getHotspotsForState(stateName);
  }, [stateName, isPremium]);

  /* Nearby NGOs for detail panel */
  const nearbyNGOs = useMemo(() => {
    if (!selectedPoint) return [];
    return getNearbyNGOs(selectedPoint.state, 3);
  }, [selectedPoint]);

  /* State AQI stats for the top bar */
  const stateStats = useMemo(() => {
    if (!stateData) return null;
    const stateHotspots = getHotspotsForState(stateName);
    const unhealthy = stateHotspots.filter((h) => h.severity === "Unhealthy").length;
    const moderate = stateHotspots.filter((h) => h.severity === "Moderate").length;
    const good = stateHotspots.filter((h) => h.severity === "Good").length;
    return { total: stateHotspots.length, unhealthy, moderate, good };
  }, [stateData, stateName]);

  const handleStateClick = (clickedState: string) => {
    if (clickedState === stateName) {
      toast.success(`Viewing ${clickedState}`, {
        description: "This is your assigned state.",
      });
    } else if (!isPremium) {
      setShowPremiumModal(true);
    }
  };

  const handleUpgradePremium = () => {
    localStorage.setItem("ngoPremium", "true");
    setIsPremium(true);
    setShowPremiumModal(false);
    toast.success("🎉 Premium Activated!", {
      description: "You now have access to all 29 states. Enjoy nationwide pollution data!",
      duration: 5000,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("ngoAuthenticated");
    localStorage.removeItem("ngoName");
    localStorage.removeItem("ngoState");
    localStorage.removeItem("ngoPremium");
    navigate("/map");
  };

  if (!stateData) return null;

  const trendIcon =
    stateData.trend === "improving" ? (
      <TrendingUp className="w-3 h-3 text-emerald-400" />
    ) : stateData.trend === "worsening" ? (
      <TrendingDown className="w-3 h-3 text-red-400" />
    ) : (
      <Minus className="w-3 h-3 text-yellow-400" />
    );

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* ── Sidebar ── */}
      <MapSidebar
        data={hotspotData}
        selectedPollutant={selectedPollutant}
        setSelectedPollutant={setSelectedPollutant}
        selectedSeverity={selectedSeverity}
        setSelectedSeverity={setSelectedSeverity}
        title="NGO Dashboard"
        subtitle={`${ngoName} · ${stateName}`}
      />

      {/* ── Map + Detail panel wrapper ── */}
      <div className="relative flex-1">
        {/* ── Top bar: NGO identity + State stats + Premium ── */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute top-4 right-4 z-[1000] flex items-center gap-2"
        >
          {/* State AQI Quick Stats */}
          {stateStats && (
            <div className="hidden md:flex items-center gap-1.5 bg-card/90 backdrop-blur-md rounded-lg px-3 py-2 shadow-lg border border-border">
              <BarChart3 className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-bold text-foreground">AQI {stateData.aqi}</span>
              <span className="w-px h-4 bg-border mx-1" />
              {trendIcon}
              <span className="text-[9px] text-muted-foreground capitalize">{stateData.trend}</span>
              <span className="w-px h-4 bg-border mx-1" />
              <span className="text-[9px] text-muted-foreground">
                <span className="text-red-400 font-bold">{stateStats.unhealthy}</span> critical
              </span>
            </div>
          )}

          {/* Premium Badge / Upgrade Button */}
          {isPremium ? (
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md rounded-lg px-3 py-2 shadow-lg border border-amber-500/30">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] font-bold text-amber-300">PREMIUM</span>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPremiumModal(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-md rounded-lg px-3 py-2 shadow-lg border border-amber-500/20 hover:border-amber-500/40 transition-colors"
            >
              <Lock className="w-3 h-3 text-amber-400/70" />
              <span className="text-[10px] font-semibold text-amber-300/80">Upgrade</span>
            </motion.button>
          )}

          {/* NGO Identity */}
          <div className="flex items-center gap-2 bg-card/90 backdrop-blur-md rounded-lg px-3 py-2 shadow-lg border border-border">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, hsl(25,95%,53%), hsl(345,65%,47%))" }}
            >
              <Heart className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-foreground leading-none">{ngoName}</p>
              <p className="text-[9px] text-muted-foreground">{stateName}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-card/90 backdrop-blur-md rounded-lg px-3 py-2.5 shadow-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="text-[10px] font-semibold">Logout</span>
          </button>
        </motion.div>

        {/* ── State info banner (bottom-left) ── */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-6 left-16 z-[1000] hidden md:block"
        >
          <div className="bg-card/90 backdrop-blur-md rounded-xl px-4 py-3 shadow-lg border border-border max-w-[280px]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                {stateName} Overview
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="text-sm font-black text-primary">{stateData.pm25}</div>
                <div className="text-[8px] text-muted-foreground font-semibold">PM2.5</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-black text-primary">{stateData.pm10}</div>
                <div className="text-[8px] text-muted-foreground font-semibold">PM10</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-black text-primary">{stateData.co2}</div>
                <div className="text-[8px] text-muted-foreground font-semibold">CO₂</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-muted-foreground">Sources:</span>
                <div className="flex gap-1 flex-wrap justify-end">
                  {stateData.majorSources.slice(0, 3).map((src) => (
                    <span
                      key={src}
                      className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full"
                      style={{ background: "hsl(25,95%,53%,0.12)", color: "hsl(25,95%,65%)" }}
                    >
                      {src}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pollution Map */}
        <PollutionMap
          data={hotspotData}
          selectedPollutant={selectedPollutant}
          selectedSeverity={selectedSeverity}
          onSelectPoint={setSelectedPoint}
          onStateClick={handleStateClick}
          userState={stateName}
          isPremium={isPremium}
        />

        {/* Detail Panel (slides in from right) */}
        <DetailPanel
          point={selectedPoint}
          onClose={() => setSelectedPoint(null)}
          nearbyNGOs={nearbyNGOs}
          showAISuggestions
        />
      </div>

      {/* Floating AI Chatbot */}
      <AIChatbot
        stateName={stateName}
        defaultOpen
        focusMode="ngo-suggestions"
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

      {/* ── Premium Upgrade Modal ── */}
      <AnimatePresence>
        {showPremiumModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowPremiumModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md mx-4 rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: "hsl(20,18%,10%)" }}
            >
              {/* Modal Header */}
              <div
                className="relative px-6 pt-8 pb-6 text-center"
                style={{
                  background: "linear-gradient(135deg, hsl(40,90%,50%) 0%, hsl(25,95%,53%) 50%, hsl(345,65%,47%) 100%)",
                }}
              >
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                >
                  <Crown className="w-12 h-12 text-white mx-auto mb-3" />
                </motion.div>
                <h2 className="text-xl font-black text-white">Upgrade to Premium</h2>
                <p className="text-sm text-white/80 mt-1">Unlock nationwide pollution intelligence</p>
              </div>

              {/* Features List */}
              <div className="px-6 py-6 space-y-4">
                {[
                  { icon: Globe2, title: "All 29 States Access", desc: "View pollution data across every Indian state" },
                  { icon: BarChart3, title: "Comparative Analytics", desc: "Compare your state with national averages" },
                  { icon: Sparkles, title: "Advanced AI Insights", desc: "Get cross-state pollution recommendations" },
                  { icon: Users, title: "NGO Collaboration", desc: "Connect with NGOs in other states" },
                  { icon: Zap, title: "Real-time Alerts", desc: "Get notified about AQI spikes nationwide" },
                  { icon: Shield, title: "Priority Support", desc: "Dedicated support for your organization" },
                ].map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-3"
                    >
                      <div
                        className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center"
                        style={{ background: "hsl(25,95%,53%,0.15)" }}
                      >
                        <Icon className="w-4 h-4" style={{ color: "hsl(25,95%,60%)" }} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{feature.title}</h4>
                        <p className="text-xs text-white/50">{feature.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA */}
              <div className="px-6 pb-6 space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpgradePremium}
                  className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all"
                  style={{
                    background: "linear-gradient(135deg, hsl(40,90%,50%), hsl(25,95%,53%), hsl(345,65%,47%))",
                    boxShadow: "0 4px 20px hsl(25,95%,53%,0.35)",
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Crown className="w-4 h-4" />
                    Activate Premium Access
                  </div>
                </motion.button>
                <p className="text-center text-[10px] text-white/30">
                  Demo mode — click to activate instantly
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map marker styles */}
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

export default NGODashboard;
