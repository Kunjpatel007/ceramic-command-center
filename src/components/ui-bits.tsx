import { motion } from "motion/react";
import type { ReactNode } from "react";
import type { DeliveryStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-semibold"
        >
          {title}
        </motion.h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("panel p-6", className)}>{children}</div>;
}

export function StatCard({
  label, value, hint, icon, delay = 0, accent,
}: { label: string; value: string; hint?: string; icon?: ReactNode; delay?: number; accent?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={cn(
        "panel relative overflow-hidden p-5",
        accent && "border-primary/40 shadow-[var(--shadow-glow)]",
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        {icon && <span className="text-primary">{icon}</span>}
      </div>
      <div className={cn("mt-3 font-display text-2xl font-semibold", accent && "gold-text")}>{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </motion.div>
  );
}

const STATUS_STYLES: Record<DeliveryStatus, string> = {
  Pending: "bg-destructive/15 text-destructive border-destructive/30",
  "Partially Delivered": "bg-warning/15 text-warning border-warning/30",
  Delivered: "bg-success/15 text-success border-success/30",
};

export function StatusBadge({ status }: { status: DeliveryStatus }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", STATUS_STYLES[status])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function Progress({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full rounded-full gold-gradient"
      />
    </div>
  );
}
