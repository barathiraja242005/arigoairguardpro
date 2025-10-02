import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AlertCircle, AlertTriangle, Info, X } from "lucide-react";

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
  ]);

  const getAlertConfig = (type: Alert["type"]) => {
    switch (type) {
      case "error":
        return {
          icon: AlertCircle,
          bgColor: "bg-aqi-hazardous/10",
          borderColor: "border-aqi-hazardous/30",
          iconColor: "text-aqi-hazardous",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          bgColor: "bg-aqi-moderate/10",
          borderColor: "border-aqi-moderate/30",
          iconColor: "text-aqi-moderate",
        };
      case "info":
        return {
          icon: Info,
          bgColor: "bg-primary/10",
          borderColor: "border-primary/30",
          iconColor: "text-primary",
        };
    }
  };

  const dismissAlert = (id: number) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Alerts & Notifications</h1>
        <p className="text-muted-foreground">
          Monitor important events and system status
        </p>
      </motion.div>

      <div className="max-w-4xl">
        <AnimatePresence mode="popLayout">
          {alerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="p-12 text-center">
                <Info className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Active Alerts</h3>
                <p className="text-muted-foreground">
                  You're all caught up! All systems are running smoothly.
                </p>
              </Card>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => {
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
                    <Card
                      className={`p-6 ${config.bgColor} border ${config.borderColor}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl bg-card ${config.iconColor}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{alert.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {alert.time}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => dismissAlert(alert.id)}
                              className="hover:bg-destructive/20"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-foreground">{alert.message}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Alerts;
