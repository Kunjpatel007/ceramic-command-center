import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Plus } from "lucide-react";
import { PageHeader, Panel, StatusBadge, Progress } from "@/components/ui-bits";
import { orders, inr, orderProgress } from "@/lib/mock-data";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Orders — Universal Ceramics" }] }),
  component: Orders,
});

function Orders() {
  const [open, setOpen] = useState<string | null>(orders[0].id);
  const [filter, setFilter] = useState("All");
  const tabs = ["All", "Pending", "Partially Delivered", "Delivered"];
  const list = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <PageHeader
        title="Order Management"
        subtitle="Multi-product orders with per-item delivery tracking"
        action={
          <button className="flex items-center gap-2 rounded-xl gold-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]">
            <Plus className="h-4 w-4" /> New Order
          </button>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              filter === t ? "border-primary/40 bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {list.map((o) => (
          <Panel key={o.id} className="p-0">
            <button
              onClick={() => setOpen(open === o.id ? null : o.id)}
              className="flex w-full items-center gap-4 p-5 text-left"
            >
              <div className="w-28">
                <div className="font-display font-medium">{o.id}</div>
                <div className="text-xs text-muted-foreground">{o.date}</div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{o.customer}</div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="w-40"><Progress value={orderProgress(o)} /></div>
                  <span className="text-xs text-muted-foreground">{orderProgress(o)}% delivered</span>
                </div>
              </div>
              <StatusBadge status={o.status} />
              <div className="w-28 text-right font-medium">{inr(o.total)}</div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open === o.id ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {open === o.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-border"
                >
                  <div className="space-y-2 p-5">
                    {o.items.map((it) => {
                      const pct = Math.round((it.delivered / it.qtyBoxes) * 100);
                      return (
                        <div key={it.product} className="flex items-center gap-4 rounded-lg bg-secondary/40 p-3 text-sm">
                          <div className="flex-1 font-medium">{it.product}</div>
                          <div className="w-40 text-muted-foreground">{it.delivered}/{it.qtyBoxes} boxes</div>
                          <div className="w-32"><Progress value={pct} /></div>
                          <div className="w-24 text-right">{inr(it.qtyBoxes * it.rate)}</div>
                          <span className={`w-28 text-right text-xs ${pct === 100 ? "text-success" : pct === 0 ? "text-destructive" : "text-warning"}`}>
                            {pct === 100 ? "Delivered" : pct === 0 ? "Pending" : "Partial"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Panel>
        ))}
      </div>
    </div>
  );
}
