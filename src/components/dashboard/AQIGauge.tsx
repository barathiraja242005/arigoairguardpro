import { motion } from "framer-motion";

interface AQIGaugeProps {
  value: number;
}

const AQIGauge = ({ value }: AQIGaugeProps) => {
  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "text-aqi-good";
    if (aqi <= 100) return "text-aqi-moderate";
    if (aqi <= 150) return "text-aqi-unhealthy";
    return "text-aqi-hazardous";
  };

  const getAQILabel = (aqi: number) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    return "Unhealthy";
  };

  const getAQIGradient = (aqi: number) => {
    if (aqi <= 50) return "bg-gradient-aqi-good";
    if (aqi <= 100) return "bg-gradient-aqi-moderate";
    return "bg-gradient-aqi-poor";
  };

  const circumference = 2 * Math.PI * 120;
  const progress = (value / 200) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Circular Gauge */}
      <div className="relative w-64 h-64 mb-6">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="16"
            fill="none"
            className="text-muted"
          />
          {/* Progress circle */}
          <motion.circle
            cx="128"
            cy="128"
            r="120"
            stroke="url(#aqiGradient)"
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.5 }}
          />
          <defs>
            <linearGradient id="aqiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              {value <= 50 ? (
                <>
                  <stop offset="0%" stopColor="hsl(122, 39%, 49%)" />
                  <stop offset="100%" stopColor="hsl(88, 50%, 60%)" />
                </>
              ) : value <= 100 ? (
                <>
                  <stop offset="0%" stopColor="hsl(54, 100%, 62%)" />
                  <stop offset="100%" stopColor="hsl(32, 100%, 50%)" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="hsl(32, 100%, 50%)" />
                  <stop offset="100%" stopColor="hsl(4, 90%, 58%)" />
                </>
              )}
            </linearGradient>
          </defs>
        </svg>

        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="text-center"
          >
            <div className={`text-5xl font-bold ${getAQIColor(value)}`}>
              {value}
            </div>
            <div className="text-sm text-muted-foreground mt-1">AQI</div>
          </motion.div>
        </div>
      </div>

      {/* Status Label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className={`px-6 py-3 rounded-full ${getAQIGradient(value)} text-white font-semibold shadow-lg`}
      >
        {getAQILabel(value)}
      </motion.div>

      {/* Legend */}
      <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-md">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-aqi-good" />
          <span className="text-sm">0-50 Good</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-aqi-moderate" />
          <span className="text-sm">51-100 Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-aqi-unhealthy" />
          <span className="text-sm">101-150 Unhealthy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-aqi-hazardous" />
          <span className="text-sm">151+ Hazardous</span>
        </div>
      </div>
    </div>
  );
};

export default AQIGauge;
