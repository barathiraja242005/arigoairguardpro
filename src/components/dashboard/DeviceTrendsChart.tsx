import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface DeviceTrendPoint {
  time: string;
  aqi?: number;
  dustDensity?: number;
}

function formatTimeLabel(value: string): string {
  // Expect HH:mm:ss; show HH:mm
  if (!value) return "";
  return value.slice(0, 5);
}

export default function DeviceTrendsChart(props: {
  data: DeviceTrendPoint[];
}) {
  const { data } = props;

  if (!data.length) {
    return (
      <div className="h-80 flex items-center justify-center text-sm text-muted-foreground">
        No history yet for today.
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
            tickFormatter={formatTimeLabel}
            interval="preserveStartEnd"
          />
          <YAxis
            yAxisId="aqi"
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
            domain={[0, 200]}
          />
          <YAxis
            yAxisId="dust"
            orientation="right"
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
            domain={[0, 200]}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const aqi = payload.find((p) => p.dataKey === "aqi")?.value;
              const dust = payload.find((p) => p.dataKey === "dustDensity")?.value;
              return (
                <div className="bg-card p-3 rounded-lg shadow-elevated border border-border">
                  <p className="font-semibold">{label}</p>
                  <p className="text-sm text-primary">AQI: {aqi ?? "—"}</p>
                  <p className="text-sm text-muted-foreground">PM2.5: {dust ?? "—"}</p>
                </div>
              );
            }}
          />
          <Legend />
          <Line
            yAxisId="aqi"
            type="monotone"
            dataKey="aqi"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            name="AQI"
            connectNulls
          />
          <Line
            yAxisId="dust"
            type="monotone"
            dataKey="dustDensity"
            stroke="hsl(var(--warning))"
            strokeWidth={2}
            dot={false}
            name="PM2.5 (dust)"
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
