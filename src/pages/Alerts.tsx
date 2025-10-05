
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Info, XCircle, CheckCircle, Bell, X, AlertCircle } from 'lucide-react';

type AlertType = 'error' | 'warning' | 'info';

interface Alert {
  id: number;
  type: AlertType;
  message: string;
  timestamp: string;
}

const mockAlerts: Alert[] = [
    { id: 1, type: 'error', message: 'Failed to fetch sensor data from AQ-102. Sensor may be offline.', timestamp: '2023-10-27T10:00:00Z' },
    { id: 2, type: 'warning', message: 'High CO2 levels detected in Zone 3. Recommend increasing ventilation.', timestamp: '2023-10-27T10:05:00Z' },
    { id: 3, type: 'info', message: 'System software update v1.2.3 completed successfully.', timestamp: '2023-10-27T09:30:00Z' },
    { id: 4, type: 'error', message: 'Authentication with cloud service failed. Please check API keys.', timestamp: '2023-10-27T08:45:00Z' },
    { id: 5, type: 'warning', message: 'Device battery on AQ-055 is low (15%).', timestamp: '2023-10-27T11:00:00Z' },
    { id: 6, type: 'info', message: 'New device "Lobby Sensor" added to the network.', timestamp: '2023-10-26T15:00:00Z' },
    { id: 7, type: 'error', message: 'Network connectivity lost for the West Wing sensors.', timestamp: '2023-10-27T11:10:00Z' },
    { id: 8, type: 'warning', message: 'Filter for HVAC unit #3 needs replacement soon.', timestamp: '2023-10-25T12:00:00Z' },
];

const AlertIcon = ({ type }: { type: AlertType }) => {
    switch (type) {
        case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
        case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
        case 'info': return <Info className="w-5 h-5 text-blue-500" />;
        default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
};

const AlertCard = ({ alert, onDismiss }: { alert: Alert; onDismiss: (id: number) => void; }) => {
    
    const cardVariants = {
        initial: { opacity: 0, y: 50, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, x: -100, transition: { duration: 0.3 } },
    };

    return (
        <motion.div
            layout
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <Card>
                <CardContent className="p-4 flex items-start space-x-4">
                    <div className="flex-shrink-0">
                        <AlertIcon type={alert.type} />
                    </div>
                    <div className="flex-grow">
                        <p className="font-semibold">{alert.message}</p>
                        <p className="text-sm text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleString()}
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onDismiss(alert.id)} className="flex-shrink-0">
                        <X className="w-4 h-4" />
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
};


const Alerts = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        // Simulate fetching alerts
        setAlerts(mockAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    }, []);

    const dismissAlert = (id: number) => {
        setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
    };

    const dismissAll = () => {
        setAlerts([]);
    };

    const filteredAlerts = (type: AlertType) => alerts.filter(alert => alert.type === type);

    const renderAlert = (alert: Alert) => (
        <AlertCard key={alert.id} alert={alert} onDismiss={dismissAlert} />
    );
    
    const tabContent = (type: "all" | AlertType) => {
        const alertsToShow = type === 'all' ? alerts : filteredAlerts(type);
        const emptyStateMessages = {
            all: "You're all caught up! All systems are running smoothly.",
            error: "No error alerts.",
            warning: "No warning alerts.",
            info: "No informational alerts."
        }

        return (
            <motion.div
                key={type}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
            >
                {alertsToShow.length === 0 ? (
                    <Card className="text-center p-8">
                         <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                            {type === 'all' ? "No Active Alerts" : `No ${type} alerts`}
                        </h3>
                        <p className="text-muted-foreground">{emptyStateMessages[type]}</p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {alertsToShow.map(renderAlert)}
                        </AnimatePresence>
                    </div>
                )}
            </motion.div>
        )
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">System Alerts</h1>
                {alerts.length > 0 && (
                    <Button variant="outline" onClick={dismissAll}>Clear All</Button>
                )}
            </div>
            <p className="text-muted-foreground mt-1">
              Monitor important events and system status
            </p>
          </motion.div>
    
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({alerts.length})</TabsTrigger>
              <TabsTrigger value="errors">Errors ({filteredAlerts("error").length})</TabsTrigger>
              <TabsTrigger value="warnings">Warnings ({filteredAlerts("warning").length})</TabsTrigger>
              <TabsTrigger value="info">Info ({filteredAlerts("info").length})</TabsTrigger>
            </TabsList>
            <AnimatePresence mode="wait">
                <TabsContent value="all" forceMount>
                    {activeTab === "all" && tabContent("all")}
                </TabsContent>
                <TabsContent value="errors" forceMount>
                    {activeTab === "errors" && tabContent("error")}
                </TabsContent>
                <TabsContent value="warnings" forceMount>
                    {activeTab === "warnings" && tabContent("warning")}
                </TabsContent>
                <TabsContent value="info" forceMount>
                    {activeTab === "info" && tabContent("info")}
                </TabsContent>
            </AnimatePresence>
          </Tabs>
        </div>
      );
    };

export default Alerts;
