import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Download, TrendingUp, Filter } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";

const Admin = () => {
  const [timeRange, setTimeRange] = useState<"day" | "month" | "year">("day");

  const dayData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    pm25: Math.floor(Math.random() * 40 + 20),
    pm10: Math.floor(Math.random() * 50 + 30),
    co2: Math.floor(Math.random() * 200 + 400),
    voc: Math.floor(Math.random() * 100 + 50),
  }));

  const monthData = Array.from({ length: 30 }, (_, i) => ({
    time: `Day ${i + 1}`,
    pm25: Math.floor(Math.random() * 40 + 20),
    pm10: Math.floor(Math.random() * 50 + 30),
    co2: Math.floor(Math.random() * 200 + 400),
    voc: Math.floor(Math.random() * 100 + 50),
  }));

  const yearData = Array.from({ length: 12 }, (_, i) => ({
    time: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    pm25: Math.floor(Math.random() * 40 + 20),
    pm10: Math.floor(Math.random() * 50 + 30),
    co2: Math.floor(Math.random() * 200 + 400),
    voc: Math.floor(Math.random() * 100 + 50),
  }));

  const getDataForRange = () => {
    switch (timeRange) {
      case "day":
        return dayData;
      case "month":
        return monthData;
      case "year":
        return yearData;
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">
          Multi-device management and analytics
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Avg PM2.5", value: "28 µg/m³", icon: Activity, change: "-12% vs last week" },
          { label: "Total Filtered", value: "2.4 kg", icon: Filter, change: "Last 30 days" },
          { label: "Fertilizer Generated", value: "14.2g", icon: Download, change: "Last 30 days" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/20">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pollution Filtering History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Pollution Filtering History</h2>
            <Button variant="outline" onClick={() => {}}>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
          
          <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as any)} className="mb-4">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-6">
            {/* PM2.5 Chart */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                PM2.5 Levels
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={getDataForRange()}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pm25"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* PM10 Chart */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                PM10 Levels
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={getDataForRange()}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pm10"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* CO2 & VOC Chart */}
            <div>
              <h3 className="text-sm font-medium mb-3">CO2 & VOC Levels</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={getDataForRange()}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="co2"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    dot={false}
                    name="CO2"
                  />
                  <Line
                    type="monotone"
                    dataKey="voc"
                    stroke="hsl(var(--warning))"
                    strokeWidth={2}
                    dot={false}
                    name="VOC"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Admin;
