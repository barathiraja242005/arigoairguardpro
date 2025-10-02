import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import AQIGauge from "@/components/dashboard/AQIGauge";
import FilterHealth from "@/components/dashboard/FilterHealth";
import BatteryStatus from "@/components/dashboard/BatteryStatus";
import PollutantChart from "@/components/dashboard/PollutantChart";
import PollutantLevels from "@/components/dashboard/PollutantLevels";
import ByproductStats from "@/components/dashboard/ByproductStats";
import { Wind, Droplets, Leaf, Zap } from "lucide-react";

const Dashboard = () => {
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
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
              <Card className="p-4 hover:shadow-card transition-shadow">
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
          <PollutantLevels />
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
            <Card className="p-6 h-full">
              <h2 className="text-xl font-semibold mb-6">Air Quality Index</h2>
              <AQIGauge value={65} />
            </Card>
          </motion.div>

          {/* Battery and Filter Health */}
          <motion.div variants={cardVariants} className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Battery Status</h2>
              <BatteryStatus percentage={78} />
            </Card>
            <Card className="p-6">
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
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Pollutant Composition</h2>
              <PollutantChart />
            </Card>
          </motion.div>

          {/* Byproduct Stats */}
          <motion.div variants={cardVariants}>
            <Card className="p-6">
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
