import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, PerspectiveCamera } from "@react-three/drei";
import Device3D from "@/components/home/Device3D";
import {
  Wind,
  Shield,
  Leaf,
  ArrowRight,
  Gauge,
  Battery,
  Smartphone,
  Ruler,
  Weight,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const specifications = [
    { icon: Ruler, label: "Height", value: "180 mm", detail: "~7.1 inches" },
    { icon: Ruler, label: "Width", value: "80 mm", detail: "~3.1 inches" },
    { icon: Ruler, label: "Depth", value: "60 mm", detail: "~2.4 inches" },
    { icon: Weight, label: "Weight", value: "450-500 g", detail: "Lightweight" },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4"
              >
                <Wind className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Portable Air Purifier</span>
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  AriGo
                </span>
                <br />
                <span className="text-foreground">AirGuard Pro</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-2">
                Keep Breathing Safe, Anywhere You Go
              </p>
              <p className="text-muted-foreground">
                Compact, powerful, and intelligent air purification in the palm of your hand
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              <Button
                size="lg"
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow px-8 group"
                onClick={() => navigate("/dashboard")}
              >
                View Dashboard
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2"
                onClick={() => navigate("/dashboard")}
              >
                Learn More
              </Button>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-card border border-border">
                <div className="text-2xl font-bold text-primary mb-1">99.97%</div>
                <div className="text-xs text-muted-foreground">Filtration</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-card border border-border">
                <div className="text-2xl font-bold text-secondary mb-1">8 hrs</div>
                <div className="text-xs text-muted-foreground">Battery</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-card border border-border">
                <div className="text-2xl font-bold text-earth-olive mb-1">500g</div>
                <div className="text-xs text-muted-foreground">Weight</div>
              </div>
            </div>
          </motion.div>

          {/* Right side - 3D Model */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[500px] lg:h-[600px]"
          >
            <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent rounded-3xl" />
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
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
              <p className="text-sm text-muted-foreground bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
                Interactive 3D Model - Drag to rotate
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Specifications Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center mb-4">
            Compact & Portable Design
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Engineered for maximum portability without compromising on performance.
            Fits perfectly in your bag, on your desk, or in your hand.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specifications.map((spec, index) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center hover:shadow-elevated transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <spec.icon className="w-6 h-6 text-primary" />
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
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center mb-4">
            Advanced Features
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Cutting-edge technology packed into a compact device
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-card transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-12 text-center bg-gradient-primary relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Breathe Better?
              </h2>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                Experience the future of portable air purification with real-time monitoring
                and intelligent automation
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90 shadow-lg px-8"
                onClick={() => navigate("/dashboard")}
              >
                Get Started Now
                <ArrowRight className="ml-2" />
              </Button>
            </div>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "30px 30px"
              }} />
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
