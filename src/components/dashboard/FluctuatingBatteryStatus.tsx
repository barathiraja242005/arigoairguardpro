import { Battery, BatteryCharging } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useFluctuatingValue } from "@/hooks/useFluctuatingValue";

interface FluctuatingBatteryStatusProps {
  basePercentage: number;
  isCharging?: boolean;
}

const FluctuatingBatteryStatus = ({ basePercentage, isCharging = false }: FluctuatingBatteryStatusProps) => {
  const percentage = useFluctuatingValue(basePercentage, 1, 5000);

  const getBatteryColor = (percent: number) => {
    if (percent > 60) return "text-aqi-good";
    if (percent > 30) return "text-aqi-moderate";
    return "text-aqi-hazardous";
  };

  const getBatteryBarColor = (percent: number) => {
    if (percent > 60) return "bg-aqi-good";
    if (percent > 30) return "bg-aqi-moderate";
    return "bg-aqi-hazardous";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isCharging ? (
            <BatteryCharging className={`w-8 h-8 ${getBatteryColor(percentage)}`} />
          ) : (
            <Battery className={`w-8 h-8 ${getBatteryColor(percentage)}`} />
          )}
          <div>
            <p className="text-3xl font-bold">{percentage.toFixed(0)}%</p>
            <p className="text-sm text-muted-foreground">
              {isCharging ? "Charging" : "On Battery"}
            </p>
          </div>
        </div>
      </div>

      <Progress value={percentage} className={`h-3 ${getBatteryBarColor(percentage)}`} />

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div>
          <p className="text-xs text-muted-foreground">Estimated Runtime</p>
          <p className="text-sm font-semibold">{Math.floor((percentage / 100) * 8)}h {Math.floor(((percentage / 100) * 8 % 1) * 60)}m</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Power Mode</p>
          <p className="text-sm font-semibold">Eco</p>
        </div>
      </div>
    </div>
  );
};

export default FluctuatingBatteryStatus;
