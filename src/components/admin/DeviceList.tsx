import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const devices = [
  { id: "ARIGO-001", status: "Online", battery: 95, lastSeen: "Just now" },
  { id: "ARIGO-002", status: "Offline", battery: 0, lastSeen: "2 hours ago" },
  { id: "ARIGO-003", status: "Online", battery: 78, lastSeen: "5 minutes ago" },
  { id: "ARIGO-004", status: "Online", battery: 89, lastSeen: "1 minute ago" },
  { id: "ARIGO-005", status: "Warning", battery: 30, lastSeen: "10 minutes ago" },
];

const DeviceList = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Devices</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Battery</TableHead>
              <TableHead>Last Seen</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.map((device) => (
              <TableRow key={device.id}>
                <TableCell className="font-medium">{device.id}</TableCell>
                <TableCell>
                  <Badge
                    variant={device.status === "Online" ? "default" : device.status === "Warning" ? "destructive" : "outline"}
                  >
                    {device.status}
                  </Badge>
                </TableCell>
                <TableCell>{device.battery}%</TableCell>
                <TableCell>{device.lastSeen}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DeviceList;
