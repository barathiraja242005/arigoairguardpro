import { Card } from "@/components/ui/card";
import { useFluctuatingValue } from "@/hooks/useFluctuatingValue";

const FluctuatingPollutantLevels = () => {
  const pm25 = useFluctuatingValue(28, 3);
  const pm10 = useFluctuatingValue(42, 4);
  const co2 = useFluctuatingValue(450, 20);
  const voc = useFluctuatingValue(85, 10);

  const pollutants = [
    {
      name: "PM2.5",
      value: pm25,
      unit: "µg/m³",
      max: 50,
      color: "bg-primary",
      trackColor: "bg-border",
    },
    {
      name: "PM10",
      value: pm10,
      unit: "µg/m³",
      max: 100,
      color: "bg-secondary",
      trackColor: "bg-border",
    },
    {
      name: "CO₂",
      value: co2,
      unit: "ppm",
      max: 1000,
      color: "bg-accent",
      trackColor: "bg-border",
    },
    {
      name: "VOC",
      value: voc,
      unit: "ppb",
      max: 200,
      color: "bg-warning",
      trackColor: "bg-border",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {pollutants.map((pollutant) => (
        <Card key={pollutant.name} className="p-4 border-border/50 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">{pollutant.name}</h3>
            <span className="text-xs text-muted-foreground">
              {pollutant.unit}
            </span>
          </div>
          <p className="text-2xl font-bold mb-3">{pollutant.value.toFixed(1)}</p>
          <div className={`relative h-2 w-full overflow-hidden rounded-full ${pollutant.trackColor}`}>
            <div
              className={`h-full rounded-full ${pollutant.color} transition-all duration-700 ease-out`}
              style={{ width: `${Math.min((pollutant.value / pollutant.max) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Max: {pollutant.max} {pollutant.unit}
          </p>
        </Card>
      ))}
    </div>
  );
};

export default FluctuatingPollutantLevels;
