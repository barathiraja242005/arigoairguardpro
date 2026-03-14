import { Card } from "@/components/ui/card";
import { useFluctuatingValue } from "@/hooks/useFluctuatingValue";

type LiveValues = {
  aqi?: number;
  dustDensity?: number;
  coPpm?: number;
  no2Ppm?: number;
};

const FluctuatingPollutantLevels = (props: { values?: LiveValues }) => {
  const fallbackAqi = useFluctuatingValue(65, 5);
  const fallbackDust = useFluctuatingValue(28, 3);
  const fallbackCo = useFluctuatingValue(2.5, 0.3);
  const fallbackNo2 = useFluctuatingValue(15, 2);

  const aqi = props.values?.aqi ?? fallbackAqi;
  const dustDensity = props.values?.dustDensity ?? fallbackDust;
  const coPpm = props.values?.coPpm ?? fallbackCo;
  const no2Ppm = props.values?.no2Ppm ?? fallbackNo2;

  const pollutants = [
    {
      name: "AQI",
      value: aqi,
      unit: "",
      max: 200,
      color: "bg-primary",
      trackColor: "bg-border",
    },
    {
      name: "PM2.5 (Dust)",
      value: dustDensity,
      unit: "µg/m³",
      max: 200,
      color: "bg-secondary",
      trackColor: "bg-border",
    },
    {
      name: "CO",
      value: coPpm,
      unit: "ppm",
      max: 9,
      color: "bg-accent",
      trackColor: "bg-border",
    },
    {
      name: "NO₂",
      value: no2Ppm,
      unit: "ppm",
      max: 100,
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
