import { useState, useEffect } from "react";
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
  Sun,
  Moon,
  Play,
  Square,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { startFluctuation, stopFluctuation } from "@/lib/uploadData";
import {
  pageStyles,
  navStyles,
  darkModeToggle,
  gridStyles,
  typography,
} from "@/lib/design-system";

interface Device {
  id: string;
  name: string;
  status: "Online" | "Offline";
  aqi: number;
  lastReading: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    const isDarkMode = savedMode === "true";
    setDarkMode(isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleLogout = () => {
    navigate("/");
  };

  const summaryData = [
    { title: "Total Devices", value: "5", icon: Smartphone },
    { title: "Online Devices", value: "5", icon: Wifi },
    { title: "Active Alerts", value: "1", icon: AlertTriangle },
    { title: "Average AQI", value: "66", icon: Shield },
  ];

  const devices: Device[] = [
    { id: "A1B2-C3D4-E5F6", name: "John's Unit", status: "Online", aqi: 70, lastReading: "just now" },
    { id: "G7H8-I9J0-K1L2", name: "Jane's Unit", status: "Online", aqi: 65, lastReading: "2 minutes ago" },
    { id: "M3N4-O5P6-Q7R8", name: "Peter's Unit", status: "Online", aqi: 55, lastReading: "10 minutes ago" },
    { id: "S9T0-U1V2-W3X4", name: "Susan's Unit", status: "Online", aqi: 78, lastReading: "just now" },
    { id: "Y5Z6-A7B8-C9D0", name: "David's Unit", status: "Online", aqi: 60, lastReading: "15 minutes ago" },
  ];

  return (
    <div className={pageStyles.wrapper}>
      <header className={navStyles.header}>
        <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              const newDarkMode = !darkMode;
              setDarkMode(newDarkMode);
              localStorage.setItem("darkMode", newDarkMode.toString());
              if (newDarkMode) {
                document.documentElement.classList.add("dark");
              } else {
                document.documentElement.classList.remove("dark");
              }
            }}
            className={darkModeToggle.button}
          >
            {darkMode ? (
              <Sun className={darkModeToggle.iconClass} />
            ) : (
              <Moon className={darkModeToggle.iconClass} />
            )}
          </button>
          <Button variant="ghost" size="sm" onClick={startFluctuation}>
            <Play className="mr-2 h-4 w-4" />
            Start Fluctuation
          </Button>
          <Button variant="ghost" size="sm" onClick={stopFluctuation}>
            <Square className="mr-2 h-4 w-4" />
            Stop Fluctuation
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>
      <main className="p-8 space-y-8">
        <div className={gridStyles.stats}>
          {summaryData.map((data) => (
            <InfoCard key={data.title} {...data} />
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
                <h2 className={typography.sectionTitle}>Device Details</h2>
                <div className="grid gap-8 md:grid-cols-2">
                    {devices.map(device => (
                        <DeviceDetails key={device.id} device={device} />
                    ))}
                </div>
            </div>
            <div className="space-y-8">
                <h2 className={typography.sectionTitle}>Overall AQI Trends</h2>
                <AqiTrends />
            </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
