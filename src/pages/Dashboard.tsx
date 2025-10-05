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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const stats = [
    { icon: Wind, label: "Air Flow", value: "250 m³/h", color: "text-primary" },
    { icon: Droplets, label: "Humidity", value: "45%", color: "text-secondary" },
    { icon: Leaf, label: "Efficiency", value: "99.7%", color: "text-earth-olive" },
    { icon: Zap, label: "Power", value: "12W", color: "text-warning" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-4 right-4">
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
          className="p-2 rounded-full border border-border bg-card hover:bg-accent transition-colors"
        >
          {darkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
      </div>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 mt-12"
        >
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time air quality monitoring and device status
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={cardVariants}>
              <Card className="p-4 hover:shadow-card transition-shadow bg-card">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
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
          <h2 className="text-2xl font-semibold mb-4">Pollutant Levels</h2>
          <FluctuatingPollutantLevels />
        </motion.div>

        {/* Main Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* AQI Gauge - Takes 2 columns on large screens */}
          <motion.div variants={cardVariants} className="lg:col-span-2">
            <Card className="p-6 h-full bg-card">
              <h2 className="text-xl font-semibold mb-6">Air Quality Index</h2>
              <AQIGauge value={65} />
            </Card>
          </motion.div>

          {/* Battery and Filter Health */}
          <motion.div variants={cardVariants} className="space-y-6">
            <Card className="p-6 bg-card">
              <h2 className="text-xl font-semibold mb-4">Battery Status</h2>
              <FluctuatingBatteryStatus basePercentage={78} />
            </Card>
            <Card className="p-6 bg-card">
              <h2 className="text-xl font-semibold mb-4">Filter Health</h2>
              <FilterHealth
                preFilter={85}
                hepa={72}
                carbon={68}
              />
            </Card>
          </motion.div>

          {/* Pollutant Chart - Full width */}
          <motion.div variants={cardVariants} className="lg:col-span-2">
            <Card className="p-6 bg-card">
              <h2 className="text-xl font-semibold mb-6">Pollutant Composition</h2>
              <PollutantChart />
            </Card>
          </motion.div>

          {/* Byproduct Stats */}
          <motion.div variants={cardVariants}>
            <Card className="p-6 bg-card">
              <h2 className="text-xl font-semibold mb-4">Byproduct Conversion</h2>
              <ByproductStats />
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
