import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface CityRanking {
  rank: number;
  city: string;
  aqi: number;
  status: string;
  standardMultiple: number;
}

const cityRankings: CityRanking[] = [
  { rank: 1, city: "Siwani, India", aqi: 336, status: "Hazardous", standardMultiple: 22 },
  { rank: 2, city: "Churu, India", aqi: 198, status: "Unhealthy", standardMultiple: 13 },
  { rank: 3, city: "Ganganagar, India", aqi: 188, status: "Unhealthy", standardMultiple: 13 },
  { rank: 4, city: "Sri Ganganagar, India", aqi: 172, status: "Unhealthy", standardMultiple: 11 },
  { rank: 5, city: "Rupnagar, India", aqi: 170, status: "Unhealthy", standardMultiple: 11 },
  { rank: 6, city: "Abohar, India", aqi: 169, status: "Unhealthy", standardMultiple: 11 },
  { rank: 7, city: "Dharuhera, India", aqi: 163, status: "Unhealthy", standardMultiple: 11 },
  { rank: 8, city: "Kishanganj, India", aqi: 151, status: "Unhealthy", standardMultiple: 10 },
  { rank: 9, city: "Pappankuppam, India", aqi: 147, status: "Poor", standardMultiple: 10 },
  { rank: 10, city: "Belagavi, India", aqi: 144, status: "Poor", standardMultiple: 10 },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Hazardous": return "destructive";
    case "Unhealthy": return "destructive";
    case "Poor": return "secondary";
    default: return "default";
  }
};

const getAQIColor = (aqi: number) => {
  if (aqi <= 50) return "text-green-500";
  if (aqi <= 100) return "text-yellow-500";
  if (aqi <= 150) return "text-orange-500";
  if (aqi <= 200) return "text-red-500";
  return "text-purple-500";
};

export const MostPollutedCities = () => {
  const currentDate = new Date().toLocaleString('en-US', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Most Polluted Cities 2025</h2>
        <p className="text-muted-foreground">Live Ranking - India</p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>City</TableHead>
              <TableHead className="text-right">AQI</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Standard Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cityRankings.map((city) => (
              <TableRow key={city.rank} className="hover:bg-muted/50">
                <TableCell className="font-medium">{city.rank}</TableCell>
                <TableCell className="font-medium">{city.city}</TableCell>
                <TableCell className="text-right">
                  <span className={`text-lg font-bold ${getAQIColor(city.aqi)}`}>
                    {city.aqi}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(city.status)}>
                    {city.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm text-muted-foreground">
                    {city.standardMultiple}x above Standard
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="px-6 py-3 border-t text-xs text-muted-foreground">
          Last Updated: {currentDate}
        </div>
      </Card>
    </div>
  );
};
