import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Power, Fan, Moon, Zap } from "lucide-react";
import { toast } from "sonner";

const Controls = () => {
  const [isPowerOn, setIsPowerOn] = useState(true);
  const [fanSpeed, setFanSpeed] = useState([3]);
  const [autoMode, setAutoMode] = useState(true);
  const [silentMode, setSilentMode] = useState(false);

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

  return (
    <div className="min-h-screen bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Device Controls</h1>
        <p className="text-muted-foreground">
          Remote control and configuration
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
        {/* Power Control */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${isPowerOn ? 'bg-primary/20' : 'bg-muted'}`}>
                  <Power className={`w-6 h-6 ${isPowerOn ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <h3 className="font-semibold">Power</h3>
                  <p className="text-sm text-muted-foreground">
                    {isPowerOn ? "Device is ON" : "Device is OFF"}
                  </p>
                </div>
              </div>
              <Switch checked={isPowerOn} onCheckedChange={handlePowerToggle} />
            </div>
            {isPowerOn && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-lg bg-primary/10 border border-primary/20"
              >
                <p className="text-sm text-center animate-pulse-glow">
                  Device Running
                </p>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Fan Speed Control */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-secondary/20">
                <motion.div
                  animate={{ rotate: fanSpeed[0] * 72 }}
                  transition={{ duration: 0.3 }}
                >
                  <Fan className="w-6 h-6 text-secondary" />
                </motion.div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Fan Speed</h3>
                <p className="text-sm text-muted-foreground">Level {fanSpeed[0]}</p>
              </div>
            </div>
            <Slider
              value={fanSpeed}
              onValueChange={setFanSpeed}
              max={5}
              min={1}
              step={1}
              className="mb-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </Card>
        </motion.div>

        {/* Auto Mode */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${autoMode ? 'bg-accent/20' : 'bg-muted'}`}>
                  <Zap className={`w-6 h-6 ${autoMode ? 'text-accent' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <h3 className="font-semibold">Auto Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    {autoMode ? "Adaptive ON" : "Manual Mode"}
                  </p>
                </div>
              </div>
              <Switch checked={autoMode} onCheckedChange={handleAutoModeToggle} />
            </div>
            {autoMode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-lg bg-accent/10 border border-accent/20"
              >
                <p className="text-sm text-center">
                  Smart mode active - adjusting based on AQI
                </p>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Silent Mode */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${silentMode ? 'bg-muted' : 'bg-muted'}`}>
                  <Moon className={`w-6 h-6 ${silentMode ? 'text-foreground' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <h3 className="font-semibold">Silent Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    {silentMode ? "Night mode ON" : "Normal operation"}
                  </p>
                </div>
              </div>
              <Switch checked={silentMode} onCheckedChange={handleSilentModeToggle} />
            </div>
            {silentMode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-lg bg-muted border border-border"
              >
                <p className="text-sm text-center">
                  Quiet operation - reduced fan noise
                </p>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Status Summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="md:col-span-2"
        >
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Current Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">Power</p>
                <p className="font-semibold">{isPowerOn ? "ON" : "OFF"}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">Fan Speed</p>
                <p className="font-semibold">Level {fanSpeed[0]}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">Mode</p>
                <p className="font-semibold">{autoMode ? "Auto" : "Manual"}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">Noise Level</p>
                <p className="font-semibold">{silentMode ? "Silent" : "Normal"}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Controls;
