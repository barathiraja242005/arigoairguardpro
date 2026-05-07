import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { darkModeToggle } from "@/lib/design-system";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className={className ?? darkModeToggle.wrapper}>
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={darkModeToggle.button}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className={darkModeToggle.iconClass} />
        ) : (
          <Moon className={darkModeToggle.iconClass} />
        )}
      </button>
    </div>
  );
}
