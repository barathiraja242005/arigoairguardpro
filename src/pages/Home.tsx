import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, PerspectiveCamera } from "@react-three/drei";
import Device3D, { type DevicePart } from "@/components/home/Device3D";
import ThemeToggle from "@/components/ui/ThemeToggle";
import DemoBadge from "@/components/ui/DemoBadge";
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
  Map as MapIcon,
  Activity,
  Power,
  X,
  Hand,
} from "lucide-react";
import { pageStyles, buttonStyles } from "@/lib/design-system";

const PART_INFO: Record<DevicePart, { title: string; subtitle: string; icon: typeof Wind; description: string; spec: string }> = {
  display: {
    title: "OLED Display",
    subtitle: "Real-time air quality at a glance",
    icon: Activity,
    description:
      "Crisp 1.3″ OLED panel showing live AQI, PM2.5, temperature, and humidity. The colour shifts green → amber → red as air quality changes.",
    spec: "1.3″ OLED · 280 × 280 · 60 Hz",
  },
  filter: {
    title: "3-Stage Filtration",
    subtitle: "Pre-filter → HEPA H13 → Activated Carbon",
    icon: Shield,
    description:
      "Replaceable cartridge sits in the middle of the device. Air pulled in by the inlet passes through the pre-filter (dust), then HEPA H13 (PM2.5/PM10 at 99.97%), then activated carbon (VOCs and odour) before exiting the outlet.",
    spec: "HEPA H13 · 99.97% @ 0.3μm · 6-month life",
  },
  outlet: {
    title: "Whisper Outlet",
    subtitle: "Top-mounted purified-air outlet",
    icon: Wind,
    description:
      "A brushless DC fan pushes filtered air upward through directional vents. Engineered for under 28 dB at the lowest setting — quieter than a library.",
    spec: "Brushless DC · 28–48 dB · 5 fan speeds",
  },
  inlet: {
    title: "Whisper Inlet",
    subtitle: "Bottom-mounted air intake",
    icon: Wind,
    description:
      "Polluted air is drawn in through the matching bottom vents. Same low-noise engineering as the outlet — symmetric design keeps airflow balanced and unobstructive.",
    spec: "Bottom intake · matched to outlet flow",
  },
  sensor: {
    title: "Multi-Gas Sensor",
    subtitle: "Laser PM + electrochemical gas array",
    icon: Gauge,
    description:
      "Laser-scattering particle scanner reads PM1.0/2.5/10 every second. A separate electrochemical array tracks CO, NO₂, SO₂, and total VOCs in real time.",
    spec: "PM 0.3-10μm · CO · NO₂ · SO₂ · VOC",
  },
  power: {
    title: "One-Tap Control",
    subtitle: "Touch power + auto/eco modes",
    icon: Power,
    description:
      "Tap once to power on/off. Long-press to cycle Auto, Eco, and Sleep modes. The illuminated ring glows green when air is clean and amber when the filter is purifying.",
    spec: "Capacitive touch · haptic feedback",
  },
  battery: {
    title: "8-Hour Battery",
    subtitle: "USB-C fast charge, on-the-go ready",
    icon: Battery,
    description:
      "Internal 2,600 mAh Li-ion lasts up to 8 hours on Eco mode. Recharges to 80% in 35 minutes via USB-C PD. Lanyard loop on top for clip-on portability.",
    spec: "2600 mAh · USB-C PD · 8 hr runtime",
  },
};

