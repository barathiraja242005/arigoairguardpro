import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { TrendingUp, MapPin } from "lucide-react";
import InteractiveMap, { calculateAQI } from "@/components/map/InteractiveMap";
import { useState, useEffect } from "react";

interface NearbyLocation {
  name: string;
  aqi: number;
  status: string;
  distance?: number;
}

const MapView = () => {
  const [nearbyLocations, setNearbyLocations] = useState<NearbyLocation[]>([]);
  const [avgAQI, setAvgAQI] = useState(0);
  const [bestLocation, setBestLocation] = useState("Loading...");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const response = await fetch(
            `https://api.openaq.org/v2/latest?limit=5&radius=25000&coordinates=${position.coords.latitude},${position.coords.longitude}&order_by=distance`
          );
          const data = await response.json();
          
          if (data.results && data.results.length > 0) {
            const locations = data.results.map((result: any) => {
              const pm25 = result.measurements?.find((m: any) => m.parameter === 'pm25')?.value;
              const pm10 = result.measurements?.find((m: any) => m.parameter === 'pm10')?.value;
              const aqi = calculateAQI(pm25, pm10);
              
              let status = "Good";
              if (aqi > 100) status = "Unhealthy";
              else if (aqi > 50) status = "Moderate";
              
              return {
                name: result.location,
                aqi,
                status,
              };
            }).filter((loc: NearbyLocation) => loc.aqi > 0);
            
            setNearbyLocations(locations);
            
            if (locations.length > 0) {
              const avg = Math.round(locations.reduce((sum: number, loc: NearbyLocation) => sum + loc.aqi, 0) / locations.length);
              setAvgAQI(avg);
              
              const best = locations.reduce((min: NearbyLocation, loc: NearbyLocation) => loc.aqi < min.aqi ? loc : min);
              setBestLocation(best.name);
            }
          }
        } catch (error) {
          console.error("Error fetching nearby locations:", error);
        }
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Map View</h1>
        <p className="text-muted-foreground">
          Real-time AQI monitoring stations near you
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-0 h-[600px] overflow-hidden">
            <InteractiveMap />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Nearby Stations
            </h3>
            <div className="space-y-4">
              {nearbyLocations.length > 0 ? nearbyLocations.map((location, index) => (
                <motion.div
                  key={location.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg border border-border hover:shadow-card transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{location.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {location.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          location.aqi <= 50
                            ? "bg-aqi-good"
                            : location.aqi <= 100
                            ? "bg-aqi-moderate"
                            : "bg-aqi-hazardous"
                        }`}
                        style={{ width: `${(location.aqi / 200) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">{location.aqi}</span>
                  </div>
                </motion.div>
              )) : (
                <div className="text-center text-muted-foreground py-8">
                  <p className="text-sm">Loading nearby stations...</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Area Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Average AQI</span>
                <span className="font-semibold">{avgAQI || "..."}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Best Location</span>
                <span className="font-semibold text-xs">{bestLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Stations Found</span>
                <span className="font-semibold">{nearbyLocations.length}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MapView;
