import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Download } from "lucide-react";

// Dummy data for different time ranges
const dailyData = [
  { date: "2024-07-20", aqi: 58 },
  { date: "2024-07-21", aqi: 62 },
  { date: "2024-07-22", aqi: 55 },
  { date: "2024-07-23", aqi: 70 },
  { date: "2024-07-24", aqi: 68 },
  { date: "2024-07-25", aqi: 63 },
  { date: "2024-07-26", aqi: 75 },
];

const monthlyData = [
  { date: "2024-01", aqi: 80 },
  { date: "2024-02", aqi: 75 },
  { date: "2024-03", aqi: 70 },
  { date: "2024-04", aqi: 65 },
  { date: "2024-05", aqi: 60 },
  { date: "2024-06", aqi: 55 },
  { date: "2024-07", aqi: 62 },
];

const yearlyData = [
  { date: "2020", aqi: 90 },
  { date: "2021", aqi: 85 },
  { date: "2022", aqi: 78 },
  { date: "2023", aqi: 72 },
  { date: "2024", aqi: 68 },
];

const chartConfig = {
  aqi: {
    label: "AQI",
    color: "hsl(var(--primary))",
  },
};

type TimeRange = "day" | "month" | "year";

const AqiTrends = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("day");

  const dataMap = {
    day: dailyData,
    month: monthlyData,
    year: yearlyData,
  };

  const chartData = dataMap[timeRange];

  const handleDownloadReport = () => {
    const dataToExport = chartData;
    const headers = ["Date", "AQI"];
    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n";

    dataToExport.forEach(row => {
        let rowData = [row.date, row.aqi];
        csvContent += rowData.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aqi_report_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatXAxis = (value: string) => {
    switch (timeRange) {
      case "day":
        return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case "month":
        const date = new Date(value);
        return date.toLocaleDateString('en-US', { month: 'short' });
      case "year":
      default:
        return value;
    }
  };


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Overall AQI Trends</CardTitle>
        <div className="flex items-center space-x-2">
            <Button variant={timeRange === 'day' ? 'default' : 'outline'} size="sm" onClick={() => setTimeRange('day')}>Day</Button>
            <Button variant={timeRange === 'month' ? 'default' : 'outline'} size="sm" onClick={() => setTimeRange('month')}>Month</Button>
            <Button variant={timeRange === 'year' ? 'default' : 'outline'} size="sm" onClick={() => setTimeRange('year')}>Year</Button>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatXAxis}
            />
            <YAxis />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="aqi"
              type="monotone"
              stroke="var(--color-aqi)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
        <div className="flex justify-end pt-4">
            <Button variant="outline" size="sm" onClick={handleDownloadReport}>
                <Download className="mr-2 h-4 w-4" />
                Download Report
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AqiTrends;
