import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import {
  Power,
  Fan,
  Moon,
  Zap,
  Bell,
  Calendar,
  Leaf,
  Settings,
  Wind,
  Sun,
  Clock,
  Server,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { startFluctuation, stopFluctuation } from "@/lib/uploadData";

const Controls = () => {
  const [isPowerOn, setIsPowerOn] = useState(true);
  const [fanSpeed, setFanSpeed] = useState([3]);
  const [autoMode, setAutoMode] = useState(true);
  const [silentMode, setSilentMode] = useState(false);
  const [isSchedulingOn, setIsSchedulingOn] = useState(true);
  const [startTime, setStartTime] = useState("22:00");
  const [endTime, setEndTime] = useState("06:00");
  const [notifications, setNotifications] = useState(true);
  const [notificationType, setNotificationType] = useState("push");
  const [ecoMode, setEcoMode] = useState(false);
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

  const handlePowerToggle = () => {
    setIsPowerOn(!isPowerOn);
    toast.success(isPowerOn ? "Device turned off" : "Device turned on");
  };

  const handleAutoModeToggle = () => {
    setAutoMode(!autoMode);
    toast.success(autoMode ? "Manual mode activated" : "Auto mode activated");
  };

  const handleSilentModeToggle = () => {
    setSilentMode(!silentMode);
    toast.success(silentMode ? "Silent mode off" : "Silent mode on");
  };

  const handleSchedulingToggle = () => {
    setIsSchedulingOn(!isSchedulingOn);
    toast.success(
      isSchedulingOn ? "Scheduling disabled" : "Scheduling enabled"
    );
  };

  const handleNotificationsToggle = () => {
    setNotifications(!notifications);
    toast.success(
      notifications ? "Notifications disabled" : "Notifications enabled"
    );
  };

  const handleEcoModeToggle = () => {
    setEcoMode(!ecoMode);
    toast.success(ecoMode ? "Eco mode disabled" : "Eco mode enabled");
  };

  const handleConfirmScheduling = () => {
    toast.success(`Scheduling confirmed from ${startTime} to ${endTime}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 dark:from-gray-900 dark:via-gray-800/20 dark:to-gray-900/20 p-4 sm:p-8">
      {/* Dark Mode Toggle */}
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
            <Sun className="h-6 w-6 text-foreground" />
          ) : (
            <Moon className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-foreground">
          Device Controls
        </h1>
        <p className="text-muted-foreground">
          Remote control and configuration for your device.
        </p>
      </motion.div>

      <Card className="max-w-4xl mx-auto bg-card/80 backdrop-blur-sm shadow-lg border-border">
        <Tabs defaultValue="general">
          <CardHeader className="border-b border-border">
            <TabsList className="flex flex-wrap h-auto bg-muted/50">
              <TabsTrigger
                value="general"
                className="text-foreground data-[state=active]:bg-background"
              >
                <Settings className="w-5 h-5 mr-2" /> General
              </TabsTrigger>
              <TabsTrigger
                value="modes"
                className="text-foreground data-[state=active]:bg-background"
              >
                <Wind className="w-5 h-5 mr-2" /> Modes
              </TabsTrigger>
              <TabsTrigger
                value="scheduling"
                className="text-foreground data-[state=active]:bg-background"
              >
                <Calendar className="w-5 h-5 mr-2" /> Scheduling
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="text-foreground data-[state=active]:bg-background"
              >
                <Bell className="w-5 h-5 mr-2" /> Notifications
              </TabsTrigger>
              <TabsTrigger
                value="data"
                className="text-foreground data-[state=active]:bg-background"
              >
                <Server className="w-5 h-5 mr-2" /> Data
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="pt-6">
            <TabsContent value="general">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border">
                  <Label
                    htmlFor="power-switch"
                    className="flex items-center gap-4 cursor-pointer"
                  >
                    <Power
                      className={`w-8 h-8 ${
                        isPowerOn ? "text-green-500" : "text-muted-foreground"
                      }`}
                    />
                    <span className="text-lg font-medium text-foreground">
                      Device Power
                    </span>
                  </Label>
                  <Switch
                    id="power-switch"
                    checked={isPowerOn}
                    onCheckedChange={handlePowerToggle}
                  />
                </div>
                <div className="p-4 rounded-lg bg-background/50 border border-border">
                  <Label
                    htmlFor="fan-speed-slider"
                    className="flex items-center gap-4 mb-4"
                  >
                    <Fan className="w-8 h-8 text-blue-500" />
                    <span className="text-lg font-medium text-foreground">
                      Fan Speed
                    </span>
                  </Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="fan-speed-slider"
                      value={fanSpeed}
                      onValueChange={setFanSpeed}
                      max={5}
                      min={1}
                      step={1}
                    />
                    <span className="font-bold text-lg w-12 text-center text-foreground">
                      {fanSpeed[0]}
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="modes">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border">
                  <Label
                    htmlFor="auto-mode-switch"
                    className="flex items-center gap-4 cursor-pointer"
                  >
                    <Zap
                      className={`w-8 h-8 ${
                        autoMode ? "text-yellow-500" : "text-muted-foreground"
                      }`}
                    />
                    <span className="text-lg font-medium text-foreground">
                      Auto Mode
                    </span>
                  </Label>
                  <Switch
                    id="auto-mode-switch"
                    checked={autoMode}
                    onCheckedChange={handleAutoModeToggle}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border">
                  <Label
                    htmlFor="silent-mode-switch"
                    className="flex items-center gap-4 cursor-pointer"
                  >
                    <Moon
                      className={`w-8 h-8 ${
                        silentMode ? "text-indigo-500" : "text-muted-foreground"
                      }`}
                    />
                    <span className="text-lg font-medium text-foreground">
                      Silent Mode
                    </span>
                  </Label>
                  <Switch
                    id="silent-mode-switch"
                    checked={silentMode}
                    onCheckedChange={handleSilentModeToggle}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border">
                  <Label
                    htmlFor="eco-mode-switch"
                    className="flex items-center gap-4 cursor-pointer"
                  >
                    <Leaf
                      className={`w-8 h-8 ${
                        ecoMode ? "text-green-500" : "text-muted-foreground"
                      }`}
                    />
                    <span className="text-lg font-medium text-foreground">
                      Eco Mode
                    </span>
                  </Label>
                  <Switch
                    id="eco-mode-switch"
                    checked={ecoMode}
                    onCheckedChange={handleEcoModeToggle}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="scheduling">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border">
                  <Label
                    htmlFor="scheduling-switch"
                    className="flex items-center gap-4 cursor-pointer"
                  >
                    <Calendar
                      className={`w-8 h-8 ${
                        isSchedulingOn
                          ? "text-purple-500"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span className="text-lg font-medium text-foreground">
                      Enable Scheduling
                    </span>
                  </Label>
                  <Switch
                    id="scheduling-switch"
                    checked={isSchedulingOn}
                    onCheckedChange={handleSchedulingToggle}
                  />
                </div>
                {isSchedulingOn && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-background/50 border border-border"
                  >
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="relative">
                        <Label
                          htmlFor="start-time"
                          className="mb-2 block text-foreground"
                        >
                          Start Time
                        </Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="start-time"
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="bg-background border-border text-foreground pl-10"
                            style={{ colorScheme: darkMode ? "dark" : "light" }}
                          />
                        </div>
                      </div>
                      <div className="relative">
                        <Label
                          htmlFor="end-time"
                          className="mb-2 block text-foreground"
                        >
                          End Time
                        </Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="end-time"
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="bg-background border-border text-foreground pl-10"
                            style={{ colorScheme: darkMode ? "dark" : "light" }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Button
                        onClick={handleConfirmScheduling}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Confirm
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border">
                  <Label
                    htmlFor="notifications-switch"
                    className="flex items-center gap-4 cursor-pointer"
                  >
                    <Bell
                      className={`w-8 h-8 ${
                        notifications ? "text-red-500" : "text-muted-foreground"
                      }`}
                    />
                    <span className="text-lg font-medium text-foreground">
                      Enable Notifications
                    </span>
                  </Label>
                  <Switch
                    id="notifications-switch"
                    checked={notifications}
                    onCheckedChange={handleNotificationsToggle}
                  />
                </div>
                {notifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-background/50 border border-border"
                  >
                    <Label className="mb-2 block text-foreground">
                      Notification Type
                    </Label>
                    <Select
                      value={notificationType}
                      onValueChange={setNotificationType}
                    >
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        <SelectItem value="push" className="focus:bg-accent">
                          Push Notification
                        </SelectItem>
                        <SelectItem value="email" className="focus:bg-accent">
                          Email
                        </SelectItem>
                        <SelectItem value="sms" className="focus:bg-accent">
                          SMS
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="data">
              <div className="space-y-6 p-4 rounded-lg bg-background/50 border border-border">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-4">
                    <Server className="w-8 h-8 text-foreground" />
                    <span className="text-lg font-medium text-foreground">
                      Data Fluctuation
                    </span>
                  </Label>
                  <div className="flex gap-2">
                    <Button onClick={startFluctuation}>Start</Button>
                    <Button onClick={stopFluctuation} variant="destructive">
                      Stop
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Start or stop sending random sensor data to the database.
                </p>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Controls;
