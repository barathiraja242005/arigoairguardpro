import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Bell, Smartphone, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const Settings = () => {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [appNotifications, setAppNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isPairing, setIsPairing] = useState(false);

  useEffect(() => {
    // Send notifications when enabled
    if (emailNotifications) {
      // Simulate sending email notification
      console.log("Email notifications enabled for:", "barathiraja242005@gmail.com");
    }
  }, [emailNotifications]);

  const handleSave = () => {
    // Save profile information
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    toast.success("Settings saved successfully!");
  };

  const handlePairDevice = async () => {
    setIsPairing(true);
    // Simulate device pairing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsPairing(false);
    toast.success("New device paired successfully!", {
      description: "Device AG-PRO-12348 has been connected"
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </motion.div>

      <div className="max-w-4xl space-y-6">
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Profile Information</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="device-id">Device ID</Label>
                <Input
                  id="device-id"
                  placeholder="AG-PRO-12345"
                  defaultValue="AG-PRO-12345"
                  className="mt-2"
                  disabled
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Notification Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Notifications</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Alerts sent to: barathiraja242005@gmail.com
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={(checked) => {
                    setEmailNotifications(checked);
                    toast.success(checked ? "Email notifications enabled" : "Email notifications disabled");
                  }}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive critical alerts via SMS
                  </p>
                </div>
                <Switch
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">App Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Push notifications in the app
                  </p>
                </div>
                <Switch
                  checked={appNotifications}
                  onCheckedChange={setAppNotifications}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Device Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Smartphone className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Device Management</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">AriGo AirGuard Pro</p>
                  <span className="px-3 py-1 rounded-full bg-aqi-good/20 text-aqi-good text-sm font-medium">
                    Connected
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Device ID: AG-PRO-12345
                </p>
                <p className="text-sm text-muted-foreground">
                  Last Sync: {new Date().toLocaleString()}
                </p>
              </div>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handlePairDevice}
                disabled={isPairing}
              >
                {isPairing ? "Pairing..." : "Pair New Device"}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              {darkMode ? (
                <Moon className="w-6 h-6 text-primary" />
              ) : (
                <Sun className="w-6 h-6 text-primary" />
              )}
              <h2 className="text-2xl font-semibold">Appearance</h2>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark theme
                </p>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
          </Card>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={handleSave}
            size="lg"
            className="w-full bg-gradient-primary hover:opacity-90"
          >
            Save Changes
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
