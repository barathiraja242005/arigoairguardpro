/**
 * ============================================================================
 * ARIGO AIRGUARD PRO — UNIFIED DESIGN SYSTEM
 * ============================================================================
 *
 * This file is the single source of truth for all UI constants, style tokens,
 * animation variants, and reusable class-name helpers used throughout the app.
 *
 * WHY?
 *   - Every page and component should pull from here so the look-and-feel
 *     stays consistent across Home, Dashboard, Login, Admin, Settings, etc.
 *   - Hardcoded Tailwind strings that are repeated in multiple files are
 *     replaced by a named constant defined below.
 *
 * HOW TO USE:
 *   import { pageStyles, cardStyles, ... } from "@/lib/design-system";
 *   <div className={pageStyles.wrapper}> ... </div>
 *
 * RULES:
 *   1. Never hardcode raw color utilities (text-gray-600, bg-blue-500, etc.)
 *      in components. Use design-token colors (text-primary, bg-card, etc.)
 *      or the helpers exported from this file.
 *   2. When adding a new visual pattern, add it here first, then import.
 *   3. Keep the file organised by category (Layout → Typography → Cards → …).
 * ============================================================================
 */

import { Variants } from "framer-motion";

/* ──────────────────────────────────────────────────────────────────────────── */
/*  1. LAYOUT                                                                  */
/* ──────────────────────────────────────────────────────────────────────────── */

/** Page-level wrapper styles */
export const pageStyles = {
  /** Standard page wrapper — used by all authenticated pages */
  wrapper: "min-h-screen bg-background text-foreground",

  /** Gradient page wrapper — used by Login, Settings, and Controls */
  gradientWrapper:
    "min-h-screen bg-gradient-to-br from-background via-background to-primary/5 text-foreground",

  /** Centered page wrapper — for Login / Auth pages */
  centeredWrapper:
    "min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/3 to-accent/5 p-4",

  /** Inner container with responsive padding */
  container: "container mx-auto px-4 py-8",

  /** Wider container variant (for dashboards) */
  containerWide: "max-w-7xl mx-auto px-4 py-8",
} as const;

/* ──────────────────────────────────────────────────────────────────────────── */
/*  2. TYPOGRAPHY                                                              */
/* ──────────────────────────────────────────────────────────────────────────── */

export const typography = {
  /** Primary page heading (h1) */
  pageTitle: "text-4xl font-bold tracking-tight",

  /** Page subtitle / description */
  pageDescription: "text-muted-foreground mt-1",

  /** Section heading (h2) inside a page */
  sectionTitle: "text-2xl font-semibold mb-4",

  /** Card-level heading (h3) */
  cardTitle: "text-xl font-semibold",

  /** Small label text */
  label: "text-sm font-medium",

  /** Muted helper / meta text */
  muted: "text-sm text-muted-foreground",

  /** Extra-small caption */
  caption: "text-xs text-muted-foreground",

  /** Gradient brand text — "AriGo" */
  brandGradient: "bg-gradient-primary bg-clip-text text-transparent",

  /** Large stat number */
  statValue: "text-2xl font-bold",

  /** Extra-large stat number */
  statValueLg: "text-4xl font-bold",
} as const;

/* ──────────────────────────────────────────────────────────────────────────── */
/*  3. PAGE HEADER                                                             */
/* ──────────────────────────────────────────────────────────────────────────── */

/** Consistent page header block (title + description) */
export const pageHeader = {
  wrapper: "mb-8",
  title: "text-4xl font-bold tracking-tight mb-3",
  description: "text-muted-foreground text-lg",
} as const;

/* ──────────────────────────────────────────────────────────────────────────── */
/*  4. CARDS                                                                   */
/* ──────────────────────────────────────────────────────────────────────────── */

export const cardStyles = {
  /** Default card */
  base: "bg-card border border-border rounded-xl",

  /** Card with hover shadow + scale */
  interactive: "bg-card border border-border rounded-xl hover:shadow-elevated hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-300",

  /** Glass-morphism card */
  glass: "bg-card/60 backdrop-blur-md border border-border/50 rounded-xl shadow-card",

  /** Elevated / prominent card */
  elevated: "bg-card border border-border rounded-xl shadow-elevated",

  /** Gradient card — used for feature highlights */
  gradient: "bg-gradient-glass border border-border/50 rounded-xl backdrop-blur-sm",

  /** Standard card padding */
  padding: "p-6",

  /** Compact card padding */
  paddingSm: "p-4",
} as const;

/* ──────────────────────────────────────────────────────────────────────────── */
/*  5. ICON CONTAINERS                                                         */
/* ──────────────────────────────────────────────────────────────────────────── */

