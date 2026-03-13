
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AlertTriangle, Info, XCircle, CheckCircle, Bell, X, Trash2, Sun, Moon } from 'lucide-react';
import {
  pageStyles,
  pageHeader,
  darkModeToggle,
  alertColors,
  responsive,
} from '@/lib/design-system';

type AlertType = 'error' | 'warning' | 'info' | 'success';

interface Alert {
  id: number;
  type: AlertType;
  message: string;
  timestamp: string;
  description?: string;
}

const mockAlerts: Alert[] = [
    { id: 1, type: 'error', message: 'Sensor Offline', description: 'Failed to fetch sensor data from AQ-102. Sensor may be offline.', timestamp: '2023-10-27T10:00:00Z' },
    { id: 2, type: 'warning', message: 'High CO2 Levels', description: 'High CO2 levels detected in Zone 3. Recommend increasing ventilation.', timestamp: '2023-10-27T10:05:00Z' },
    { id: 3, type: 'info', message: 'System Update', description: 'System software update v1.2.3 completed successfully.', timestamp: '2023-10-27T09:30:00Z' },
    { id: 4, type: 'error', message: 'Auth Failed', description: 'Authentication with cloud service failed. Please check API keys.', timestamp: '2023-10-27T08:45:00Z' },
    { id: 5, type: 'warning', message: 'Low Battery', description: 'Device battery on AQ-055 is low (15%).', timestamp: '2023-10-27T11:00:00Z' },
    { id: 6, type: 'success', message: 'Device Added', description: 'New device "Lobby Sensor" added to the network successfully.', timestamp: '2023-10-26T15:00:00Z' },
    { id: 7, type: 'error', message: 'Network Lost', description: 'Network connectivity lost for the West Wing sensors.', timestamp: '2023-10-27T11:10:00Z' },
    { id: 8, type: 'warning', message: 'Filter Alert', description: 'Filter for HVAC unit #3 needs replacement soon.', timestamp: '2023-10-25T12:00:00Z' },
];

const getAlertColor = (type: AlertType) => {
  switch (type) {
    case 'error': return 'from-red-500/20 to-red-600/20 border-red-500/30';
    case 'warning': return 'from-amber-500/20 to-amber-600/20 border-amber-500/30';
    case 'info': return 'from-blue-500/20 to-blue-600/20 border-blue-500/30';
    case 'success': return 'from-green-500/20 to-green-600/20 border-green-500/30';
    default: return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
  }
};

const getAlertIcon = (type: AlertType) => {
  switch (type) {
    case 'error': return <XCircle className="w-6 h-6 text-red-500" />;
    case 'warning': return <AlertTriangle className="w-6 h-6 text-amber-500" />;
    case 'info': return <Info className="w-6 h-6 text-blue-500" />;
    case 'success': return <CheckCircle className="w-6 h-6 text-green-500" />;
    default: return <Bell className="w-6 h-6 text-gray-500" />;
  }
};

