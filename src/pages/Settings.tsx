import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ref, set, get, remove } from "firebase/database";
import {
  User,
  Bell,
  Smartphone,
  Moon,
  Sun,
  Monitor,
  Palette,
  LogOut,
  CheckCircle,
  XCircle,
  Loader2,
  ShieldAlert,
  Mail,
  MessageSquare,
  PhoneCall,
  Plus,
  Trash2,
  CircleDot,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { database } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { pageStyles, pageHeader, responsive } from "@/lib/design-system";

interface PairedDevice {
  id: string;
  name: string;
  date: string;
  status: string;
}

const Settings = () => {
  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const userId = session?.role === "device" ? session.deviceId : "ARIGO_001";

  // ─── Profile state ───
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [originalProfile, setOriginalProfile] = useState({ name: "", email: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // ─── Notifications state ───
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [appNotifications, setAppNotifications] = useState(true);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>("default");

  // ─── Devices state ───
  const [pairedDevices, setPairedDevices] = useState<PairedDevice[]>([]);
  const [pairDialogOpen, setPairDialogOpen] = useState(false);
  const [deviceCode, setDeviceCode] = useState("");
  const [isPairing, setIsPairing] = useState(false);

  // ─── Diagnostics ───
  const [isTestingAlertCall, setIsTestingAlertCall] = useState(false);

  // ─── Danger zone confirmation ───
  const [confirmReset, setConfirmReset] = useState(false);

  const isDirty = useMemo(
    () => name.trim() !== originalProfile.name || email.trim() !== originalProfile.email,
    [name, email, originalProfile],
  );

  const isEmailValid = email.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ─── Load on mount ───
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const profSnap = await get(ref(database, `users/${userId}/profile`));
        const initialName = profSnap.exists() ? profSnap.val().name || "" : localStorage.getItem("userName") || "";
        const initialEmail = profSnap.exists() ? profSnap.val().email || "" : localStorage.getItem("userEmail") || "";
        setName(initialName);
        setEmail(initialEmail);
        setOriginalProfile({ name: initialName, email: initialEmail });

        const notifSnap = await get(ref(database, `users/${userId}/notifications`));
        if (notifSnap.exists()) {
          const n = notifSnap.val();
          setEmailNotifications(n.email ?? true);
          setSmsNotifications(n.sms ?? false);
          setAppNotifications(n.push ?? true);
        }

        const devSnap = await get(ref(database, `users/${userId}/devices`));
        if (devSnap.exists()) {
          const obj = devSnap.val() as Record<string, { name: string; date: string; status: string }>;
          setPairedDevices(Object.entries(obj).map(([id, d]) => ({ id, ...d })));
        } else {
          setPairedDevices([
            { id: userId, name: "AriGo AirGuard Pro", date: new Date().toLocaleDateString(), status: "Connected" },
          ]);
        }
      } catch {
        const fallbackName = localStorage.getItem("userName") || "";
        const fallbackEmail = localStorage.getItem("userEmail") || "";
        setName(fallbackName);
        setEmail(fallbackEmail);
        setOriginalProfile({ name: fallbackName, email: fallbackEmail });
      }

      if ("Notification" in window) {
        setPushPermission(Notification.permission);
      }
    };

    void loadSettings();
  }, [userId]);

  // ─── Profile save ───
  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    if (!isEmailValid || !email.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSaving(true);
    try {
      await set(ref(database, `users/${userId}/profile`), { name: name.trim(), email: email.trim() });
      localStorage.setItem("userName", name.trim());
      localStorage.setItem("userEmail", email.trim());
      setOriginalProfile({ name: name.trim(), email: email.trim() });
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2200);
    } catch {
      localStorage.setItem("userName", name.trim());
      localStorage.setItem("userEmail", email.trim());
      setOriginalProfile({ name: name.trim(), email: email.trim() });
      toast.success("Saved locally — cloud sync unavailable");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetProfile = () => {
    setName(originalProfile.name);
    setEmail(originalProfile.email);
  };

  // ─── Notification toggles (auto-save) ───
  const persistNotif = async (key: "email" | "sms" | "push", value: boolean) => {
    try {
      await set(ref(database, `users/${userId}/notifications/${key}`), value);
    } catch {
      localStorage.setItem(`${key}Notifications`, String(value));
    }
  };

  const handleEmailToggle = (v: boolean) => {
    setEmailNotifications(v);
    void persistNotif("email", v);
  };

  const handleSmsToggle = (v: boolean) => {
    setSmsNotifications(v);
    void persistNotif("sms", v);
  };

  const handlePushToggle = async (enabled: boolean) => {
    if (!enabled) {
      setAppNotifications(false);
      await persistNotif("push", false);
      return;
    }
    if (!("Notification" in window)) {
      toast.error("Push notifications not supported in this browser");
      return;
    }
    if (Notification.permission === "denied") {
      toast.error("Push notifications blocked — enable in browser settings");
      return;
    }
    const perm = await Notification.requestPermission();
    setPushPermission(perm);
    if (perm === "granted") {
      setAppNotifications(true);
      await persistNotif("push", true);
      new Notification("AriGo Air Guard Pro", {
        body: "Push notifications enabled. You'll be alerted on AQI changes.",
        icon: "/favicon.ico",
      });
    } else {
      setAppNotifications(false);
    }
  };

  // ─── Devices ───
  const handlePairDevice = async () => {
    const code = deviceCode.trim().toUpperCase();
    if (code.length < 8) {
      toast.error("Invalid device code", { description: "Format: AG-PRO-XXXX" });
      return;
    }
    if (pairedDevices.find((d) => d.id === code)) {
      toast.error("Device already paired");
      return;
    }
    setIsPairing(true);
    try {
      const snap = await get(ref(database, `devices/${code}`));
      const deviceName = snap.exists() && snap.val().name ? snap.val().name : "AriGo AirGuard Pro";
      const newDevice: PairedDevice = {
        id: code,
        name: deviceName,
        date: new Date().toLocaleDateString(),
        status: "Connected",
      };
      await set(ref(database, `users/${userId}/devices/${code}`), {
        name: newDevice.name,
        date: newDevice.date,
        status: "Connected",
      });
      setPairedDevices((prev) => [...prev, newDevice]);
      setPairDialogOpen(false);
      setDeviceCode("");
      toast.success(`${code} paired successfully`);
    } catch {
      toast.error("Could not reach the cloud", { description: "Check your internet connection" });
    } finally {
      setIsPairing(false);
    }
  };

  const handleRemoveDevice = async (id: string) => {
    if (pairedDevices.length === 1) {
      toast.error("Keep at least one paired device");
      return;
    }
    try {
      await remove(ref(database, `users/${userId}/devices/${id}`));
    } catch {
      /* ignore */
    }
    setPairedDevices((prev) => prev.filter((d) => d.id !== id));
    toast.success("Device removed");
  };

  // ─── Diagnostic test call ───
  const handleTestAlertCall = async () => {
    setIsTestingAlertCall(true);
    const id = userId;
    const latestRef = ref(database, `airguard_devices/${id}/latest_reading`);
    const metaRef = ref(database, `airguard_devices/${id}/alerts/aqi_over_50`);
    const testId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const nowIso = () => new Date().toISOString();
    try {
      await set(latestRef, { "After aqi": 45, recorded_at: nowIso(), __test_alert: true, __test_id: testId });
      await new Promise((r) => setTimeout(r, 500));
      await set(latestRef, { "After aqi": 55, recorded_at: nowIso(), __test_alert: true, __test_id: testId });

      const deadline = Date.now() + 25_000;
      let lastSid: string | undefined;
      while (Date.now() < deadline) {
        const snap = await get(metaRef);
        const meta = snap.exists() ? (snap.val() as { last_test_id?: string; last_call_sid?: string }) : null;
        if (meta?.last_test_id === testId) {
          lastSid = meta.last_call_sid;
          break;
        }
        await new Promise((r) => setTimeout(r, 1000));
      }

      toast.success("Test alert triggered", {
        description: lastSid
          ? `Call SID: ${lastSid}`
          : "If no call, check function logs (cooldown or Twilio).",
      });
    } catch (err) {
      toast.error("Failed to trigger test alert", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setIsTestingAlertCall(false);
    }
  };

  // ─── Danger zone ───
  const handleResetPairings = async () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 5000);
      return;
    }
    try {
      await remove(ref(database, `users/${userId}/devices`));
    } catch {
      /* ignore */
    }
    setPairedDevices([]);
    toast.success("All device pairings cleared");
    setConfirmReset(false);
  };

  const handleLogout = () => {
    signOut();
    toast.success("Signed out");
    navigate("/");
  };

  const themeOptions = [
    { key: "light", label: "Light", icon: Sun },
    { key: "dark", label: "Dark", icon: Moon },
    { key: "system", label: "System", icon: Monitor },
  ] as const;

  const userInitials =
    name
      .split(" ")
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || userId.slice(0, 2);

  return (
    <div className={`${pageStyles.gradientWrapper} ${responsive.pagePadding}`}>
      <ThemeToggle />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={pageHeader.wrapper}
      >
        <h1 className={pageHeader.title}>Settings</h1>
        <p className={pageHeader.description}>
          Manage your AriGo profile, notifications, and devices.
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="profile" className="space-y-5">
          <TabsList className="w-full overflow-x-auto justify-start no-scrollbar">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="devices" className="gap-2">
              <Smartphone className="w-4 h-4" />
              <span>Devices</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="w-4 h-4" />
              <span>Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Account</span>
            </TabsTrigger>
          </TabsList>

          {/* ─────────── Profile ─────────── */}
          <TabsContent value="profile">
            <Card className="border-border/60 shadow-card">
              <CardHeader className="border-b border-border/50">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                    {userInitials}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Profile</h2>
                    <p className="text-xs text-muted-foreground">
                      Device <span className="font-mono text-foreground/80">{userId}</span>
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider">
                      Full name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={!isEmailValid}
                      className={!isEmailValid ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {!isEmailValid && (
                      <p className="text-xs text-destructive">Please enter a valid email.</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    {justSaved ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-primary" />
                        <span className="text-primary font-medium">Saved</span>
                      </>
                    ) : isDirty ? (
                      <>
                        <CircleDot className="w-3.5 h-3.5 text-warning" />
                        <span>Unsaved changes</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-muted-foreground/50" />
                        <span>Up to date</span>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {isDirty && (
                      <Button variant="ghost" size="sm" onClick={handleResetProfile} disabled={isSaving}>
                        Reset
                      </Button>
                    )}
                    <Button
                      onClick={handleSaveProfile}
                      disabled={!isDirty || isSaving || !isEmailValid}
                      size="sm"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving…
                        </>
                      ) : (
                        "Save changes"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─────────── Notifications ─────────── */}
          <TabsContent value="notifications">
            <Card className="border-border/60 shadow-card">
              <CardHeader className="border-b border-border/50">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
                    <p className="text-xs text-muted-foreground">Where to send AQI alerts</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                {pushPermission === "denied" && (
                  <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
                    <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Push notifications blocked</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Enable notifications in your browser settings, then reload this page.
                      </p>
                    </div>
                  </div>
                )}

                <NotificationRow
                  icon={Mail}
                  title="Email"
                  description={email ? `Sent to ${email}` : "Add an email in Profile to enable"}
                  checked={emailNotifications}
                  onCheckedChange={handleEmailToggle}
                  disabled={!email}
                />
                <NotificationRow
                  icon={MessageSquare}
                  title="SMS"
                  description="Critical alerts via text message"
                  checked={smsNotifications}
                  onCheckedChange={handleSmsToggle}
                />
                <NotificationRow
                  icon={Bell}
                  title="Push"
                  description={
                    pushPermission === "granted"
                      ? "Browser push notifications active"
                      : pushPermission === "denied"
                      ? "Blocked — enable in browser settings"
                      : "Tap to request browser permission"
                  }
                  status={
                    pushPermission === "granted"
                      ? { label: "Allowed", tone: "success" }
                      : pushPermission === "denied"
                      ? { label: "Blocked", tone: "destructive" }
                      : undefined
                  }
                  checked={appNotifications && pushPermission === "granted"}
                  onCheckedChange={handlePushToggle}
                  disabled={pushPermission === "denied"}
                />

                <div className="pt-3 mt-2 border-t border-border/50">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <PhoneCall className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Test alert call</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Triggers the AQI-over-50 cloud function to verify your Twilio number.
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleTestAlertCall}
                      disabled={isTestingAlertCall}
                      size="sm"
                      variant="outline"
                      className="shrink-0"
                    >
                      {isTestingAlertCall ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                          Testing…
                        </>
                      ) : (
                        "Test call"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─────────── Devices ─────────── */}
          <TabsContent value="devices">
            <Card className="border-border/60 shadow-card">
              <CardHeader className="border-b border-border/50">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Connected Devices</h2>
                      <p className="text-xs text-muted-foreground">
                        {pairedDevices.length} {pairedDevices.length === 1 ? "device" : "devices"} paired
                      </p>
                    </div>
                  </div>
                  <Dialog open={pairDialogOpen} onOpenChange={setPairDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-1.5" />
                        Add device
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Pair a new device</DialogTitle>
                        <DialogDescription>
                          Enter the code from the back of your AriGo device (e.g.{" "}
                          <span className="font-mono">AG-PRO-XXXX</span>).
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-3">
                        <Label htmlFor="device-code" className="text-xs font-semibold uppercase tracking-wider mb-2 block">
                          Device code
                        </Label>
                        <Input
                          id="device-code"
                          placeholder="AG-PRO-XXXX"
                          value={deviceCode}
                          onChange={(e) => setDeviceCode(e.target.value.toUpperCase())}
                          maxLength={12}
                          className="font-mono"
                          disabled={isPairing}
                          autoFocus
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setPairDialogOpen(false);
                            setDeviceCode("");
                          }}
                          disabled={isPairing}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handlePairDevice} disabled={isPairing || deviceCode.length < 8}>
                          {isPairing ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Verifying…
                            </>
                          ) : (
                            "Pair device"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-2">
                {pairedDevices.length === 0 ? (
                  <div className="text-center py-12 text-sm text-muted-foreground">
                    <Smartphone className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>No devices paired yet.</p>
                    <p className="text-xs mt-1">
                      Click <span className="font-medium">Add device</span> to get started.
                    </p>
                  </div>
                ) : (
                  pairedDevices.map((device, index) => (
                    <motion.div
                      key={device.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border/60 p-3 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <Smartphone className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{device.name}</p>
                          <p className="text-[11px] font-mono text-muted-foreground truncate">{device.id}</p>
                          <p className="text-[10px] text-muted-foreground">Paired {device.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          {device.status || "Connected"}
                        </span>
                        {pairedDevices.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveDevice(device.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─────────── Appearance ─────────── */}
          <TabsContent value="appearance">
            <Card className="border-border/60 shadow-card">
              <CardHeader className="border-b border-border/50">
                <div className="flex items-center gap-3">
                  <Palette className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
                    <p className="text-xs text-muted-foreground">Customise how AriGo looks</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <Label className="text-xs font-semibold uppercase tracking-wider mb-3 block">
                  Theme
                </Label>
                <div className="grid grid-cols-3 gap-2 max-w-md">
                  {themeOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isActive = (theme ?? "system") === opt.key;
                    return (
                      <button
                        key={opt.key}
                        onClick={() => setTheme(opt.key)}
                        className={`flex flex-col items-center gap-2 rounded-lg border py-4 transition-all ${
                          isActive
                            ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                            : "border-border hover:border-border/80 hover:bg-muted/40"
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                        <span className={`text-sm font-medium ${isActive ? "text-primary" : "text-foreground"}`}>
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  System matches your OS setting and switches automatically.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─────────── Account ─────────── */}
          <TabsContent value="account">
            <div className="space-y-5">
              <Card className="border-border/60 shadow-card">
                <CardHeader className="border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Account</h2>
                      <p className="text-xs text-muted-foreground">Sign out or manage advanced settings</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Signed in as
                      </p>
                      <p className="font-medium text-foreground truncate">{name || "Unnamed user"}</p>
                      <p className="text-xs text-muted-foreground truncate">{email || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Active device
                      </p>
                      <p className="font-mono text-sm text-foreground">{userId}</p>
                      <p className="text-xs text-muted-foreground">
                        {pairedDevices.length} paired{" "}
                        {pairedDevices.length === 1 ? "device" : "devices"}
                      </p>
                    </div>
                  </div>

                  <Button onClick={handleLogout} variant="outline" className="w-full">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </Button>
                </CardContent>
              </Card>

              {/* Danger zone */}
              <Card className="border-destructive/30">
                <CardHeader className="border-b border-destructive/30">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-destructive" />
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Danger zone</h2>
                      <p className="text-xs text-muted-foreground">Irreversible actions</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">Reset all device pairings</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Removes every paired device from your account. You'll need to pair again to reconnect.
                      </p>
                    </div>
                    <Button
                      onClick={handleResetPairings}
                      variant={confirmReset ? "destructive" : "outline"}
                      size="sm"
                      className="shrink-0"
                    >
                      {confirmReset ? "Click again to confirm" : "Reset"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface NotificationRowProps {
  icon: typeof Mail;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  disabled?: boolean;
  status?: { label: string; tone: "success" | "destructive" };
}

const NotificationRow = ({
  icon: Icon,
  title,
  description,
  checked,
  onCheckedChange,
  disabled,
  status,
}: NotificationRowProps) => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 p-3 hover:bg-muted/30 transition-colors">
      <div className="flex items-start gap-3 min-w-0">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">{title}</p>
            {status && (
              <span
                className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                  status.tone === "success"
                    ? "bg-primary/10 text-primary"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {status.label}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </div>
  );
};

export default Settings;
