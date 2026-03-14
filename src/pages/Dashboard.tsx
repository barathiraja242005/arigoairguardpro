import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import AQIGauge from "@/components/dashboard/AQIGauge";
import FilterHealth from "@/components/dashboard/FilterHealth";
import FluctuatingBatteryStatus from "@/components/dashboard/FluctuatingBatteryStatus";
import FluctuatingPollutantLevels from "@/components/dashboard/FluctuatingPollutantLevels";
import ByproductStats from "@/components/dashboard/ByproductStats";
import DeviceTrendsChart from "@/components/dashboard/DeviceTrendsChart";
import { MapPin, ShieldCheck, Thermometer, Droplets, Wind, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useAirguardDeviceAnalytics } from "@/hooks/useAirguardDeviceAnalytics";
import {
  pageStyles,
  pageHeader,
  cardStyles,
  darkModeToggle,
  gridStyles,
  typography,
  containerVariants,
  cardVariants,
} from "@/lib/design-system";

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);

  const deviceId = localStorage.getItem("deviceId") || "AIRGUARD_001";
  const { loading, error, latestMetrics, status, location, todayHistory, todayKey } =
    useAirguardDeviceAnalytics(deviceId);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    const isDarkMode = savedMode === "true";
    setDarkMode(isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const stats = [
    {
      icon: ShieldCheck,
      label: "Device",
      value: deviceId,
      color: "text-primary",
    },
    {
      icon: Thermometer,
      label: "Temperature",
      value: latestMetrics.temperature !== undefined ? `${latestMetrics.temperature.toFixed(1)}°C` : "—",
      color: "text-secondary",
    },
    {
      icon: Droplets,
      label: "Humidity",
      value: latestMetrics.humidity !== undefined ? `${latestMetrics.humidity.toFixed(0)}%` : "—",
      color: "text-earth-olive",
    },
    {
      icon: Wind,
      label: "Status",
      value: status?.online === false ? "Offline" : "Online",
      color: status?.online === false ? "text-destructive" : "text-success",
    },
  ];

  const trendData = todayHistory.map((p) => ({
    time: p.timeKey,
    aqi: p.aqi,
    dustDensity: p.dustDensity,
  }));

  return (
    <div className={pageStyles.wrapper}>
      <div className={darkModeToggle.wrapper}>
        <button
          onClick={() => {
            const newDarkMode = !darkMode;
            setDarkMode(newDarkMode);
            localStorage.setItem("darkMode", newDarkMode.toString());
            if (newDarkMode) {
              document.documentElement.classList.add("dark");
            } else {
              document.documentElement.classList.remove("dark");
            }
          }}
          className={darkModeToggle.button}
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className={darkModeToggle.iconClass} />
          ) : (
            <Moon className={darkModeToggle.iconClass} />
          )}
        </button>
      </div>
      <div className={pageStyles.container}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${pageHeader.wrapper} mt-12`}
        >
          <h1 className={pageHeader.title}>Dashboard</h1>
          <p className={pageHeader.description}>
            Your personal pollution trends from Firebase
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Device: {deviceId}</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="w-4 h-4 text-secondary" />
              <span>
                Location: {location?.lat !== undefined && location?.lng !== undefined ? `${location.lat}, ${location.lng}` : "—"}
              </span>
            </span>
            <span>
              Last update: {latestMetrics.recordedAt ? new Date(latestMetrics.recordedAt).toLocaleString() : "—"}
            </span>
          </div>
          {error ? (
            <div className="mt-3 text-sm text-destructive">{error}</div>
          ) : null}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`${gridStyles.stats} mb-8`}
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={cardVariants}>
              <Card className={`${cardStyles.paddingSm} ${cardStyles.interactive}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-gradient-glass border border-border/50 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-lg font-semibold">{stat.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Pollutant Levels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className={typography.sectionTitle}>Pollutant Levels</h2>
          <FluctuatingPollutantLevels
            values={{
              aqi: latestMetrics.aqi,
              dustDensity: latestMetrics.dustDensity,
              coPpm: latestMetrics.coPpm,
              no2Ppm: latestMetrics.no2Ppm,
            }}
          />
        </motion.div>

        {/* Main Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={gridStyles.dashboard}
        >
          {/* AQI Gauge - Takes 2 columns on large screens */}
          <motion.div variants={cardVariants} className="lg:col-span-2">
            <Card className={`${cardStyles.padding} h-full ${cardStyles.base} shadow-card`}>
              <h2 className={`${typography.cardTitle} mb-6 bg-gradient-hero bg-clip-text text-transparent`}>Air Quality Index</h2>
              <AQIGauge value={latestMetrics.aqi ?? 0} />
              {loading && !latestMetrics.recordedAt ? (
                <div className="mt-4 text-sm text-muted-foreground">Waiting for device data…</div>
              ) : null}
            </Card>
          </motion.div>

          {/* Battery and Filter Health */}
          <motion.div variants={cardVariants} className="space-y-6">
            <Card className={`${cardStyles.padding} ${cardStyles.base} shadow-card`}>
              <h2 className={`${typography.cardTitle} mb-4`}>Battery Status</h2>
              <FluctuatingBatteryStatus basePercentage={78} />
            </Card>
            <Card className={`${cardStyles.padding} ${cardStyles.base} shadow-card`}>
              <h2 className={`${typography.cardTitle} mb-4`}>Filter Health</h2>
              <FilterHealth
                preFilter={85}
                hepa={72}
                carbon={68}
              />
            </Card>
          </motion.div>

          {/* Trends - Full width */}
          <motion.div variants={cardVariants} className="lg:col-span-2">
            <Card className={`${cardStyles.padding} ${cardStyles.base} shadow-card`}>
              <h2 className={`${typography.cardTitle} mb-1`}>Today’s Pollution Trends</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Trend for {todayKey} (AQI and PM2.5 from your device history)
              </p>
              <DeviceTrendsChart data={trendData} />
            </Card>
          </motion.div>

          {/* Byproduct Stats */}
          <motion.div variants={cardVariants}>
            <Card className={`${cardStyles.padding} ${cardStyles.base} shadow-card`}>
              <h2 className={`${typography.cardTitle} mb-4`}>Byproduct Conversion</h2>
              <ByproductStats />
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
