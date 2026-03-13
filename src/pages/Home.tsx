import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, PerspectiveCamera } from "@react-three/drei";
import Device3D from "@/components/home/Device3D";
import { useToast } from "@/hooks/use-toast";
import {
  Wind,
  Shield,
  Leaf,
  Gauge,
  Battery,
  Smartphone,
  Ruler,
  Weight,
  AlertTriangle,
  Heart,
  LogIn,
  Lock,
  Sun,
  Moon,
} from "lucide-react";
import {
  pageStyles,
  darkModeToggle,
  buttonStyles,
  formStyles,
} from "@/lib/design-system";

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  // Dummy credentials
  const DUMMY_CREDENTIALS = {
    deviceId: "ARIGO2024",
    password: "airguard123"
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (deviceId === DUMMY_CREDENTIALS.deviceId && password === DUMMY_CREDENTIALS.password) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("deviceId", deviceId);
      
      toast({
        title: "Login Successful",
        description: `Connected to device ${deviceId}`,
      });
      
      setIsLoginOpen(false);
      navigate("/dashboard");
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid device ID or password",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const specifications = [
    { icon: Ruler, label: "Height", value: "17 cm", detail: "~6.69 inches" },
    { icon: Ruler, label: "Width", value: "7 cm", detail: "~2.7 inches" },
    { icon: Ruler, label: "Depth", value: "5 cm", detail: "~1.97 inches" },
    { icon: Weight, label: "Weight", value: "512 g", detail: "Lightweight" },
  ];

  const features = [
    {
      icon: Shield,
      title: "3-Stage Filtration",
      description: "Pre-filter + HEPA + Activated Carbon for maximum protection",
    },
    {
      icon: Wind,
      title: "Real-Time Monitoring",
      description: "Track PM1.0, PM2.5, PM10, CO₂, SO₂, NO₂, VOCs instantly",
    },
    {
      icon: Leaf,
      title: "Eco-Friendly",
      description: "Converts pollutants to useful fertilizer byproducts",
    },
    {
      icon: Battery,
      title: "Long Battery Life",
      description: "Up to 8 hours of continuous operation",
    },
    {
      icon: Gauge,
      title: "Smart Auto Mode",
      description: "Adapts fan speed based on real-time air quality",
    },
    {
      icon: Smartphone,
      title: "IoT Connected",
      description: "Control and monitor from anywhere via mobile app",
    },
  ];

  const keyStats = [
    { value: "99.97%", label: "Filtration", valueClass: "text-primary" },
    { value: "8 hrs", label: "Battery", valueClass: "text-secondary" },
    { value: "500g", label: "Weight", valueClass: "text-earth-olive" },
  ];

  return (
    <div className={`${pageStyles.wrapper} relative overflow-hidden`}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className={darkModeToggle.wrapper}>
        <Button
          size="icon"
          variant="outline"
          onClick={() => setDarkMode(!darkMode)}
          className={darkModeToggle.button}
        >
          {darkMode ? <Sun className={darkModeToggle.iconClass} /> : <Moon className={darkModeToggle.iconClass} />}
        </Button>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-14 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 backdrop-blur-sm"
              >
                <Wind className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Portable Air Purifier</span>
              </motion.div>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold mb-4 leading-[1.05] tracking-tight">
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  AriGo
                </span>
                <br />
                <span className="text-foreground">AirGuard Pro</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-2">
                Keep Breathing Safe, Anywhere You Go
              </p>
              <p className="text-base md:text-lg text-muted-foreground max-w-xl">
                Compact, powerful, and intelligent air purification in the palm of your hand
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className={`${buttonStyles.heroGradient} px-8 h-11 rounded-xl group`}
                  >
                    <LogIn className="mr-2 w-4 h-4" />
                    Device Login
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-card">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-primary" />
                      Connect Your Device
                    </DialogTitle>
                    <DialogDescription>
                      Enter your device credentials to access the dashboard
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleLogin} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="deviceId">Device ID</Label>
                      <Input
                        id="deviceId"
                        placeholder="Enter device ID"
                        value={deviceId}
                        onChange={(e) => setDeviceId(e.target.value)}
                        disabled={isLoading}
                        required
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        required
                        className="bg-background"
                      />
                    </div>
                    <div className={formStyles.demoCredentials}>
                      <strong>Demo Credentials:</strong><br />
                      Device ID: ARIGO2024<br />
                      Password: airguard123
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Connecting..." : "Connect Device"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Button
                size="lg"
                variant="outline"
                className="border-2 h-11 rounded-xl bg-card/70 backdrop-blur-sm"
                onClick={() => navigate("/admin-login")}
              >
                Admin Login
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 h-11 rounded-xl bg-card/70 backdrop-blur-sm"
                onClick={() => {
                  const element = document.getElementById('features');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn More
              </Button>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {keyStats.map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-2xl bg-card/70 backdrop-blur-md border border-border/50 shadow-card hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className={`text-2xl font-bold mb-1 ${stat.valueClass}`}>{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right side - 3D Model */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[460px] lg:h-[580px]"
          >
            <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent rounded-3xl" />
            <div className="h-full rounded-3xl border border-border/50 bg-card/40 backdrop-blur-sm shadow-elevated overflow-hidden">
              <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  minPolarAngle={Math.PI / 4}
                  maxPolarAngle={Math.PI / 1.5}
                  autoRotate
                  autoRotateSpeed={0.5}
                />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                <Device3D />
                <Environment preset="city" />
              </Canvas>
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
              <p className="text-sm text-muted-foreground bg-card/60 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 shadow-card">
                Interactive 3D Model — Drag to rotate
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Specifications Section */}
      <div className="container mx-auto px-4 py-14 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 tracking-tight">
            Compact & Portable Design
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Engineered for maximum portability without compromising on performance.
            Fits perfectly in your bag, on your desk, or in your hand.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {specifications.map((spec, index) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 bg-card/80 backdrop-blur-sm border-border/50 rounded-2xl">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow/30">
                    <spec.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{spec.label}</h3>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {spec.value}
                  </div>
                  <p className="text-sm text-muted-foreground">{spec.detail}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div id="features" className="container mx-auto px-4 py-14 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 tracking-tight">
            Advanced Features
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Cutting-edge technology packed into a compact device
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 bg-card/80 backdrop-blur-sm border-border/50 group rounded-2xl">
                  <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Air Pollution Awareness Section */}
      <div className="bg-gradient-to-b from-muted/70 via-muted/60 to-background py-16 relative z-10 border-y border-border/40">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 mb-4">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span className="text-sm font-medium">Global Health Crisis</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                The Air Pollution Challenge
              </h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Air pollution is one of the greatest environmental threats to human health,
                affecting billions of people worldwide. Understanding the problem is the first
                step toward breathing cleaner air.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                {
                  stat: "7M+",
                  label: "Deaths Annually",
                  description: "Premature deaths caused by air pollution worldwide",
                  colorClass: "text-destructive",
                },
                {
                  stat: "91%",
                  label: "Population Affected",
                  description: "Of world's population breathes polluted air",
                  colorClass: "text-warning",
                },
                {
                  stat: "$8.1T",
                  label: "Economic Cost",
                  description: "Annual global cost of air pollution damages",
                  colorClass: "text-warning",
                },
                {
                  stat: "99%",
                  label: "WHO Guideline",
                  description: "Of cities exceed WHO air quality guidelines",
                  colorClass: "text-destructive",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.stat}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 text-center h-full bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300 rounded-2xl">
                    <div className={`text-4xl font-bold mb-2 ${item.colorClass}`}>
                      {item.stat}
                    </div>
                    <h4 className="font-semibold mb-2">{item.label}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Heart,
                  title: "Health Impact",
                  description: "Air pollution causes respiratory diseases, heart conditions, strokes, and reduces life expectancy significantly.",
                },
                {
                  icon: AlertTriangle,
                  title: "Major Pollutants",
                  description: "PM2.5, PM10, CO, NO₂, SO₂, and O₃ are primary air pollutants affecting human health and environment.",
                },
                {
                  icon: Shield,
                  title: "Our Solution",
                  description: "AriGo AirGuard Pro provides personal protection with real-time monitoring and advanced 3-stage filtration.",
                },
              ].map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full bg-card/60 backdrop-blur-md border-border/50 hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300 rounded-2xl">
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {info.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}

    </div>
  );
};

export default Home;