const Home = () => {
  const navigate = useNavigate();
  const [selectedPart, setSelectedPart] = useState<DevicePart | null>(null);
  const partInfo = selectedPart ? PART_INFO[selectedPart] : null;

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

      <ThemeToggle />

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
              <div className="mt-4">
                <DemoBadge />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              <Button
                size="lg"
                className={`${buttonStyles.heroGradient} px-8 h-11 rounded-xl group`}
                onClick={() => navigate("/login")}
              >
                <LogIn className="mr-2 w-4 h-4" />
                Device Login
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 h-11 rounded-xl bg-card/70 backdrop-blur-sm"
                onClick={() => navigate("/map")}
              >
                <MapIcon className="mr-2 w-4 h-4" />
                Pollution Portal
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="h-11 rounded-xl"
                onClick={() => {
                  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
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
            <div className="absolute inset-0 bg-gradient-radial from-primary/15 to-transparent rounded-3xl" />
            <div className="h-full rounded-3xl border border-border/50 bg-card/40 backdrop-blur-sm shadow-elevated overflow-hidden">
              <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 4.2]} />
                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  minPolarAngle={Math.PI / 4}
                  maxPolarAngle={Math.PI / 1.5}
                  autoRotate={!selectedPart}
                  autoRotateSpeed={0.5}
                />
                <ambientLight intensity={0.55} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                <Device3D selectedPart={selectedPart} onSelectPart={setSelectedPart} />
                <Environment preset="city" />
              </Canvas>
            </div>

            {/* Hint chip — only when nothing selected */}
            <AnimatePresence>
              {!selectedPart && (
                <motion.div
                  key="hint"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-center"
                >
                  <p className="text-sm text-muted-foreground bg-card/70 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 shadow-card inline-flex items-center gap-2">
                    <Hand className="w-3.5 h-3.5" />
                    Drag to rotate · Tap any part to inspect
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Info panel — slides in when a part is selected */}
            <AnimatePresence>
              {partInfo && selectedPart && (
                <motion.div
                  key={selectedPart}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ duration: 0.25 }}
                  className="absolute bottom-5 right-5 left-5 sm:left-auto sm:max-w-xs"
                >
                  <Card className="p-4 bg-card/95 backdrop-blur-md border-border/60 shadow-elevated">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <partInfo.icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-semibold text-foreground">{partInfo.title}</h3>
                          <button
                            onClick={() => setSelectedPart(null)}
                            className="-mt-1 -mr-1 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                            aria-label="Close"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">
                          {partInfo.subtitle}
                        </p>
                        <p className="text-xs text-foreground/80 leading-relaxed mt-2">
                          {partInfo.description}
                        </p>
                        <p className="text-[10px] font-mono text-muted-foreground mt-3 pt-2 border-t border-border/50">
                          {partInfo.spec}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Part chips — shortcut to inspect, also indicates clickability */}
            <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-1.5 pointer-events-auto">
              {(Object.keys(PART_INFO) as DevicePart[]).map((key) => {
                const info = PART_INFO[key];
                const isActive = selectedPart === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedPart(isActive ? null : key)}
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card/70 backdrop-blur-md text-muted-foreground border-border/60 hover:text-foreground hover:border-border"
                    }`}
                  >
                    {info.title.split(" ")[0]}
                  </button>
                );
              })}
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
                { stat: "7M+", label: "Deaths Annually", description: "Premature deaths caused by air pollution worldwide", colorClass: "text-destructive" },
                { stat: "91%", label: "Population Affected", description: "Of world's population breathes polluted air", colorClass: "text-warning" },
                { stat: "$8.1T", label: "Economic Cost", description: "Annual global cost of air pollution damages", colorClass: "text-warning" },
                { stat: "99%", label: "WHO Guideline", description: "Of cities exceed WHO air quality guidelines", colorClass: "text-destructive" },
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
                { icon: Heart, title: "Health Impact", description: "Air pollution causes respiratory diseases, heart conditions, strokes, and reduces life expectancy significantly." },
                { icon: AlertTriangle, title: "Major Pollutants", description: "PM2.5, PM10, CO, NO₂, SO₂, and O₃ are primary air pollutants affecting human health and environment." },
                { icon: Shield, title: "Our Solution", description: "AriGo AirGuard Pro provides personal protection with real-time monitoring and advanced 3-stage filtration." },
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
    </div>
  );
};

export default Home;
