import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { MapPin, TrendingUp } from "lucide-react";

const MapView = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Map View</h1>
        <p className="text-muted-foreground">
          Interactive AQI heatmap and device locations
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6 h-[600px] flex items-center justify-center bg-muted/20">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">
                Interactive map will be displayed here
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Integration with Mapbox/Leaflet for live AQI heatmaps
              </p>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              {[
                { name: "City Park", aqi: 45, status: "Good" },
                { name: "Main Street", aqi: 62, status: "Moderate" },
                { name: "Shopping Mall", aqi: 38, status: "Good" },
              ].map((device, index) => (
                <motion.div
                  key={device.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg border border-border hover:shadow-card transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{device.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {device.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          device.aqi <= 50
                            ? "bg-aqi-good"
                            : device.aqi <= 100
                            ? "bg-aqi-moderate"
                            : "bg-aqi-hazardous"
                        }`}
                        style={{ width: `${(device.aqi / 150) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">{device.aqi}</span>
                  </div>
                </motion.div>
              ))}
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
                <span className="font-semibold">48</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Best Location</span>
                <span className="font-semibold">Shopping Mall</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active Devices</span>
                <span className="font-semibold">3</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MapView;
