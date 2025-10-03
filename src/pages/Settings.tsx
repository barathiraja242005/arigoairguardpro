import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, Bell, Smartphone, Moon, Sun, Settings2, Shield, Palette } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const Settings = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [appNotifications, setAppNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isPairing, setIsPairing] = useState(false);
  const [pairDialogOpen, setPairDialogOpen] = useState(false);
  const [deviceCode, setDeviceCode] = useState("");
  const [pairedDevices, setPairedDevices] = useState<Array<{id: string, name: string, date: string}>>([]);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem("userName") || "John Doe";
    const savedEmail = localStorage.getItem("userEmail") || "barathiraja242005@gmail.com";
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    const savedEmailNotif = localStorage.getItem("emailNotifications") !== "false";
    const savedSmsNotif = localStorage.getItem("smsNotifications") === "true";
    const savedAppNotif = localStorage.getItem("appNotifications") !== "false";
    const savedDevices = localStorage.getItem("pairedDevices");
    
    setName(savedName);
    setEmail(savedEmail);
    setDarkMode(savedDarkMode);
    setEmailNotifications(savedEmailNotif);
    setSmsNotifications(savedSmsNotif);
    setAppNotifications(savedAppNotif);
    
    if (savedDevices) {
      setPairedDevices(JSON.parse(savedDevices));
    } else {
      setPairedDevices([
        { id: "AG-PRO-12345", name: "AriGo AirGuard Pro", date: new Date().toLocaleDateString() }
      ]);
    }
    
    // Apply dark mode
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Handle dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
      toast.success("Dark mode enabled");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
      toast.success("Light mode enabled");
    }
  }, [darkMode]);

  const handleSave = () => {
    // Save all settings
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("emailNotifications", String(emailNotifications));
    localStorage.setItem("smsNotifications", String(smsNotifications));
    localStorage.setItem("appNotifications", String(appNotifications));
    
    toast.success("Profile updated successfully!", {
      description: "Your changes have been saved"
    });
  };

  const handlePairDevice = async () => {
    if (!deviceCode || deviceCode.length < 8) {
      toast.error("Invalid device code", {
        description: "Please enter a valid 8-character device code"
      });
      return;
    }
    
    setIsPairing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newDevice = {
      id: deviceCode.toUpperCase(),
      name: "AriGo AirGuard Pro",
      date: new Date().toLocaleDateString()
    };
    
    const updatedDevices = [...pairedDevices, newDevice];
    setPairedDevices(updatedDevices);
    localStorage.setItem("pairedDevices", JSON.stringify(updatedDevices));
    
    setIsPairing(false);
    setPairDialogOpen(false);
    setDeviceCode("");
    
    toast.success("Device paired successfully!", {
      description: `${newDevice.id} has been connected`
    });
  };

  const handleRemoveDevice = (deviceId: string) => {
    const updatedDevices = pairedDevices.filter(d => d.id !== deviceId);
    setPairedDevices(updatedDevices);
    localStorage.setItem("pairedDevices", JSON.stringify(updatedDevices));
    toast.success("Device removed");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-primary/20">
            <Settings2 className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Customize your experience and manage preferences
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-5xl"
      >
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">Devices</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="p-6 backdrop-blur-sm bg-card/50 border-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-primary/20">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">Profile Information</h2>
                  <p className="text-sm text-muted-foreground">Update your personal details</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base font-medium">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-medium">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="device-id" className="text-base font-medium">Primary Device ID</Label>
                  <Input
                    id="device-id"
                    value={pairedDevices[0]?.id || "AG-PRO-12345"}
                    className="h-12 font-mono"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">This is your main connected device</p>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    onClick={handleSave}
                    size="lg"
                    className="w-full h-12 bg-gradient-primary hover:opacity-90 text-base font-semibold"
                  >
                    Save Profile Changes
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="p-6 backdrop-blur-sm bg-card/50 border-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-primary/20">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">Notification Preferences</h2>
                  <p className="text-sm text-muted-foreground">Choose how you want to be notified</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-base">Email Notifications</p>
                        <Shield className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Alerts sent to: <span className="font-medium text-foreground">{email}</span>
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                      className="ml-4"
                    />
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-muted/50 border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-base mb-1">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive critical alerts via text message
                      </p>
                    </div>
                    <Switch
                      checked={smsNotifications}
                      onCheckedChange={setSmsNotifications}
                    />
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-muted/50 border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-base mb-1">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        In-app alerts and updates
                      </p>
                    </div>
                    <Switch
                      checked={appNotifications}
                      onCheckedChange={setAppNotifications}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Devices Tab */}
          <TabsContent value="devices">
            <Card className="p-6 backdrop-blur-sm bg-card/50 border-2">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-primary/20">
                    <Smartphone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold">Device Management</h2>
                    <p className="text-sm text-muted-foreground">Manage your connected devices</p>
                  </div>
                </div>
                
                <Dialog open={pairDialogOpen} onOpenChange={setPairDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90">
                      <Smartphone className="w-4 h-4 mr-2" />
                      Add Device
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Pair New Device</DialogTitle>
                      <DialogDescription>
                        Enter the 8-character device code found on your AriGo device
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="device-code">Device Code</Label>
                        <Input
                          id="device-code"
                          placeholder="AG-PRO-XXXX"
                          value={deviceCode}
                          onChange={(e) => setDeviceCode(e.target.value.toUpperCase())}
                          maxLength={12}
                          className="font-mono text-lg"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setPairDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handlePairDevice}
                        disabled={isPairing}
                      >
                        {isPairing ? "Pairing..." : "Pair Device"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="space-y-4">
                {pairedDevices.map((device, index) => (
                  <motion.div
                    key={device.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-5 rounded-xl border-2 border-border bg-gradient-to-r from-card to-muted/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-primary/20">
                          <Smartphone className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-lg">{device.name}</p>
                          <p className="text-sm text-muted-foreground font-mono">
                            ID: {device.id}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Paired on: {device.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-4 py-2 rounded-full bg-aqi-good/20 text-aqi-good text-sm font-semibold">
                          Connected
                        </span>
                        {pairedDevices.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveDevice(device.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card className="p-6 backdrop-blur-sm bg-card/50 border-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-primary/20">
                  {darkMode ? (
                    <Moon className="w-6 h-6 text-primary" />
                  ) : (
                    <Sun className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">Appearance Settings</h2>
                  <p className="text-sm text-muted-foreground">Customize the look and feel</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-4 rounded-full bg-card">
                        {darkMode ? (
                          <Moon className="w-8 h-8 text-primary" />
                        ) : (
                          <Sun className="w-8 h-8 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-lg mb-1">
                          {darkMode ? "Dark Mode" : "Light Mode"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {darkMode 
                            ? "Easier on the eyes in low light" 
                            : "Bright and clear for daytime use"
                          }
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                      className="scale-125"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border-2 border-border text-center">
                    <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                    <p className="font-medium">Light Theme</p>
                    <p className="text-xs text-muted-foreground mt-1">Default mode</p>
                  </div>
                  <div className="p-4 rounded-lg border-2 border-border text-center">
                    <Moon className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                    <p className="font-medium">Dark Theme</p>
                    <p className="text-xs text-muted-foreground mt-1">Night mode</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Settings;
