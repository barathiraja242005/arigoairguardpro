import { motion } from "framer-motion";
import { Filter, Shield, Droplets } from "lucide-react";

interface FilterHealthProps {
  preFilter: number;
  hepa: number;
  carbon: number;
}

const FilterHealth = ({ preFilter, hepa, carbon }: FilterHealthProps) => {
  const filters = [
    { name: "Pre-Filter", value: preFilter, icon: Filter, color: "bg-primary" },
    { name: "HEPA", value: hepa, icon: Shield, color: "bg-secondary" },
    { name: "Activated Carbon", value: carbon, icon: Droplets, color: "bg-accent" },
  ];

  return (
    <div className="space-y-6">
      {filters.map((filter, index) => (
        <motion.div
          key={filter.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <filter.icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{filter.name}</span>
            </div>
            <span className="text-sm font-semibold">{filter.value}%</span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`absolute inset-y-0 left-0 ${filter.color} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${filter.value}%` }}
              transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
            />
          </div>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 p-4 rounded-lg bg-muted/50 border border-border"
      >
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Next Service:</span> Replace HEPA filter in 15 days
        </p>
      </motion.div>
    </div>
  );
};

export default FilterHealth;
