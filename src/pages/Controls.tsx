import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Power,
  Fan,
  Moon,
  Zap,
  Sparkles,
  Calendar,
  Leaf,
  Clock,
  Server,
  Battery,
  Shield,
  Activity,
  Check,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { startFluctuation, stopFluctuation } from "@/lib/uploadData";
import { useAirguardDeviceAnalytics } from "@/hooks/useAirguardDeviceAnalytics";
import { useAuth } from "@/contexts/AuthContext";
import {
  pageStyles,
  pageHeader,
  responsive,
} from "@/lib/design-system";

type OperationMode = "auto" | "manual" | "eco" | "sleep";

interface ModeOption {
  key: OperationMode;
  label: string;
  description: string;
  icon: typeof Sparkles;
  /** Implied fan speed range (only used as a hint; manual is user-driven) */
  fanHint: string;
}

const MODES: ModeOption[] = [
  {
    key: "auto",
    label: "Auto",
    description: "Adapts fan speed to live AQI readings.",
    icon: Sparkles,
    fanHint: "Adaptive",
  },
  {
    key: "manual",
    label: "Manual",
    description: "Pick your own fan speed.",
    icon: Fan,
    fanHint: "Custom",
  },
  {
    key: "eco",
    label: "Eco",
    description: "Low power. Maximum battery life.",
    icon: Leaf,
    fanHint: "Speed 1–2",
  },
  {
    key: "sleep",
    label: "Sleep",
    description: "Silent operation. Display dims.",
    icon: Moon,
    fanHint: "Speed 1",
  },
];

const FAN_LABELS = ["Low", "Med", "High", "Turbo", "Max"];

