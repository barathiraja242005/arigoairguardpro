import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Wifi, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DemoBadge from "@/components/ui/DemoBadge";
import { useToast } from "@/hooks/use-toast";
import { authenticateDevice, DEMO_DEVICE, DEMO_MODE_ENABLED } from "@/lib/demoAuth";
import { useAuth } from "@/contexts/AuthContext";
import { pageStyles } from "@/lib/design-system";

const loginSchema = z.object({
  deviceId: z.string()
    .trim()
    .min(6, { message: "Device ID must be at least 6 characters" })
    .max(50, { message: "Device ID must be less than 50 characters" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password must be less than 100 characters" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, signInDevice } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.role === "device") {
      navigate("/dashboard", { replace: true });
    }
  }, [session, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      deviceId: DEMO_MODE_ENABLED ? DEMO_DEVICE.id : "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const result = authenticateDevice(data.deviceId, data.password);
    if (result.ok && result.deviceId) {
      signInDevice(result.deviceId);
      toast({
        title: "Device Connected",
        description: `Successfully connected to device ${result.deviceId}`,
      });
      navigate("/dashboard", { replace: true });
    } else {
      toast({
        title: "Connection Failed",
        description: DEMO_MODE_ENABLED
          ? `Try ${DEMO_DEVICE.id} / ${DEMO_DEVICE.password}`
          : "Invalid device ID or password",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className={pageStyles.centeredWrapper}>
      <div className="w-full max-w-md">
        <div className="text-center mb-6 space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            AriGo AirGuard Pro
          </h1>
          <p className="text-muted-foreground">Connect your device to start monitoring</p>
          <div className="flex justify-center pt-1">
            <DemoBadge />
          </div>
        </div>

        <Card className="border-primary/20 bg-card/80 backdrop-blur-md shadow-elevated">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Wifi className="h-6 w-6 text-primary" />
              Device Login
            </CardTitle>
            <CardDescription>Enter your device credentials to connect</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deviceId">Device ID</Label>
                <Input
                  id="deviceId"
                  placeholder="Enter your device ID"
                  {...register("deviceId")}
                  disabled={isLoading}
                />
                {errors.deviceId && (
                  <p className="text-sm text-destructive">{errors.deviceId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-9"
                    {...register("password")}
                    disabled={isLoading}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              {DEMO_MODE_ENABLED && (
                <div className="text-xs text-muted-foreground bg-primary/5 border border-primary/10 p-3 rounded-lg">
                  <strong className="text-primary">Demo Credentials:</strong><br />
                  Device ID: {DEMO_DEVICE.id}<br />
                  Password: {DEMO_DEVICE.password}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect Device"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
