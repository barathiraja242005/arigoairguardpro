/**
 * MapView — Role Selector Hub
 * Landing page for the pollution monitoring portal.
 * Users choose between NGO Login (state-specific) or Admin Login (all states).
 */

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  TreePine,
  Shield,
  ArrowRight,
  Wind,
  MapPin,
  BarChart3,
  MessageCircle,
  Globe,
  Activity,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { pageStyles } from "@/lib/design-system";
import { indianStates, getAqiColor } from "@/lib/statePollutionData";

const MapView = () => {
  const navigate = useNavigate();

  const avgAqi = Math.round(
    indianStates.reduce((s, st) => s + st.aqi, 0) / indianStates.length
  );
  const topPolluted = [...indianStates].sort((a, b) => b.aqi - a.aqi).slice(0, 5);

  const roles = [
    {
      title: "NGO Portal",
      subtitle: "State-Level Monitoring",
      description:
        "Login as an NGO to access detailed pollution data for your assigned state. Get AI-powered reduction strategies and actionable insights.",
      icon: TreePine,
      route: "/ngo-login",
      gradient: "from-green-500/10 to-emerald-500/10",
      borderHover: "hover:border-green-500/40",
      iconColor: "text-green-600",
      features: [
        { icon: MapPin, text: "State-specific pollution data" },
        { icon: MessageCircle, text: "AI chatbot for reduction strategies" },
        { icon: BarChart3, text: "Pollutant level analytics" },
      ],
    },
    {
      title: "Admin Portal",
      subtitle: "All-India Dashboard",
      description:
        "Login as an administrator to view pollution data across all Indian states. Sort, filter, and analyze nationwide air quality trends.",
      icon: Shield,
      route: "/admin-login",
      gradient: "from-primary/10 to-accent/10",
      borderHover: "hover:border-primary/40",
      iconColor: "text-primary",
      features: [
        { icon: Globe, text: "29 states overview" },
        { icon: Activity, text: "Real-time AQI tracking" },
        { icon: BarChart3, text: "Comparative analysis tools" },
      ],
    },
  ];

  return (
    <div className={`${pageStyles.wrapper} relative overflow-hidden`}>
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Wind className="h-7 w-7 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Air Quality{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Monitoring Portal
            </span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Choose your role to access state-level pollution data, AI-driven insights, and
            comprehensive air quality analytics across India.
          </p>
        </motion.div>

        {/* National AQI Summary Strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-6 mb-10 p-4 rounded-2xl bg-card border border-border/50"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">National Avg AQI</span>
            <span
              className="text-lg font-bold px-2.5 py-0.5 rounded-lg text-white"
              style={{ backgroundColor: getAqiColor(avgAqi) }}
            >
              {avgAqi}
            </span>
          </div>
          <div className="hidden sm:block h-6 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">States Monitored</span>
            <span className="text-lg font-bold text-foreground">{indianStates.length}</span>
          </div>
          <div className="hidden sm:block h-6 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Most Polluted</span>
            <span className="text-sm font-semibold text-destructive">
              {topPolluted[0]?.state} ({topPolluted[0]?.aqi})
            </span>
          </div>
        </motion.div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {roles.map((role, idx) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + idx * 0.1, duration: 0.5 }}
            >
              <Card
                className={`relative overflow-hidden border-border/50 cursor-pointer transition-all duration-300 ${role.borderHover} hover:shadow-xl group`}
                onClick={() => navigate(role.route)}
              >
                {/* Gradient bg */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-50 group-hover:opacity-100 transition-opacity`}
                />

                <CardContent className="relative p-8">
                  {/* Icon + Title */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-background/80 border border-border/50 ${role.iconColor}`}>
                      <role.icon className="h-7 w-7" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {role.title}
                      </h2>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        {role.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    {role.description}
                  </p>

                  {/* Feature List */}
                  <div className="space-y-2.5 mb-6">
                    {role.features.map((feat) => (
                      <div key={feat.text} className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-background/80 border border-border/30">
                          <feat.icon className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <span className="text-sm text-foreground">{feat.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                    Login to {role.title}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Top Polluted States Quick View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 text-center">
            Top 5 Most Polluted States
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {topPolluted.map((state, i) => (
              <motion.div
                key={state.code}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-card p-3"
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white text-xs font-bold"
                  style={{ backgroundColor: getAqiColor(state.aqi) }}
                >
                  {state.aqi}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{state.state}</p>
                  <p className="text-[10px] text-muted-foreground">{state.status}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MapView;
