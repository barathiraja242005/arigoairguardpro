import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Activity, Download, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const Admin = () => {
  const aqiTrendData = [
    { time: "00:00", aqi: 45 },
    { time: "04:00", aqi: 52 },
    { time: "08:00", aqi: 78 },
    { time: "12:00", aqi: 95 },
    { time: "16:00", aqi: 68 },
    { time: "20:00", aqi: 55 },
  ];

  const deviceUsageData = [
    { device: "Living Room", usage: 89 },
    { device: "Bedroom", usage: 75 },
    { device: "Office", usage: 92 },
  ];

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Devices", value: "3", icon: Users, change: "+2 this month" },
          { label: "Avg AQI", value: "65", icon: Activity, change: "-5 vs last week" },
          { label: "Active Users", value: "12", icon: TrendingUp, change: "+3 today" },
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">AQI Trend (24h)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={aqiTrendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="aqi"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Device Usage</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deviceUsageData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="device" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="usage"
                  fill="hsl(var(--secondary))"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Device List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">All Devices</h2>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4">Device ID</th>
                  <th className="text-left p-4">Location</th>
                  <th className="text-left p-4">AQI</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Last Update</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: "AG-PRO-12345", location: "Living Room", aqi: 45, status: "Active" },
                  { id: "AG-PRO-12346", location: "Bedroom", aqi: 62, status: "Active" },
                  { id: "AG-PRO-12347", location: "Office", aqi: 38, status: "Active" },
                ].map((device, index) => (
                  <motion.tr
                    key={device.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="p-4 font-mono text-sm">{device.id}</td>
                    <td className="p-4">{device.location}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          device.aqi <= 50
                            ? "bg-aqi-good/20 text-aqi-good"
                            : "bg-aqi-moderate/20 text-aqi-moderate"
                        }`}
                      >
                        {device.aqi}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                        {device.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date().toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Admin;
