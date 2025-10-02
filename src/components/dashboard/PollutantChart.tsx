import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";

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

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-3 rounded-lg bg-aqi-good/10 border border-aqi-good/20">
          <div className="text-xs text-muted-foreground mb-1">Within Safe Limits</div>
          <div className="text-sm font-semibold">5 of 7 pollutants</div>
        </div>
        <div className="p-3 rounded-lg bg-aqi-moderate/10 border border-aqi-moderate/20">
          <div className="text-xs text-muted-foreground mb-1">Needs Attention</div>
          <div className="text-sm font-semibold">2 pollutants</div>
        </div>
      </div>
    </motion.div>
  );
};

export default PollutantChart;