export const iconContainer = {
  /** Small rounded icon bg (32×32) */
  sm: "p-2 rounded-lg",

  /** Medium rounded icon bg (40×40) */
  md: "p-3 rounded-xl",

  /** Circular icon bg (48×48) */
  circle: "w-12 h-12 rounded-full flex items-center justify-center",

  /** Primary-tinted background */
  primary: "bg-primary/10",

  /** Muted background */
  muted: "bg-muted",

  /** Gradient background */
  gradient: "bg-gradient-primary",
} as const;

/* ──────────────────────────────────────────────────────────────────────────── */
/*  6. STATUS / AQI COLORS                                                     */
/* ──────────────────────────────────────────────────────────────────────────── */

/** Get the correct text-color class for a given AQI value */
export function getAqiTextColor(aqi: number): string {
  if (aqi <= 50) return "text-aqi-good";
  if (aqi <= 100) return "text-aqi-moderate";
  if (aqi <= 150) return "text-aqi-unhealthy";
  return "text-aqi-hazardous";
}

/** Get the correct bg-color class for a given AQI value */
export function getAqiBgColor(aqi: number): string {
  if (aqi <= 50) return "bg-aqi-good";
  if (aqi <= 100) return "bg-aqi-moderate";
  if (aqi <= 150) return "bg-aqi-unhealthy";
  return "bg-aqi-hazardous";
}

/** Get the AQI gradient background class */
export function getAqiGradient(aqi: number): string {
  if (aqi <= 50) return "bg-gradient-aqi-good";
  if (aqi <= 100) return "bg-gradient-aqi-moderate";
  return "bg-gradient-aqi-poor";
}

/** Human-readable AQI label */
export function getAqiLabel(aqi: number): string {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

/** Status-color helpers for percentage-based indicators */
export function getStatusTextColor(percentage: number): string {
  if (percentage < 50) return "text-aqi-good";
  if (percentage < 80) return "text-aqi-moderate";
  return "text-aqi-hazardous";
}

export function getStatusBgColor(percentage: number): string {
  if (percentage < 50) return "bg-aqi-good";
  if (percentage < 80) return "bg-aqi-moderate";
  return "bg-aqi-hazardous";
}

/** Device status helpers */
export function getDeviceStatusColor(status: "Online" | "Offline"): string {
  return status === "Online" ? "text-success" : "text-destructive";
}

/** Toggle / mode icon colors — uses design tokens instead of raw colors */
export const toggleIconColors = {
  power: { on: "text-success", off: "text-muted-foreground" },
  auto: { on: "text-warning", off: "text-muted-foreground" },
  silent: { on: "text-accent", off: "text-muted-foreground" },
  eco: { on: "text-success", off: "text-muted-foreground" },
  scheduling: { on: "text-primary", off: "text-muted-foreground" },
  notifications: { on: "text-destructive", off: "text-muted-foreground" },
} as const;

/** Alert type to design-token color mapping */
export const alertColors = {
  error: "text-destructive",
  warning: "text-warning",
  info: "text-primary",
} as const;

/* ──────────────────────────────────────────────────────────────────────────── */
/*  7. BUTTONS                                                                 */
/* ──────────────────────────────────────────────────────────────────────────── */

export const buttonStyles = {
  /** Primary gradient CTA */
  primaryGradient:
    "bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow hover:shadow-elevated transition-all duration-300",

  /** Hero gradient CTA — indigo → teal for hero sections */
  heroGradient:
    "bg-gradient-hero hover:opacity-90 text-foreground dark:text-white border border-primary/20 shadow-glow hover:shadow-elevated transition-all duration-300",

  /** Full-width submit button */
  fullWidth: "w-full",

  /** Icon-only button inside nav / header */
  iconRound: "p-2 rounded-full border border-border bg-card/80 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/30 transition-all duration-200",
} as const;

/* ──────────────────────────────────────────────────────────────────────────── */
/*  8. FORM ELEMENTS                                                           */
/* ──────────────────────────────────────────────────────────────────────────── */

export const formStyles = {
  /** Grouped form fields */
  fieldGroup: "space-y-4",

  /** Individual field wrapper */
  field: "space-y-2",

  /** Demo credentials box */
  demoCredentials:
    "text-xs text-muted-foreground bg-muted p-3 rounded-md",

  /** Setting toggle row */
  toggleRow:
    "flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border",

  /** Setting section with glass effect */
  settingCard:
    "p-6 backdrop-blur-sm bg-card/50 border-2 border-border rounded-lg",

  /** Section header inside settings */
  settingHeader: "flex items-center gap-3 mb-6",
} as const;

/* ──────────────────────────────────────────────────────────────────────────── */
/*  9. DARK MODE TOGGLE (shared across all pages)                              */
/* ──────────────────────────────────────────────────────────────────────────── */

export const darkModeToggle = {
  /** Position wrapper for the dark mode button */
  wrapper: "absolute top-4 right-4 z-10",

  /** The toggle button itself */
  button:
    "p-2.5 rounded-xl border border-border bg-card/80 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/30 shadow-card transition-all duration-200",

  /** Icon size */
  iconClass: "h-5 w-5",
} as const;

/* ──────────────────────────────────────────────────────────────────────────── */
/*  10. NAVIGATION / SIDEBAR                                                   */
/* ──────────────────────────────────────────────────────────────────────────── */

export const navStyles = {
  /** Top header bar */
  header:
    "bg-card/80 backdrop-blur-md shadow-card px-6 h-16 flex items-center justify-between border-b border-border/50",

  /** Sidebar active link */
  activeLink: "bg-primary/10 text-primary font-medium border-r-2 border-primary",

  /** Sidebar inactive link */
  inactiveLink: "hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-colors",
} as const;

/* ──────────────────────────────────────────────────────────────────────────── */
/*  11. GRID LAYOUTS                                                           */
/* ──────────────────────────────────────────────────────────────────────────── */

export const gridStyles = {
  /** 4-column stats grid */
  stats: "grid grid-cols-2 md:grid-cols-4 gap-4",

  /** 3-column feature/content grid */
  features: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",

  /** 4-column grid (specifications, team, etc.) */
  fourCol: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",

  /** Dashboard main grid */
  dashboard: "grid grid-cols-1 lg:grid-cols-3 gap-6",

  /** Two-column pollutant grid */
  pollutants: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
} as const;

/* ──────────────────────────────────────────────────────────────────────────── */
/*  12. FRAMER MOTION VARIANTS                                                 */
/* ──────────────────────────────────────────────────────────────────────────── */

/** Staggered container — use on parent grid/list */
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

/** Fade-up card — use on each child */
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

/** Page-enter from top */
export const pageEnterVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

/** Slide-in from left (for hero text) */
export const slideInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8 },
  },
};

