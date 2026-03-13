import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import AQIGauge from "@/components/dashboard/AQIGauge";
import FilterHealth from "@/components/dashboard/FilterHealth";
import FluctuatingBatteryStatus from "@/components/dashboard/FluctuatingBatteryStatus";
import PollutantChart from "@/components/dashboard/PollutantChart";
import FluctuatingPollutantLevels from "@/components/dashboard/FluctuatingPollutantLevels";
import ByproductStats from "@/components/dashboard/ByproductStats";
import { Wind, Droplets, Leaf, Zap, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
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
    { icon: Wind, label: "Air Flow", value: "250 m³/h", color: "text-primary" },
    { icon: Droplets, label: "Humidity", value: "45%", color: "text-secondary" },
    { icon: Leaf, label: "Efficiency", value: "99.7%", color: "text-earth-olive" },
    { icon: Zap, label: "Power", value: "12W", color: "text-warning" },
  ];

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
            Real-time air quality monitoring and device status
          </p>
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
          <FluctuatingPollutantLevels />
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
              <AQIGauge value={65} />
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

          {/* Pollutant Chart - Full width */}
          <motion.div variants={cardVariants} className="lg:col-span-2">
            <Card className={`${cardStyles.padding} ${cardStyles.base} shadow-card`}>
              <h2 className={`${typography.cardTitle} mb-6`}>Pollutant Composition</h2>
              <PollutantChart />
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
