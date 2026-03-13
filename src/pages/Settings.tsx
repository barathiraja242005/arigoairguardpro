import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, Bell, Smartphone, Moon, Sun, Palette, LogOut, CheckCircle, XCircle, Loader2, BellRing } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { database } from "@/lib/firebase";
import { ref, set, get, remove } from "firebase/database";
import {
  pageStyles,
  pageHeader,
  darkModeToggle,
  responsive,
} from "@/lib/design-system";

const Settings = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [appNotifications, setAppNotifications] = useState(true);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>("default");
  const [darkMode, setDarkMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPairing, setIsPairing] = useState(false);
  const [pairDialogOpen, setPairDialogOpen] = useState(false);
  const [deviceCode, setDeviceCode] = useState("");
  const [pairedDevices, setPairedDevices] = useState<Array<{id: string, name: string, date: string, status: string}>>([]);
  const isFirstRender = useRef(true);

  const userId = localStorage.getItem("deviceId") || "ARIGO2024";

  // Load settings from Firebase on mount (fallback to localStorage)
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const snapshot = await get(ref(database, `users/${userId}/profile`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          setName(data.name || "");
          setEmail(data.email || "");
        } else {
          setName(localStorage.getItem("userName") || "");
          setEmail(localStorage.getItem("userEmail") || "");
        }

        const notifSnap = await get(ref(database, `users/${userId}/notifications`));
        if (notifSnap.exists()) {
          const n = notifSnap.val();
          setEmailNotifications(n.email ?? true);
          setSmsNotifications(n.sms ?? false);
          setAppNotifications(n.push ?? true);
        } else {
          setEmailNotifications(localStorage.getItem("emailNotifications") !== "false");
          setSmsNotifications(localStorage.getItem("smsNotifications") === "true");
          setAppNotifications(localStorage.getItem("appNotifications") !== "false");
        }

        const devicesSnap = await get(ref(database, `users/${userId}/devices`));
        if (devicesSnap.exists()) {
          const devObj = devicesSnap.val() as Record<string, {name: string, date: string, status: string}>;
          setPairedDevices(Object.entries(devObj).map(([id, d]) => ({ id, ...d })));
        } else {
          const savedDevices = localStorage.getItem("pairedDevices");
          if (savedDevices) {
            const parsed = JSON.parse(savedDevices);
            setPairedDevices(parsed.map((d: {id: string, name: string, date: string}) => ({...d, status: "Connected"})));
          } else {
            setPairedDevices([
              { id: userId, name: "AriGo AirGuard Pro", date: new Date().toLocaleDateString(), status: "Connected" }
            ]);
          }
        }
      } catch {
        // Fallback to localStorage if Firebase unavailable
        setName(localStorage.getItem("userName") || "");
        setEmail(localStorage.getItem("userEmail") || "");
        setEmailNotifications(localStorage.getItem("emailNotifications") !== "false");
        setSmsNotifications(localStorage.getItem("smsNotifications") === "true");
        setAppNotifications(localStorage.getItem("appNotifications") !== "false");
        const savedDevices = localStorage.getItem("pairedDevices");
        if (savedDevices) {
          setPairedDevices(JSON.parse(savedDevices));
        } else {
          setPairedDevices([
            { id: userId, name: "AriGo AirGuard Pro", date: new Date().toLocaleDateString(), status: "Connected" }
          ]);
        }
      }

      // Push notification permission status
      if ("Notification" in window) {
        setPushPermission(Notification.permission);
      }

      // Apply dark mode
      const savedDarkMode = localStorage.getItem("darkMode") === "true";
      setDarkMode(savedDarkMode);
      if (savedDarkMode) document.documentElement.classList.add("dark");
    };

    loadSettings();
  }, [userId]);

  // Handle dark mode toggle (skip first render to avoid double toast)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
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

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSaving(true);
    try {
      // Save profile to Firebase
      await set(ref(database, `users/${userId}/profile`), { name: name.trim(), email: email.trim() });
      // Save notification prefs to Firebase
      await set(ref(database, `users/${userId}/notifications`), {
        email: emailNotifications,
        sms: smsNotifications,
        push: appNotifications,
      });

      // Also cache locally
      localStorage.setItem("userName", name.trim());
      localStorage.setItem("userEmail", email.trim());
      localStorage.setItem("emailNotifications", String(emailNotifications));
      localStorage.setItem("smsNotifications", String(smsNotifications));
      localStorage.setItem("appNotifications", String(appNotifications));

      toast.success("Settings saved to cloud!", { description: "Your profile and preferences are updated" });
    } catch {
      // Fallback to localStorage if Firebase fails
      localStorage.setItem("userName", name.trim());
      localStorage.setItem("userEmail", email.trim());
      toast.success("Settings saved locally", { description: "Cloud sync unavailable, saved on device" });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePushNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      if (!("Notification" in window)) {
        toast.error("Push notifications not supported in this browser");
        return;
      }

      if (Notification.permission === "denied") {
        toast.error("Push notifications blocked", {
          description: "Please allow notifications in your browser settings and reload"
        });
        return;
      }

      const permission = await Notification.requestPermission();
      setPushPermission(permission);

      if (permission === "granted") {
        setAppNotifications(true);
        // Send a real test notification
        new Notification("AriGo Air GuardPro", {
          body: "Push notifications are now enabled! You'll be alerted for AQI changes.",
          icon: "/favicon.ico",
        });
        toast.success("Push notifications enabled!");
        // Persist to Firebase
        try {
          await set(ref(database, `users/${userId}/notifications/push`), true);
        } catch { /* ignore */ }
      } else {
        setAppNotifications(false);
        toast.error("Push notifications denied by browser");
      }
    } else {
      setAppNotifications(false);
      setPushPermission("default");
      try {
        await set(ref(database, `users/${userId}/notifications/push`), false);
      } catch { /* ignore */ }
      toast.info("Push notifications disabled");
    }
  };

  const handleEmailToggle = async (enabled: boolean) => {
    setEmailNotifications(enabled);
    try {
      await set(ref(database, `users/${userId}/notifications/email`), enabled);
      toast.success(enabled ? "Email alerts enabled" : "Email alerts disabled", {
        description: enabled ? `Alerts will be sent to ${email || "your email"}` : "You won't receive email alerts"
      });
    } catch {
      localStorage.setItem("emailNotifications", String(enabled));
    }
  };

  const handleSmsToggle = async (enabled: boolean) => {
    setSmsNotifications(enabled);
    try {
      await set(ref(database, `users/${userId}/notifications/sms`), enabled);
      toast.success(enabled ? "SMS alerts enabled" : "SMS alerts disabled", {
        description: enabled ? "Critical alerts will be sent via SMS" : "SMS alerts turned off"
      });
    } catch {
      localStorage.setItem("smsNotifications", String(enabled));
    }
  };

  const handlePairDevice = async () => {
    const code = deviceCode.trim().toUpperCase();
    if (!code || code.length < 8) {
      toast.error("Invalid device code", {
        description: "Please enter a valid device code (e.g. AG-PRO-XXXX)"
      });
      return;
    }

    if (pairedDevices.find(d => d.id === code)) {
      toast.error("Device already paired", { description: "This device is already connected to your account" });
      return;
    }

    setIsPairing(true);
    try {
      // Check Firebase for valid device registration
      const deviceSnap = await get(ref(database, `devices/${code}`));

      let deviceName = "AriGo AirGuard Pro";
      if (deviceSnap.exists()) {
        const data = deviceSnap.val();
        deviceName = data.name || deviceName;
      }
      // We allow pairing regardless (device may not be pre-registered in DB)

      const newDevice = {
        id: code,
        name: deviceName,
        date: new Date().toLocaleDateString(),
        status: "Connected"
      };

      // Write pairing record to Firebase
      await set(ref(database, `users/${userId}/devices/${code}`), {
        name: newDevice.name,
        date: newDevice.date,
        status: "Connected"
      });

      const updatedDevices = [...pairedDevices, newDevice];
      setPairedDevices(updatedDevices);
      localStorage.setItem("pairedDevices", JSON.stringify(updatedDevices));

      setPairDialogOpen(false);
      setDeviceCode("");
      toast.success("Device paired successfully!", {
        description: `${code} is now connected to your account`
      });
    } catch {
      toast.error("Failed to pair device", {
        description: "Could not connect to cloud. Check your internet connection."
      });
    } finally {
      setIsPairing(false);
    }
  };

  const handleRemoveDevice = async (deviceId: string) => {
    if (pairedDevices.length === 1) {
      toast.error("Cannot remove last device", { description: "You must keep at least one device connected" });
      return;
    }
    try {
      await remove(ref(database, `users/${userId}/devices/${deviceId}`));
    } catch { /* ignore */ }
    const updatedDevices = pairedDevices.filter(d => d.id !== deviceId);
    setPairedDevices(updatedDevices);
    localStorage.setItem("pairedDevices", JSON.stringify(updatedDevices));
    toast.success("Device removed");
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("deviceId");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className={`${pageStyles.gradientWrapper} ${responsive.pagePadding}`}>
      {/* Dark Mode Toggle */}
      <div className={darkModeToggle.wrapper}>
        <button
          onClick={() => setDarkMode(!darkMode)}
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
        <h1 className={pageHeader.title}>Settings</h1>
        <p className={pageHeader.description}>Manage your preferences and account</p>
      </motion.div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-md shadow-elevated border-border/50 rounded-2xl">
            <CardHeader className="border-b border-border/50">
              <div className="flex items-center gap-3">
                <User className="w-6 h-6 text-blue-500" />
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Profile</h2>
                  <p className="text-sm text-muted-foreground">Update your personal details</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="name" className="text-foreground font-medium mb-2 block">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-foreground font-medium mb-2 block">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                {isSaving ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving to cloud...</>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-md shadow-elevated border-border/50 rounded-2xl">
            <CardHeader className="border-b border-border/50">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6 text-orange-500" />
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
                  <p className="text-sm text-muted-foreground">Choose how you want to be notified</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-background/50 transition-colors">
                <div>
                  <p className="font-medium text-foreground">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    {email ? `Alerts sent to: ${email}` : "Save your email to enable this"}
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={handleEmailToggle}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-background/50 transition-colors">
                <div>
                  <p className="font-medium text-foreground">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">Critical alerts via text message</p>
                </div>
                <Switch
                  checked={smsNotifications}
                  onCheckedChange={handleSmsToggle}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-background/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">Push Notifications</p>
                      {pushPermission === "granted" && (
                        <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                          <CheckCircle className="w-3.5 h-3.5" /> Allowed
                        </span>
                      )}
                      {pushPermission === "denied" && (
                        <span className="flex items-center gap-1 text-xs text-red-500 font-semibold">
                          <XCircle className="w-3.5 h-3.5" /> Blocked
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {pushPermission === "denied"
                        ? "Blocked — enable in browser settings"
                        : pushPermission === "granted"
                        ? "Browser push notifications active"
                        : "Click to request browser permission"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={appNotifications && pushPermission === "granted"}
                  onCheckedChange={handlePushNotificationToggle}
                  disabled={pushPermission === "denied"}
                />
              </div>

              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
                <BellRing className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Notification preferences are saved to the cloud and synced across your devices. Push notifications require browser permission.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Device Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-md shadow-elevated border-border/50 rounded-2xl">
            <CardHeader className="border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-6 h-6 text-green-500" />
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Connected Devices</h2>
                    <p className="text-sm text-muted-foreground">Manage your paired devices</p>
                  </div>
                </div>
                <Dialog open={pairDialogOpen} onOpenChange={setPairDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <Smartphone className="w-4 h-4 mr-2" />
                      Add Device
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Pair New Device</DialogTitle>
                      <DialogDescription>
                        Enter the device code from your AriGo device label (e.g. AG-PRO-XXXX). The device will be registered in the cloud.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="device-code" className="mb-2 block">Device Code</Label>
                        <Input
                          id="device-code"
                          placeholder="AG-PRO-XXXX"
                          value={deviceCode}
                          onChange={(e) => setDeviceCode(e.target.value.toUpperCase())}
                          maxLength={12}
                          className="font-mono text-lg"
                          disabled={isPairing}
                        />
                        <p className="text-xs text-muted-foreground mt-1.5">
                          Find the code on the back of your AriGo device or in the box.
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => { setPairDialogOpen(false); setDeviceCode(""); }} disabled={isPairing}>
                        Cancel
                      </Button>
                      <Button onClick={handlePairDevice} disabled={isPairing || deviceCode.length < 8}>
                        {isPairing ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying...</>
                        ) : (
                          "Pair Device"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              {pairedDevices.map((device, index) => (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg border border-border/50 flex items-center justify-between hover:bg-background/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Smartphone className="w-6 h-6 text-green-500" />
                    <div>
                      <p className="font-medium text-foreground">{device.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">ID: {device.id}</p>
                      <p className="text-xs text-muted-foreground">Paired: {device.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-600 text-xs font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {device.status || "Connected"}
                    </span>
                    {pairedDevices.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveDevice(device.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Appearance Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-md shadow-elevated border-border/50 rounded-2xl">
            <CardHeader className="border-b border-border/50">
              <div className="flex items-center gap-3">
                <Palette className="w-6 h-6 text-purple-500" />
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Appearance</h2>
                  <p className="text-sm text-muted-foreground">Customize the look and feel</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="p-4 rounded-lg border border-border/50 flex items-center justify-between hover:bg-background/50 transition-colors">
                <div className="flex items-center gap-4">
                  {darkMode ? (
                    <Moon className="w-6 h-6 text-purple-500" />
                  ) : (
                    <Sun className="w-6 h-6 text-yellow-500" />
                  )}
                  <div>
                    <p className="font-medium text-foreground">
                      {darkMode ? "Dark Mode" : "Light Mode"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {darkMode ? "Easier on the eyes in low light" : "Bright and clear for daytime"}
                    </p>
                  </div>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Logout Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 backdrop-blur-md shadow-elevated border-destructive/30 rounded-2xl">
            <CardHeader className="border-b border-destructive/30">
              <div className="flex items-center gap-3">
                <LogOut className="w-6 h-6 text-destructive" />
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Account</h2>
                  <p className="text-sm text-muted-foreground">Manage your account access</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="w-full h-11"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