/** Scale-in (for 3D model section, images) */
export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, delay: 0.2 },
  },
};

/** Scroll-triggered section animation */
export const scrollRevealVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

/** Alert card animation */
export const alertCardVariants: Variants = {
  initial: { opacity: 0, y: 50, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, x: -100, transition: { duration: 0.3 } },
};

/* ──────────────────────────────────────────────────────────────────────────── */
/*  13. BADGE / PILL / TAG                                                     */
/* ──────────────────────────────────────────────────────────────────────────── */

export const badgeStyles = {
  /** Small rounded pill */
  pill: "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",

  /** Primary-tinted pill */
  primaryPill:
    "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium backdrop-blur-sm",

  /** Destructive-tinted pill */
  destructivePill:
    "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 text-sm font-medium",

  /** Status indicator (map / nearby) */
  statusPill:
    "text-xs text-muted-foreground px-3 py-1 rounded-full bg-muted/80 backdrop-blur-sm",
} as const;

/* ──────────────────────────────────────────────────────────────────────────── */
/*  14. PROGRESS / BAR                                                         */
/* ──────────────────────────────────────────────────────────────────────────── */

export const progressStyles = {
  /** Track background */
  track: "relative h-2 bg-muted rounded-full overflow-hidden",

  /** Fill bar (combine with dynamic width) */
  fill: "absolute inset-y-0 left-0 rounded-full transition-all",
} as const;

/* ──────────────────────────────────────────────────────────────────────────── */
/*  15. SPACING TOKENS (common spacing combos)                                 */
/* ──────────────────────────────────────────────────────────────────────────── */

export const spacing = {
  /** Standard section gap */
  sectionGap: "space-y-8",

  /** Card internal gap */
  cardGap: "space-y-6",

  /** Compact list gap */
  listGap: "space-y-4",
} as const;

/* ──────────────────────────────────────────────────────────────────────────── */
/*  16. RESPONSIVE HELPERS                                                     */
/* ──────────────────────────────────────────────────────────────────────────── */

export const responsive = {
  /** Hide on mobile, show on sm+ */
  smOnly: "hidden sm:inline",

  /** Responsive padding */
  pagePadding: "p-4 sm:p-8",
} as const;

/* ──────────────────────────────────────────────────────────────────────────── */
/*  17. TRANSITION PRESETS                                                     */
/* ──────────────────────────────────────────────────────────────────────────── */

export const transitions = {
  /** Standard hover transition */
  hover: "transition-all duration-300 ease-in-out",

  /** Color transition */
  color: "transition-colors duration-200",
} as const;
