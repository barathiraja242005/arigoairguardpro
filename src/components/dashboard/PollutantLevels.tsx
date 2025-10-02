import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Cloud, Droplets, Wind, Flame, AlertCircle } from "lucide-react";

interface Pollutant {
  name: string;
  symbol: string;
  value: number;
  unit: string;
  limit: number;
  icon: any;
}

const PollutantLevels = () => {
  const pollutants: Pollutant[] = [
    { name: "Carbon Dioxide", symbol: "CO₂", value: 420, unit: "ppm", limit: 1000, icon: Cloud },
    { name: "Carbon Monoxide", symbol: "CO", value: 2.5, unit: "ppm", limit: 9, icon: Flame },
    { name: "Sulfur Dioxide", symbol: "SO₂", value: 8, unit: "μg/m³", limit: 75, icon: Droplets },
    { name: "Nitrogen Dioxide", symbol: "NO₂", value: 15, unit: "μg/m³", limit: 100, icon: Wind },
    { name: "Ozone", symbol: "O₃", value: 45, unit: "μg/m³", limit: 100, icon: Cloud },
    { name: "VOCs", symbol: "VOCs", value: 180, unit: "ppb", limit: 500, icon: AlertCircle },
  ];

  const getStatusColor = (value: number, limit: number) => {
    const percentage = (value / limit) * 100;
    if (percentage < 50) return "text-aqi-good";
    if (percentage < 80) return "text-aqi-moderate";
    return "text-aqi-hazardous";
  };

  const getStatusBg = (value: number, limit: number) => {
    const percentage = (value / limit) * 100;
    if (percentage < 50) return "bg-aqi-good/10 border-aqi-good/30";
    if (percentage < 80) return "bg-aqi-moderate/10 border-aqi-moderate/30";
    return "bg-aqi-hazardous/10 border-aqi-hazardous/30";
  };

  const getPercentage = (value: number, limit: number) => {
    return Math.min((value / limit) * 100, 100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {pollutants.map((pollutant, index) => {
        const Icon = pollutant.icon;
        const percentage = getPercentage(pollutant.value, pollutant.limit);
        
        return (
          <motion.div
            key={pollutant.symbol}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`p-4 border ${getStatusBg(pollutant.value, pollutant.limit)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg bg-card ${getStatusColor(pollutant.value, pollutant.limit)}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{pollutant.symbol}</h4>
                    <p className="text-xs text-muted-foreground">{pollutant.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getStatusColor(pollutant.value, pollutant.limit)}`}>
                    {pollutant.value}
                  </div>
                  <div className="text-xs text-muted-foreground">{pollutant.unit}</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`absolute inset-y-0 left-0 rounded-full ${
                    percentage < 50
                      ? "bg-aqi-good"
                      : percentage < 80
                      ? "bg-aqi-moderate"
                      : "bg-aqi-hazardous"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                />
              </div>
              
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>Current</span>
                <span>Limit: {pollutant.limit} {pollutant.unit}</span>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default PollutantLevels;
