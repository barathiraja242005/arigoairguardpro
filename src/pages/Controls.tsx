import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import {
  Power,
  Fan,
  Moon,
  Zap,
  Calendar,
  Leaf,
  Clock,
  Server,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { startFluctuation, stopFluctuation } from "@/lib/uploadData";
import {
  pageStyles,
  pageHeader,
  responsive,
} from "@/lib/design-system";

const Controls = () => {
  const [isPowerOn, setIsPowerOn] = useState(true);
  const [fanSpeed, setFanSpeed] = useState([3]);
  const [autoMode, setAutoMode] = useState(true);
  const [silentMode, setSilentMode] = useState(false);
  const [isSchedulingOn, setIsSchedulingOn] = useState(true);
  const [startTime, setStartTime] = useState("22:00");
  const [endTime, setEndTime] = useState("06:00");
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

  const handleEcoModeToggle = () => {
    setEcoMode(!ecoMode);
    toast.success(ecoMode ? "Eco mode disabled" : "Eco mode enabled");
  };

  const handleConfirmScheduling = () => {
    toast.success(`Scheduling confirmed from ${startTime} to ${endTime}`);
  };

  return (
    <div className={`${pageStyles.gradientWrapper} ${responsive.pagePadding}`}>
      <ThemeToggle />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={pageHeader.wrapper}
      >
        <h1 className={pageHeader.title}>Device Controls</h1>
        <p className={pageHeader.description}>
          Manage and configure your air quality device settings.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Primary Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Power Control */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-md shadow-elevated border-border/50 rounded-2xl h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Power className={`w-8 h-8 ${isPowerOn ? 'text-primary' : 'text-destructive'}`} />
                  <Switch checked={isPowerOn} onCheckedChange={handlePowerToggle} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Device Power</h3>
                <p className="text-sm text-muted-foreground">{isPowerOn ? 'Device is ON' : 'Device is OFF'}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Fan Speed */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-md shadow-elevated border-border/50 rounded-2xl h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Fan className="w-8 h-8 text-muted-foreground" />
                  <span className="text-2xl font-bold text-foreground">{fanSpeed[0]}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Fan Speed</h3>
                <Slider value={fanSpeed} onValueChange={setFanSpeed} max={5} min={1} step={1} className="w-full" />
              </CardContent>
            </Card>
          </motion.div>

          {/* Auto Mode */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-md shadow-elevated border-border/50 rounded-2xl h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Zap className={`w-8 h-8 ${autoMode ? 'text-warning' : 'text-muted-foreground'}`} />
                  <Switch checked={autoMode} onCheckedChange={handleAutoModeToggle} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Auto Mode</h3>
                <p className="text-sm text-muted-foreground">{autoMode ? 'Automatic control enabled' : 'Manual control'}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Silent Mode */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-md shadow-elevated border-border/50 rounded-2xl h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Moon className={`w-8 h-8 ${silentMode ? 'text-muted-foreground' : 'text-muted-foreground'}`} />
                  <Switch checked={silentMode} onCheckedChange={handleSilentModeToggle} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Silent Mode</h3>
                <p className="text-sm text-muted-foreground">{silentMode ? 'Quiet operation' : 'Normal operation'}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Eco Mode */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-md shadow-elevated border-border/50 rounded-2xl h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Leaf className={`w-8 h-8 ${ecoMode ? 'text-primary' : 'text-muted-foreground'}`} />
                  <Switch checked={ecoMode} onCheckedChange={handleEcoModeToggle} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Eco Mode</h3>
                <p className="text-sm text-muted-foreground">{ecoMode ? 'Energy saving enabled' : 'Standard mode'}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Scheduling Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-md shadow-elevated border-border/50 rounded-2xl">
            <CardHeader className="border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className={`w-6 h-6 ${isSchedulingOn ? 'text-muted-foreground' : 'text-muted-foreground'}`} />
                  <h2 className="text-xl font-semibold text-foreground">Scheduling</h2>
                </div>
                <Switch checked={isSchedulingOn} onCheckedChange={handleSchedulingToggle} />
              </div>
            </CardHeader>
            {isSchedulingOn && (
              <CardContent className="p-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="start-time" className="mb-2 block text-foreground font-medium">Start Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="start-time"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="bg-background border-border text-foreground pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="end-time" className="mb-2 block text-foreground font-medium">End Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="end-time"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="bg-background border-border text-foreground pl-10"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handleConfirmScheduling}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
                  >
                    Confirm Schedule
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>

        {/* Dev-only data simulator (hidden in production builds) */}
        {import.meta.env.DEV && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
            <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-md shadow-elevated border-amber-500/30 rounded-2xl">
              <CardHeader className="border-b border-border/50">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-3">
                  <Server className="w-6 h-6 text-amber-500" />
                  Data Simulator <span className="text-xs font-medium uppercase tracking-wider text-amber-500">Dev Only</span>
                </h2>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-6">
                  Inject randomized sensor data into your Firebase RTDB. Visible only in development.
                </p>
                <div className="flex gap-3">
                  <Button onClick={startFluctuation} className="bg-green-600 hover:bg-green-700 text-white">
                    Start Data
                  </Button>
                  <Button onClick={stopFluctuation} variant="destructive" className="bg-red-600 hover:bg-red-700">
                    Stop Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Controls;