const AlertCard = ({ alert, onDismiss }: { alert: Alert; onDismiss: (id: number) => void; }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <Card className={`bg-gradient-to-br ${getAlertColor(alert.type)} backdrop-blur-md shadow-elevated border hover:shadow-lg transition-shadow`}>
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                            {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-grow">
                            <h3 className="font-semibold text-foreground mb-1">{alert.message}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                            <p className="text-xs text-muted-foreground/80">
                                {new Date(alert.timestamp).toLocaleString()}
                            </p>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => onDismiss(alert.id)}
                            className="flex-shrink-0 hover:bg-destructive/20 hover:text-destructive"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const Alerts = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [activeTab, setActiveTab] = useState<"all" | AlertType>("all");
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
        setAlerts(mockAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    }, []);

    const dismissAlert = (id: number) => {
        setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
    };

    const dismissAll = () => {
        setAlerts([]);
    };

    const getFilteredAlerts = (type: AlertType | "all") => {
        if (type === "all") return alerts;
        return alerts.filter(alert => alert.type === type);
    };

    const errorCount = alerts.filter(a => a.type === 'error').length;
    const warningCount = alerts.filter(a => a.type === 'warning').length;
    const infoCount = alerts.filter(a => a.type === 'info').length;
    const successCount = alerts.filter(a => a.type === 'success').length;

    const filteredAlerts = getFilteredAlerts(activeTab);
    const isEmptyState = filteredAlerts.length === 0;

    return (
        <div className={`${pageStyles.gradientWrapper} ${responsive.pagePadding}`}>
          {/* Dark Mode Toggle */}
          <div className={darkModeToggle.wrapper}>
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
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={pageHeader.wrapper}
          >
            <h1 className={pageHeader.title}>System Alerts</h1>
            <p className={pageHeader.description}>
              Monitor important events and system status
            </p>
          </motion.div>

          {/* Alert Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card 
                className={`cursor-pointer bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-500/30 hover:border-red-500/60 transition-all ${activeTab === 'error' ? 'border-red-500/60 shadow-lg' : ''}`}
                onClick={() => setActiveTab('error')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Errors</p>
                      <p className="text-2xl font-bold text-red-500">{errorCount}</p>
                    </div>
                    <XCircle className="w-8 h-8 text-red-500/40" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card 
                className={`cursor-pointer bg-gradient-to-br from-amber-500/10 to-amber-600/10 border-amber-500/30 hover:border-amber-500/60 transition-all ${activeTab === 'warning' ? 'border-amber-500/60 shadow-lg' : ''}`}
                onClick={() => setActiveTab('warning')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Warnings</p>
                      <p className="text-2xl font-bold text-amber-500">{warningCount}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-amber-500/40" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card 
                className={`cursor-pointer bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/30 hover:border-blue-500/60 transition-all ${activeTab === 'info' ? 'border-blue-500/60 shadow-lg' : ''}`}
                onClick={() => setActiveTab('info')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Info</p>
                      <p className="text-2xl font-bold text-blue-500">{infoCount}</p>
                    </div>
                    <Info className="w-8 h-8 text-blue-500/40" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card 
                className={`cursor-pointer bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/30 hover:border-green-500/60 transition-all ${activeTab === 'success' ? 'border-green-500/60 shadow-lg' : ''}`}
                onClick={() => setActiveTab('success')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Success</p>
                      <p className="text-2xl font-bold text-green-500">{successCount}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500/40" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Alert Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={activeTab === "all" ? "default" : "outline"}
              onClick={() => setActiveTab("all")}
              className="rounded-lg"
            >
              All ({alerts.length})
            </Button>
            <Button
              variant={activeTab === "error" ? "destructive" : "outline"}
              onClick={() => setActiveTab("error")}
              className="rounded-lg"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Errors ({errorCount})
            </Button>
            <Button
              variant={activeTab === "warning" ? "default" : "outline"}
              onClick={() => setActiveTab("warning")}
              className="rounded-lg"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Warnings ({warningCount})
            </Button>
            <Button
              variant={activeTab === "info" ? "default" : "outline"}
              onClick={() => setActiveTab("info")}
              className="rounded-lg"
            >
              <Info className="w-4 h-4 mr-2" />
              Info ({infoCount})
            </Button>
            {alerts.length > 0 && (
              <Button 
                variant="ghost" 
                onClick={dismissAll}
                className="ml-auto text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          {/* Alerts List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {isEmptyState ? (
              <Card className="bg-card/80 backdrop-blur-md shadow-elevated border-border/50 rounded-2xl">
                <CardContent className="p-12 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {activeTab === "all" ? "All Systems Operational" : `No ${activeTab} alerts`}
                  </h3>
                  <p className="text-muted-foreground">
                    {activeTab === "all" 
                      ? "You're all caught up! All systems are running smoothly."
                      : `No ${activeTab} alerts at this time.`
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredAlerts.map(alert => (
                    <AlertCard 
                      key={alert.id} 
                      alert={alert} 
                      onDismiss={dismissAlert} 
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
    );
};

export default Alerts;

