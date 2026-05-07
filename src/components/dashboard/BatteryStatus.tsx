import { motion } from "framer-motion";
import { Battery, BatteryCharging } from "lucide-react";

interface BatteryStatusProps {
  percentage?: number;
  isCharging?: boolean;
  estimatedRuntime?: string;
  powerMode?: string;
}

const BatteryStatus = ({ percentage, isCharging = false, estimatedRuntime, powerMode }: BatteryStatusProps) => {
  if (percentage === undefined) {
    return (
      <p className="text-sm text-muted-foreground">
        No battery data reported by device yet.
      </p>
    );
  }

  const level = Math.max(0, Math.min(100, Math.round(percentage)));

  const getBatteryColor = (l: number) => {
    if (l > 60) return "bg-aqi-good";
    if (l > 30) return "bg-aqi-moderate";
    return "bg-aqi-hazardous";
  };

  const getBatteryTextColor = (l: number) => {
    if (l > 60) return "text-aqi-good";
    if (l > 30) return "text-aqi-moderate";
    return "text-aqi-hazardous";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isCharging ? (
            <BatteryCharging className={`w-8 h-8 ${getBatteryTextColor(level)}`} />
          ) : (
            <Battery className={`w-8 h-8 ${getBatteryTextColor(level)}`} />
          )}
          <div>
            <div className={`text-3xl font-bold ${getBatteryTextColor(level)}`}>
              {level}%
            </div>
            <div className="text-sm text-muted-foreground">
              {isCharging ? "Charging" : "Battery Level"}
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-12 bg-muted rounded-lg overflow-hidden border-2 border-border">
        <motion.div
          className={`absolute inset-y-0 left-0 ${getBatteryColor(level)}`}
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold mix-blend-difference text-white">
            {level}%
          </span>
        </div>
      </div>

      {(estimatedRuntime || powerMode) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-2"
        >
          {estimatedRuntime && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated Runtime:</span>
              <span className="font-semibold">{estimatedRuntime}</span>
            </div>
          )}
          {powerMode && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Power Mode:</span>
              <span className="font-semibold">{powerMode}</span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default BatteryStatus;
