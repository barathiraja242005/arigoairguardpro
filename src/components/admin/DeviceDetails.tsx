import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Circle } from "lucide-react";
import { getDeviceStatusColor } from "@/lib/design-system";

interface DeviceDetailsProps {
  device: {
    id: string;
    name: string;
    status: "Online" | "Offline";
    aqi: number;
    lastReading: string;
  };
}

const DeviceDetails = ({ device }: DeviceDetailsProps) => {
  const statusColor = getDeviceStatusColor(device.status);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{device.name}</span>
          <Badge variant={device.status === "Online" ? "default" : "destructive"}>
            <Circle className={`mr-2 h-2 w-2 ${statusColor}`} fill="currentColor" />
            {device.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Device ID</p>
          <p className="font-mono text-sm">{device.id}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Air Quality Index (AQI)</p>
          <p className="text-2xl font-bold">{device.aqi}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Last Reading</p>
          <p className="text-sm">{device.lastReading}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceDetails;
