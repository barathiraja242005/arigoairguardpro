import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Power, Fan, Moon, Zap, Bell, Calendar, Leaf, Settings, Wind } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Controls = () => {
  const [isPowerOn, setIsPowerOn] = useState(true);
  const [fanSpeed, setFanSpeed] = useState([3]);
  const [autoMode, setAutoMode] = useState(true);
  const [silentMode, setSilentMode] = useState(false);
  const [isSchedulingOn, setIsSchedulingOn] = useState(false);
  const [startTime, setStartTime] = useState("22:00");
  const [endTime, setEndTime] = useState("06:00");
  const [notifications, setNotifications] = useState(true);
  const [notificationType, setNotificationType] = useState("push");
  const [ecoMode, setEcoMode] = useState(false);

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
    toast.success(isSchedulingOn ? "Scheduling disabled" : "Scheduling enabled");
  };

  const handleNotificationsToggle = () => {
    setNotifications(!notifications);
    toast.success(notifications ? "Notifications disabled" : "Notifications enabled");
  };
  
  const handleEcoModeToggle = () => {
    setEcoMode(!ecoMode);
    toast.success(ecoMode ? "Eco mode disabled" : "Eco mode enabled");
  };

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">Device Controls</h1>
        <p className="text-gray-600">
          Remote control and configuration for your device.
        </p>
      </motion.div>

      <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm shadow-lg">
        <Tabs defaultValue="general">
          <CardHeader className="border-b border-gray-200">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="general" className="text-gray-700"><Settings className="w-4 h-4 mr-2"/> General</TabsTrigger>
              <TabsTrigger value="modes" className="text-gray-700"><Wind className="w-4 h-4 mr-2"/> Modes</TabsTrigger>
              <TabsTrigger value="scheduling" className="text-gray-700"><Calendar className="w-4 h-4 mr-2"/> Scheduling</TabsTrigger>
              <TabsTrigger value="notifications" className="text-gray-700"><Bell className="w-4 h-4 mr-2"/> Notifications</TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="pt-6">
            <TabsContent value="general">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/60">
                  <Label htmlFor="power-switch" className="flex items-center gap-4">
                    <Power className={`w-6 h-6 ${isPowerOn ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className="text-lg font-medium text-gray-800">Device Power</span>
                  </Label>
                  <Switch id="power-switch" checked={isPowerOn} onCheckedChange={handlePowerToggle} />
                </div>
                <div className="p-4 rounded-lg bg-white/60">
                  <Label htmlFor="fan-speed-slider" className="flex items-center gap-4 mb-4">
                    <Fan className="w-6 h-6 text-blue-600" />
                    <span className="text-lg font-medium text-gray-800">Fan Speed</span>
                  </Label>
                  <div className="flex items-center gap-4">
                    <Slider id="fan-speed-slider" value={fanSpeed} onValueChange={setFanSpeed} max={5} min={1} step={1} />
                    <span className="font-bold text-lg w-12 text-center text-gray-800">{fanSpeed[0]}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="modes">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/60">
                  <Label htmlFor="auto-mode-switch" className="flex items-center gap-4">
                    <Zap className={`w-6 h-6 ${autoMode ? 'text-yellow-500' : 'text-gray-500'}`} />
                    <span className="text-lg font-medium text-gray-800">Auto Mode</span>
                  </Label>
                  <Switch id="auto-mode-switch" checked={autoMode} onCheckedChange={handleAutoModeToggle} />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/60">
                  <Label htmlFor="silent-mode-switch" className="flex items-center gap-4">
                    <Moon className={`w-6 h-6 ${silentMode ? 'text-indigo-500' : 'text-gray-500'}`} />
                    <span className="text-lg font-medium text-gray-800">Silent Mode</span>
                  </Label>
                  <Switch id="silent-mode-switch" checked={silentMode} onCheckedChange={handleSilentModeToggle} />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/60">
                  <Label htmlFor="eco-mode-switch" className="flex items-center gap-4">
                    <Leaf className={`w-6 h-6 ${ecoMode ? 'text-green-500' : 'text-gray-500'}`} />
                    <span className="text-lg font-medium text-gray-800">Eco Mode</span>
                  </Label>
                  <Switch id="eco-mode-switch" checked={ecoMode} onCheckedChange={handleEcoModeToggle} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="scheduling">
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/60">
                        <Label htmlFor="scheduling-switch" className="flex items-center gap-4">
                            <Calendar className={`w-6 h-6 ${isSchedulingOn ? 'text-purple-500' : 'text-gray-500'}`} />
                            <span className="text-lg font-medium text-gray-800">Enable Scheduling</span>
                        </Label>
                        <Switch id="scheduling-switch" checked={isSchedulingOn} onCheckedChange={handleSchedulingToggle} />
                    </div>
                    {isSchedulingOn && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="grid sm:grid-cols-2 gap-6 p-4 rounded-lg bg-white/60">
                        <div>
                            <Label htmlFor="start-time" className="mb-2 block text-gray-700">Start Time</Label>
                            <Input id="start-time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="end-time" className="mb-2 block text-gray-700">End Time</Label>
                            <Input id="end-time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                        </div>
                    </motion.div>
                    )}
                </div>
            </TabsContent>

            <TabsContent value="notifications">
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/60">
                        <Label htmlFor="notifications-switch" className="flex items-center gap-4">
                            <Bell className={`w-6 h-6 ${notifications ? 'text-red-500' : 'text-gray-500'}`} />
                            <span className="text-lg font-medium text-gray-800">Enable Notifications</span>
                        </Label>
                        <Switch id="notifications-switch" checked={notifications} onCheckedChange={handleNotificationsToggle} />
                    </div>
                    {notifications && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-lg bg-white/60">
                            <Label className="mb-2 block text-gray-700">Notification Type</Label>
                            <Select value={notificationType} onValueChange={setNotificationType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="push">Push Notification</SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="sms">SMS</SelectItem>
                                </SelectContent>
                            </Select>
                        </motion.div>
                    )}
                </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Controls;
