import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Wind, Shield, Leaf, ArrowRight } from "lucide-react";
import heroDevice from "@/assets/hero-device.jpg";

const Landing = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            animate={{
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
              ],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-6xl mx-auto"
        >
          {/* Logo/Title */}
          <motion.div variants={itemVariants} className="mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <Wind className="w-16 h-16 text-primary" />
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              AriGo AirGuard Pro
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium">
              Keep Breathing Safe
            </p>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="mb-12 relative"
          >
            <div className="relative max-w-4xl mx-auto">
              <img
                src={heroDevice}
                alt="AriGo AirGuard Pro Device"
                className="w-full rounded-3xl shadow-elevated"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-3xl" />
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-2xl bg-card shadow-card border border-border"
            >
              <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">3-Stage Filtration</h3>
              <p className="text-sm text-muted-foreground">
                Advanced HEPA + activated carbon technology
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-2xl bg-card shadow-card border border-border"
            >
              <Wind className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Real-Time AQI</h3>
              <p className="text-sm text-muted-foreground">
                IoT-based continuous air quality monitoring
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-2xl bg-card shadow-card border border-border"
            >
              <Leaf className="w-10 h-10 text-earth-olive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Eco-Friendly</h3>
              <p className="text-sm text-muted-foreground">
                Converts pollutants to useful fertilizer
              </p>
            </motion.div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow text-lg px-8 py-6 rounded-xl group"
              onClick={() => navigate("/dashboard")}
            >
              Launch Dashboard
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-xl border-2"
              onClick={() => navigate("/dashboard")}
            >
              View Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { value: "99.97%", label: "Filtration Efficiency" },
              { value: "24/7", label: "Real-Time Monitoring" },
              { value: "8 Sensors", label: "Pollutant Detection" },
              { value: "Eco+", label: "Fertilizer Conversion" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
