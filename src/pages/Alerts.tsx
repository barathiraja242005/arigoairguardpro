import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { AlertCircle, AlertTriangle, Info, X, CheckCircle, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Alert {
  id: number;
  type: "info" | "warning" | "error";
  title: string;
  message: string;
  time: string;
}

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      type: "error",
      title: "Poor Air Quality",
      message: "AQI has reached 125. Consider increasing fan speed or moving to a cleaner area.",
      time: "2 minutes ago",
    },
    {
      id: 2,
      type: "warning",
      title: "Filter Replacement Soon",
      message: "HEPA filter health is at 72%. Schedule replacement in 15 days.",
      time: "1 hour ago",
    },
    {
      id: 3,
      type: "warning",
      title: "Battery Low",
      message: "Battery level is at 25%. Please charge the device soon.",
      time: "3 hours ago",
    },
    {
      id: 4,
      type: "info",
      title: "Firmware Update Available",
      message: "Version 2.1.5 is now available with improved sensor accuracy.",
      time: "1 day ago",
    },
    {
        id: 5,
        type: "error",
        title: "High VOC Levels Detected",
        message: "Volatile Organic Compound levels are higher than recommended. Ventilate the area.",
        time: "5 minutes ago",
    },
    {
        id: 6,
        type: "info",
        title: "Device Connected",
        message: "Arigo AirGuard Pro is connected to your Wi-Fi network.",
        time: "2 days ago",
    }
  ]);
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

  const getAlertConfig = (type: Alert["type"]) => {
    switch (type) {
      case "error":
        return {
          icon: AlertCircle,
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/30",
          iconColor: "text-red-500",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/30",
          iconColor: "text-yellow-500",
        };
      case "info":
      default:
        return {
          icon: Info,
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-500/30",
          iconColor: "text-blue-500",
        };
    }
  };

  const dismissAlert = (id: number) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
    toast.success("Alert dismissed");
  };

  const dismissAll = () => {
    setAlerts([]);
    toast.success("All alerts dismissed");
  }

  const renderAlert = (alert: Alert) => {
    const config = getAlertConfig(alert.type);
    const Icon = config.icon;

    return (
      <motion.div
        key={alert.id}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50, height: 0, marginBottom: 0 }}
        transition={{ duration: 0.3 }}
        layout
      >
        <Card className={`p-4 ${config.bgColor} border ${config.borderColor} shadow-sm hover:shadow-md transition-shadow bg-card`}>
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-lg bg-background ${config.iconColor}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h3 className="font-semibold text-md text-foreground">{alert.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {alert.time}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => dismissAlert(alert.id)}
                  className="h-7 w-7 text-muted-foreground hover:bg-destructive/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-foreground/90">{alert.message}</p>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  const filteredAlerts = (type: Alert["type"]) => alerts.filter(alert => alert.type === type);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
        <div className="absolute top-4 right-4">
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
            className="p-2 rounded-full border border-border bg-card hover:bg-accent transition-colors"
            >
            {darkMode ? (
                <Sun className="h-5 w-5" />
            ) : (
                <Moon className="h-5 w-5" />
            )}
            </button>
      </div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 mt-12"
      >
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Alerts & Notifications</h1>
            {alerts.length > 0 && (
                <Button variant="outline" onClick={dismissAll}>Clear All</Button>
            )}
        </div>
        <p className="text-muted-foreground mt-1">
          Monitor important events and system status
        </p>
      </motion.div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({alerts.length})</TabsTrigger>
          <TabsTrigger value="errors">Errors ({filteredAlerts("error").length})</TabsTrigger>
          <TabsTrigger value="warnings">Warnings ({filteredAlerts("warning").length})</TabsTrigger>
          <TabsTrigger value="info">Info ({filteredAlerts("info").length})</TabsTrigger>
        </TabsList>
        <AnimatePresence mode="wait">
            <motion.div
                key={ "all" }
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
            >
                <TabsContent value="all">
                    {alerts.length === 0 ? (
                        <Card className="mt-4 p-12 text-center bg-card border-dashed">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Active Alerts</h3>
                        <p className="text-muted-foreground">
                            You're all caught up! All systems are running smoothly.
                        </p>
                        </Card>
                    ) : (
                        <div className="mt-4 space-y-4">
                            {alerts.map(renderAlert)}
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="errors">
                    {filteredAlerts("error").length === 0 ? (
                        <p className="text-muted-foreground text-center p-8 mt-4">No error alerts.</p>
                    ) : (
                        <div className="mt-4 space-y-4">
                            {filteredAlerts("error").map(renderAlert)}
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="warnings">
                    {filteredAlerts("warning").length === 0 ? (
                        <p className="text-muted-foreground text-center p-8 mt-4">No warning alerts.</p>
                    ) : (
                        <div className="mt-4 space-y-4">
                            {filteredAlerts("warning").map(renderAlert)}
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="info">
                    {filteredAlerts("info").length === 0 ? (
                        <p className="text-muted-foreground text-center p-8 mt-4">No informational alerts.</p>
                    ) : (
                        <div className="mt-4 space-y-4">
                            {filteredAlerts("info").map(renderAlert)}
                        </div>
                    )}
                </TabsContent>
            </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

export default Alerts;
