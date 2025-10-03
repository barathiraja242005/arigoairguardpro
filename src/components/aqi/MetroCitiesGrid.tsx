import { Card } from "@/components/ui/card";
import { Cloud, Thermometer, Droplets } from "lucide-react";

interface CityData {
  name: string;
  aqi: number;
  temp: number;
  humidity: number;
}

const metroCities: CityData[] = [
  { name: "Ahmedabad", aqi: 73, temp: 25, humidity: 83 },
  { name: "Bangalore", aqi: 55, temp: 22, humidity: 94 },
  { name: "Chennai", aqi: 84, temp: 27, humidity: 94 },
  { name: "Hyderabad", aqi: 82, temp: 25, humidity: 79 },
  { name: "Kolkata", aqi: 57, temp: 27, humidity: 94 },
  { name: "Mumbai", aqi: 68, temp: 27, humidity: 84 },
  { name: "New Delhi", aqi: 117, temp: 27, humidity: 89 },
  { name: "Pune", aqi: 64, temp: 23, humidity: 84 },
];

const getAQIColor = (aqi: number) => {
  if (aqi <= 50) return "text-green-500";
  if (aqi <= 100) return "text-yellow-500";
  if (aqi <= 150) return "text-orange-500";
  if (aqi <= 200) return "text-red-500";
  return "text-purple-500";
};

const getAQIBg = (aqi: number) => {
  if (aqi <= 50) return "bg-green-500/10";
  if (aqi <= 100) return "bg-yellow-500/10";
  if (aqi <= 150) return "bg-orange-500/10";
  if (aqi <= 200) return "bg-red-500/10";
  return "bg-purple-500/10";
};

export const MetroCitiesGrid = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">India's Metro Cities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metroCities.map((city) => (
          <Card key={city.name} className="p-4 hover:shadow-lg transition-shadow">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">{city.name}</h3>
                <Cloud className="w-4 h-4 text-muted-foreground" />
              </div>
              
              <div className={`${getAQIBg(city.aqi)} rounded-lg p-3 text-center`}>
                <div className={`text-3xl font-bold ${getAQIColor(city.aqi)}`}>
                  {city.aqi}
                </div>
                <div className="text-xs text-muted-foreground mt-1">AQI</div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                <div className="flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-orange-500" />
                  <span className="text-xs font-medium">{city.temp}°C</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-xs font-medium">{city.humidity}%</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
