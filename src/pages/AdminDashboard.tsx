import AqiTrends from "@/components/admin/AqiTrends";
import DeviceDetails from "@/components/admin/DeviceDetails";
import InfoCard from "@/components/admin/InfoCard";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  LogOut,
  Smartphone,
  Wifi,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const summaryData = [
    { title: "Total Devices", value: "5", icon: Smartphone },
    { title: "Online Devices", value: "5", icon: Wifi },
    { title: "Active Alerts", value: "1", icon: AlertTriangle },
    { title: "Average AQI", value: "66", icon: Shield },
  ];

  const devices = [
    { id: "A1B2-C3D4-E5F6", name: "John's Unit", status: "Online", aqi: 70, lastReading: "just now" },
    { id: "G7H8-I9J0-K1L2", name: "Jane's Unit", status: "Online", aqi: 65, lastReading: "2 minutes ago" },
    { id: "M3N4-O5P6-Q7R8", name: "Peter's Unit", status: "Online", aqi: 55, lastReading: "10 minutes ago" },
    { id: "S9T0-U1V2-W3X4", name: "Susan's Unit", status: "Online", aqi: 78, lastReading: "just now" },
    { id: "Y5Z6-A7B8-C9D0", name: "David's Unit", status: "Online", aqi: 60, lastReading: "15 minutes ago" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 h-16 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </header>
      <main className="p-8 space-y-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {summaryData.map((data) => (
            <InfoCard key={data.title} {...data} />
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
                <h2 className="text-xl font-semibold text-gray-700">Device Details</h2>
                <div className="grid gap-8 md:grid-cols-2">
                    {devices.map(device => (
                        <DeviceDetails key={device.id} device={device} />
                    ))}
                </div>
            </div>
            <div className="space-y-8">
                <h2 className="text-xl font-semibold text-gray-700">Overall AQI Trends</h2>
                <AqiTrends />
            </div>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;
