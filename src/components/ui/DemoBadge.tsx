import { Sparkles } from "lucide-react";
import { DEMO_MODE_ENABLED } from "@/lib/demoAuth";

interface DemoBadgeProps {
  className?: string;
}

export default function DemoBadge({ className = "" }: DemoBadgeProps) {
  if (!DEMO_MODE_ENABLED) return null;
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-warning ${className}`}
    >
      <Sparkles className="h-3 w-3" />
      Demo Mode
    </div>
  );
}
