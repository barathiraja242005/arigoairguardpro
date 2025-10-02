import { motion } from "framer-motion";
import { Leaf, Droplets, Package } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const ByproductStats = () => {
  const byproducts = [
    {
      name: "Ammonium Sulfate",
      amount: 2.4,
      unit: "g",
      source: "SO₂ Captured",
      icon: Package,
      progress: 75,
    },
    {
      name: "Calcium Nitrate",
      amount: 1.8,
      unit: "g",
      source: "NO₂ Captured",
      icon: Droplets,
      progress: 60,
    },
    {
      name: "Organic Compost",
      amount: 0.5,
      unit: "g",
      source: "Carbon Filtered",
      icon: Leaf,
      progress: 40,
    },
  ];

  return (
    <div className="space-y-6">
      {byproducts.map((item, index) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.15 }}
          className="p-4 rounded-lg bg-gradient-earth/5 border border-earth-brown/20"
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 rounded-lg bg-earth-olive/20">
              <item.icon className="w-5 h-5 text-earth-olive" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-sm">{item.name}</h4>
                <span className="text-lg font-bold text-earth-brown">
                  {item.amount}
                  <span className="text-xs ml-1">{item.unit}</span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{item.source}</p>
            </div>
          </div>
          <Progress value={item.progress} className="h-2" />
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 rounded-lg bg-muted/50 border border-border"
      >
        <div className="flex items-center gap-2 mb-2">
          <Leaf className="w-5 h-5 text-earth-olive" />
          <span className="font-semibold">Total Fertilizer Generated</span>
        </div>
        <div className="text-2xl font-bold text-earth-brown">4.7g</div>
        <p className="text-xs text-muted-foreground mt-1">
          Equivalent to ~2 plant servings
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="p-4 rounded-lg bg-primary/5 border border-primary/20"
      >
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Environmental Impact:</span>{" "}
          By converting pollutants to fertilizer, you've contributed to sustainable agriculture while breathing cleaner air.
        </p>
      </motion.div>
    </div>
  );
};

export default ByproductStats;
