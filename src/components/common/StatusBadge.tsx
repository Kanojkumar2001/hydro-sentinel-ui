import { cn } from "@/lib/utils";
import type { RiskLevel, WaterStatus } from "@/data/mockData";

const statusStyles: Record<WaterStatus, string> = {
  SAFE: "bg-success/12 text-success border-success/25",
  MODERATE: "bg-warning/15 text-warning-foreground border-warning/35",
  UNSAFE: "bg-destructive/12 text-destructive border-destructive/25",
};

const riskStyles: Record<RiskLevel, string> = {
  LOW: "bg-success/12 text-success border-success/25",
  MEDIUM: "bg-warning/15 text-warning-foreground border-warning/35",
  HIGH: "bg-destructive/12 text-destructive border-destructive/25",
};

const dot: Record<string, string> = {
  SAFE: "bg-success",
  LOW: "bg-success",
  MODERATE: "bg-warning",
  MEDIUM: "bg-warning",
  UNSAFE: "bg-destructive",
  HIGH: "bg-destructive",
};

export function StatusBadge({
  status,
  className,
}: {
  status: WaterStatus | RiskLevel;
  className?: string;
}) {
  const styles =
    status in statusStyles
      ? statusStyles[status as WaterStatus]
      : riskStyles[status as RiskLevel];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide",
        styles,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", dot[status])} />
      {status}
    </span>
  );
}

export function ProcessingBadge({
  state,
}: {
  state: "PENDING" | "ANALYZING" | "COMPLETED" | "FAILED";
}) {
  const map = {
    PENDING: "bg-muted text-muted-foreground border-border",
    ANALYZING: "bg-info/12 text-info border-info/25",
    COMPLETED: "bg-success/12 text-success border-success/25",
    FAILED: "bg-destructive/12 text-destructive border-destructive/25",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        map[state],
      )}
    >
      {state}
    </span>
  );
}
