import { Battery, BatteryCharging, Zap, Clock } from "lucide-react";
import { useFluctuatingValue } from "@/hooks/useFluctuatingValue";
import { motion } from "framer-motion";

interface FluctuatingBatteryStatusProps {
  basePercentage: number;
  isCharging?: boolean;
}

const FluctuatingBatteryStatus = ({ basePercentage, isCharging = false }: FluctuatingBatteryStatusProps) => {
  const percentage = useFluctuatingValue(basePercentage, 1, 5000);

  // Returns an actual color string based on battery level
  const getBatteryHsl = (percent: number) => {
    if (percent > 60) return "hsl(152, 56%, 40%)";   // green — good
    if (percent > 30) return "hsl(42, 90%, 50%)";     // amber — moderate
    return "hsl(355, 75%, 50%)";                       // red — low
  };

  const getBatteryTextClass = (percent: number) => {
    if (percent > 60) return "text-aqi-good";
    if (percent > 30) return "text-aqi-moderate";
    return "text-aqi-hazardous";
  };

  const estimatedHours = Math.floor((percentage / 100) * 8);
  const estimatedMinutes = Math.floor(((percentage / 100) * 8 % 1) * 60);
  const barColor = getBatteryHsl(percentage);

  return (
    <div className="space-y-5">
      {/* Battery icon + percentage */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="p-2.5 rounded-xl"
            style={{ backgroundColor: `${barColor}20` }}
          >
            {isCharging ? (
              <BatteryCharging className={`w-6 h-6 ${getBatteryTextClass(percentage)}`} />
            ) : (
              <Battery className={`w-6 h-6 ${getBatteryTextClass(percentage)}`} />
            )}
          </motion.div>
          <div>
            <p className={`text-3xl font-bold`} style={{ color: barColor }}>
              {percentage.toFixed(0)}%
            </p>
            <p className="text-xs text-muted-foreground">
              {isCharging ? "Charging" : "On Battery"}
            </p>
          </div>
        </div>
      </div>

      {/* Animated progress bar */}
      <div className="space-y-1.5">
        <div
          className="relative h-4 w-full overflow-hidden rounded-full"
          style={{ backgroundColor: `${barColor}25` }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: barColor }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 border border-border/50">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-[10px] text-muted-foreground">Runtime</p>
            <p className="text-sm font-semibold">{estimatedHours}h {estimatedMinutes}m</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 border border-border/50">
          <Zap className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-[10px] text-muted-foreground">Power Mode</p>
            <p className="text-sm font-semibold">Eco</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FluctuatingBatteryStatus;
