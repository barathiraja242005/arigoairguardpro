import { Card } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";

interface YearData {
  year: number;
  aqi: number;
  change?: number;
  trend?: "up" | "down";
}

const historicalData: YearData[] = [
  { year: 2021, aqi: 194 },
  { year: 2022, aqi: 164, change: -15, trend: "down" },
  { year: 2023, aqi: 165, change: 0.6, trend: "up" },
  { year: 2024, aqi: 164, change: -0.6, trend: "down" },
  { year: 2025, aqi: 133, change: -19, trend: "down" },
];

export const HistoricalTrends = () => {
  const overallChange = ((historicalData[historicalData.length - 1].aqi - historicalData[0].aqi) / historicalData[0].aqi * 100).toFixed(0);
  const isImproving = Number(overallChange) < 0;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">AQI Trends - Annual Air Quality Changes</h2>
        <p className="text-muted-foreground">Historical Air Quality Data</p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Annual AQI Trends</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {historicalData.map((data) => (
              <div key={data.year} className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">{data.year}</div>
                <div className="text-3xl font-bold">{data.aqi}</div>
                <div className="text-xs text-muted-foreground">AQI</div>
                {data.change !== undefined && (
                  <div className={`flex items-center gap-1 text-sm ${data.trend === "down" ? "text-success" : "text-destructive"}`}>
                    {data.trend === "down" ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                    <span>{Math.abs(data.change)}% {data.trend === "down" ? "Fall" : "Rise"}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t">
            <div className="text-sm text-muted-foreground mb-2">
              Overall Annual Percentage (%) change of AQI in (2021 to 2025)
            </div>
            <div className={`flex items-center gap-2 text-2xl font-bold ${isImproving ? "text-success" : "text-destructive"}`}>
              {isImproving ? <TrendingDown className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
              <span>{overallChange}%</span>
              <span className="text-sm">{isImproving ? "Fall (Improved AQI)" : "Rise"}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Most Polluted</div>
              <div className="text-lg font-semibold">November, 2023</div>
              <div className="text-2xl font-bold text-destructive">284 AQI</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Least Polluted</div>
              <div className="text-lg font-semibold">August, 2024</div>
              <div className="text-2xl font-bold text-success">77 AQI</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
