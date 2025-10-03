import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle } from "lucide-react";

const PollutantChart = () => {
  const data = [
    { name: "PM1.0", value: 12, limit: 35 },
    { name: "PM2.5", value: 28, limit: 35 },
    { name: "PM10", value: 45, limit: 150 },
    { name: "CO₂", value: 420, limit: 1000 },
    { name: "SO₂", value: 8, limit: 75 },
    { name: "NO₂", value: 15, limit: 100 },
    { name: "VOCs", value: 180, limit: 500 },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 rounded-lg shadow-elevated border border-border">
          <p className="font-semibold">{payload[0].payload.name}</p>
          <p className="text-sm text-primary">
            Current: {payload[0].value} μg/m³
          </p>
          <p className="text-sm text-muted-foreground">
            Limit: {payload[0].payload.limit} μg/m³
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-80"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
            label={{ value: 'μg/m³', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="value"
            fill="hsl(var(--primary))"
            radius={[8, 8, 0, 0]}
            name="Current Level"
            animationDuration={1000}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
          <div>
            <p className="font-semibold text-lg">Within Safe Limits</p>
            <p className="text-sm text-muted-foreground">5 of 7 pollutants</p>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center gap-4">
          <AlertTriangle className="w-8 h-8 text-yellow-500" />
          <div>
            <p className="font-semibold text-lg">Needs Attention</p>
            <p className="text-sm text-muted-foreground">2 pollutants</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PollutantChart;
