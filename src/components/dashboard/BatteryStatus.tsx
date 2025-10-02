import { motion } from "framer-motion";
import { Battery, BatteryCharging } from "lucide-react";

interface BatteryStatusProps {
  percentage: number;
  isCharging?: boolean;
}

const BatteryStatus = ({ percentage, isCharging = false }: BatteryStatusProps) => {
  const getBatteryColor = (level: number) => {
    if (level > 60) return "bg-aqi-good";
    if (level > 30) return "bg-aqi-moderate";
    return "bg-aqi-hazardous";
  };

  const getBatteryTextColor = (level: number) => {
    if (level > 60) return "text-aqi-good";
    if (level > 30) return "text-aqi-moderate";
    return "text-aqi-hazardous";
  };

  return (
    <div className="space-y-6">
      {/* Battery Icon and Percentage */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isCharging ? (
            <BatteryCharging className={`w-8 h-8 ${getBatteryTextColor(percentage)}`} />
          ) : (
            <Battery className={`w-8 h-8 ${getBatteryTextColor(percentage)}`} />
          )}
          <div>
            <div className={`text-3xl font-bold ${getBatteryTextColor(percentage)}`}>
              {percentage}%
            </div>
            <div className="text-sm text-muted-foreground">
              {isCharging ? "Charging" : "Battery Level"}
            </div>
          </div>
        </div>
      </div>

      {/* Battery Bar */}
      <div className="relative h-12 bg-muted rounded-lg overflow-hidden border-2 border-border">
        <motion.div
          className={`absolute inset-y-0 left-0 ${getBatteryColor(percentage)}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold mix-blend-difference text-white">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Runtime Information */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-2"
      >
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Estimated Runtime:</span>
          <span className="font-semibold">~6.5 hours</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Power Mode:</span>
          <span className="font-semibold">Auto</span>
        </div>
      </motion.div>
    </div>
  );
};

export default BatteryStatus;
