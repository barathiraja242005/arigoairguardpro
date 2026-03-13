import { Card } from "@/components/ui/card";
import { Wind, Factory, Flame, Droplet, Sun } from "lucide-react";

interface Pollutant {
  name: string;
  shortName: string;
  value: number;
  unit: string;
  icon: React.ElementType;
  color: string;
}

const pollutants: Pollutant[] = [
  { name: "Particulate Matter", shortName: "PM2.5", value: 52, unit: "µg/m³", icon: Wind, color: "text-primary" },
  { name: "Particulate Matter", shortName: "PM10", value: 56, unit: "µg/m³", icon: Wind, color: "text-destructive" },
  { name: "Carbon Monoxide", shortName: "CO", value: 1000, unit: "ppb", icon: Factory, color: "text-muted-foreground" },
  { name: "Sulfur Dioxide", shortName: "SO2", value: 5, unit: "ppb", icon: Flame, color: "text-warning" },
  { name: "Nitrogen Dioxide", shortName: "NO2", value: 20, unit: "ppb", icon: Droplet, color: "text-secondary" },
  { name: "Ozone", shortName: "O3", value: 9, unit: "ppb", icon: Sun, color: "text-accent" },
];

export const MajorPollutants = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Major Air Pollutants</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {pollutants.map((pollutant) => {
          const Icon = pollutant.icon;
          return (
            <Card key={pollutant.shortName} className="p-4 text-center hover:shadow-lg transition-shadow">
              <div className="space-y-2">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted ${pollutant.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{pollutant.name}</div>
                  <div className="font-bold text-sm">({pollutant.shortName})</div>
                </div>
                <div className="pt-2 border-t">
                  <div className="text-2xl font-bold">{pollutant.value}</div>
                  <div className="text-xs text-muted-foreground">{pollutant.unit}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