const Controls = () => {
  const { session } = useAuth();
  const deviceId = session?.role === "device" ? session.deviceId : "AIRGUARD_001";
  const { latestMetrics, status, filterHealth } = useAirguardDeviceAnalytics(deviceId);

  const [isPowerOn, setIsPowerOn] = useState(true);
  const [mode, setMode] = useState<OperationMode>("auto");
  const [fanSpeed, setFanSpeed] = useState(3);
  const [scheduleOn, setScheduleOn] = useState(true);
  const [scheduleExpanded, setScheduleExpanded] = useState(false);
  const [startTime, setStartTime] = useState("22:00");
  const [endTime, setEndTime] = useState("06:00");

  const isOnline = status?.online !== false;
  const aqi = latestMetrics.aqi;
  const aqiLabel =
    aqi === undefined ? "—" :
    aqi <= 50 ? "Good" :
    aqi <= 100 ? "Moderate" :
    aqi <= 200 ? "Unhealthy" : "Hazardous";
  const aqiTone =
    aqi === undefined ? "text-muted-foreground" :
    aqi <= 50 ? "text-aqi-good" :
    aqi <= 100 ? "text-aqi-moderate" :
    aqi <= 200 ? "text-aqi-unhealthy" : "text-aqi-hazardous";

  const battery = status?.battery_percent;
  const filterPct = useMemo(() => {
    if (!filterHealth) return undefined;
    const vals = [filterHealth.pre_filter, filterHealth.hepa, filterHealth.carbon].filter(
      (v): v is number => v !== undefined,
    );
    if (vals.length === 0) return undefined;
    return Math.min(...vals);
  }, [filterHealth]);

  const effectiveFanSpeed =
    mode === "auto" ? "Adaptive" :
    mode === "eco" ? FAN_LABELS[Math.min(fanSpeed - 1, 1)] :
    mode === "sleep" ? FAN_LABELS[0] :
    FAN_LABELS[fanSpeed - 1];

  const fanLockReason =
    mode === "auto" ? "Auto mode adjusts fan speed automatically." :
    mode === "eco" ? "Eco mode caps fan at low speeds." :
    mode === "sleep" ? "Sleep mode keeps the fan at minimum." :
    null;

  const handlePowerToggle = () => {
    setIsPowerOn((v) => {
      const next = !v;
      toast.success(next ? "Device powered on" : "Device powered off");
      return next;
    });
  };

  const handleModeChange = (next: OperationMode) => {
    if (next === mode) return;
    setMode(next);
    const meta = MODES.find((m) => m.key === next);
    toast.success(`${meta?.label} mode active`, { description: meta?.description });
  };

  const handleConfirmSchedule = () => {
    toast.success("Schedule saved", { description: `Active ${startTime} – ${endTime} daily` });
    setScheduleExpanded(false);
  };

  const dimmedClass = !isPowerOn ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity";

  return (
    <div className={`${pageStyles.gradientWrapper} ${responsive.pagePadding}`}>
      <ThemeToggle />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={pageHeader.wrapper}
      >
        <h1 className={pageHeader.title}>Device Controls</h1>
        <p className={pageHeader.description}>
          Power, modes, and schedule for your AriGo AirGuard Pro.
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* ─────────────── Hero: Power + live status ─────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card className="border-border/60 shadow-card">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                {/* Big Power button */}
                <button
                  onClick={handlePowerToggle}
                  className={`relative flex h-32 w-32 sm:h-36 sm:w-36 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                    isPowerOn
                      ? "border-primary bg-primary/10 text-primary shadow-glow"
                      : "border-border bg-muted text-muted-foreground"
                  }`}
                  aria-label={isPowerOn ? "Power off" : "Power on"}
                >
                  {isPowerOn && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary"
                      initial={{ scale: 1, opacity: 0.6 }}
                      animate={{ scale: 1.18, opacity: 0 }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}
                  <Power className="h-12 w-12 sm:h-14 sm:w-14" strokeWidth={1.6} />
                </button>

                {/* Live status block */}
                <div className="flex-1 w-full">
                  <div className="flex flex-wrap items-baseline gap-2 mb-2">
                    <span className={`text-xs font-bold uppercase tracking-wider ${isOnline ? "text-primary" : "text-destructive"}`}>
                      {isPowerOn ? (isOnline ? "Online" : "Offline") : "Powered Off"}
                    </span>
                    <span className="text-xs text-muted-foreground">· {deviceId}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                        Current AQI
                      </p>
                      <p className={`text-3xl font-bold ${aqiTone}`}>
                        {aqi !== undefined ? Math.round(aqi) : "—"}
                      </p>
                      <p className={`text-xs ${aqiTone}`}>{aqiLabel}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                        Mode
                      </p>
                      <p className="text-lg font-semibold text-foreground capitalize">{mode}</p>
                      <p className="text-xs text-muted-foreground">Fan: {effectiveFanSpeed}</p>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                        Last update
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {latestMetrics.recordedAt
                          ? new Date(latestMetrics.recordedAt).toLocaleTimeString()
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ─────────────── Mode presets ─────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={dimmedClass}
        >
          <Card className="border-border/60 shadow-card">
            <CardHeader className="border-b border-border/50 py-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                  Operation Mode
                </h2>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {MODES.map((m) => {
                  const isActive = mode === m.key;
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.key}
                      onClick={() => handleModeChange(m.key)}
                      className={`relative text-left rounded-lg border p-4 transition-all ${
                        isActive
                          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                          : "border-border hover:border-border/80 hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                        {isActive && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <p className={`text-sm font-semibold ${isActive ? "text-primary" : "text-foreground"}`}>
                        {m.label}
                      </p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
                        {m.description}
                      </p>
                      <p className="text-[10px] font-mono text-muted-foreground mt-2">
                        {m.fanHint}
                      </p>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ─────────────── Fan speed (Manual only) ─────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={dimmedClass}
        >
          <Card className="border-border/60 shadow-card">
            <CardHeader className="border-b border-border/50 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Fan className={`w-4 h-4 ${fanLockReason ? "text-muted-foreground" : "text-primary"}`} />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                    Fan Speed
                  </h2>
                </div>
                {fanLockReason && (
                  <span className="text-[11px] text-muted-foreground italic">
                    {fanLockReason}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className={`grid grid-cols-5 gap-2 ${fanLockReason ? "opacity-50 pointer-events-none" : ""}`}>
                {FAN_LABELS.map((label, i) => {
                  const speed = i + 1;
                  const isActive = mode === "manual" && fanSpeed === speed;
                  return (
                    <button
                      key={label}
                      onClick={() => setFanSpeed(speed)}
                      className={`flex flex-col items-center gap-1 rounded-lg border py-3 transition-all ${
                        isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-border/80 hover:bg-muted/40"
                      }`}
                    >
                      <span className={`text-lg font-bold ${isActive ? "text-primary-foreground" : "text-foreground"}`}>
                        {speed}
                      </span>
                      <span className={`text-[10px] uppercase tracking-wider ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
              {!fanLockReason && (
                <p className="text-[11px] text-muted-foreground mt-4">
                  Selected: <span className="font-semibold text-foreground">{FAN_LABELS[fanSpeed - 1]}</span> · approx
                  {" "}{20 + fanSpeed * 5} dB
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* ─────────────── Schedule (collapsible) ─────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={dimmedClass}
        >
          <Card className="border-border/60 shadow-card">
            <button
              onClick={() => setScheduleExpanded((v) => !v)}
              className="w-full text-left"
            >
              <CardHeader className="border-b border-border/50 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Calendar className={`w-4 h-4 ${scheduleOn ? "text-primary" : "text-muted-foreground"}`} />
                    <div>
                      <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                        Schedule
                      </h2>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {scheduleOn ? `Active ${startTime} – ${endTime} daily` : "Off"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div onClick={(e) => e.stopPropagation()}>
                      <Switch checked={scheduleOn} onCheckedChange={setScheduleOn} />
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform ${
                        scheduleExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
              </CardHeader>
            </button>
            <AnimatePresence initial={false}>
              {scheduleExpanded && scheduleOn && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <CardContent className="p-6">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="start-time" className="mb-2 block text-foreground text-xs font-semibold uppercase tracking-wider">
                          Start
                        </Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="start-time"
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="end-time" className="mb-2 block text-foreground text-xs font-semibold uppercase tracking-wider">
                          End
                        </Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="end-time"
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 flex justify-end gap-2">
                      <Button variant="ghost" onClick={() => setScheduleExpanded(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleConfirmSchedule}>Save schedule</Button>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        {/* ─────────────── Live device stats (read-only) ─────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Card className="border-border/60 shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Battery className="w-4 h-4 text-muted-foreground" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Battery
                  </p>
                </div>
                {battery !== undefined && (
                  <span className="text-2xl font-bold text-foreground">{Math.round(battery)}%</span>
                )}
              </div>
              {battery !== undefined ? (
                <>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        battery > 60 ? "bg-aqi-good" : battery > 30 ? "bg-aqi-moderate" : "bg-aqi-unhealthy"
                      }`}
                      style={{ width: `${battery}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2">
                    ~{Math.round((battery / 100) * 8)} h runtime · USB-C PD ready
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No battery data yet.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Filter Health
                  </p>
                </div>
                {filterPct !== undefined && (
                  <span className="text-2xl font-bold text-foreground">{Math.round(filterPct)}%</span>
                )}
              </div>
              {filterPct !== undefined ? (
                <>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        filterPct > 50 ? "bg-aqi-good" : filterPct > 20 ? "bg-aqi-moderate" : "bg-aqi-unhealthy"
                      }`}
                      style={{ width: `${filterPct}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2">
                    {filterHealth?.next_service_days !== undefined
                      ? `Replace HEPA in ${filterHealth.next_service_days} days`
                      : "All 3 stages active"}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No filter data yet.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* ─────────────── Status footer ─────────────── */}
        {!isPowerOn && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-4">
            <Activity className="w-4 h-4" />
            Device is off. Tap the power button to resume monitoring.
          </div>
        )}

        {/* ─────────────── Dev simulator (DEV only) ─────────────── */}
        {import.meta.env.DEV && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-warning/30 shadow-card">
              <CardHeader className="border-b border-border/50 py-4">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-warning" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                    Data Simulator
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-warning bg-warning/10 px-2 py-0.5 rounded-full">
                    Dev Only
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground mb-4">
                  Inject randomised sensor readings into Firebase RTDB. Hidden in production builds.
                </p>
                <div className="flex gap-2">
                  <Button onClick={startFluctuation} size="sm">Start data</Button>
                  <Button onClick={stopFluctuation} size="sm" variant="outline">
                    Stop data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Controls;
