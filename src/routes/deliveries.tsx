import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Truck, CheckCircle2, Clock } from "lucide-react";
import { PageHeader, Panel, StatusBadge, Progress } from "@/components/ui-bits";
import { orders, orderProgress } from "@/lib/mock-data";

export const Route = createFileRoute("/deliveries")({
  head: () => ({ meta: [{ title: "Deliveries — Universal Ceramics" }] }),
  component: Deliveries,
});

function Deliveries() {
  const active = orders.filter((o) => o.status !== "Delivered");

  return (
    <div>
      <PageHeader title="Smart Delivery Management" subtitle="Partial deliveries auto-update order status in real time" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {active.map((o) => (
          <Panel key={o.id}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="font-display font-semibold">{o.id}</div>
                <div className="text-sm text-muted-foreground">{o.customer}</div>
              </div>
              <StatusBadge status={o.status} />
            </div>
            <Progress value={orderProgress(o)} />
            <div className="mb-1 mt-2 text-xs text-muted-foreground">{orderProgress(o)}% delivered</div>

            <div className="mt-4 space-y-2">
              {o.items.map((it, idx) => {
                const done = it.delivered >= it.qtyBoxes;
                const partial = it.delivered > 0 && !done;
                return (
                  <motion.div
                    key={it.product}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3 rounded-lg bg-secondary/40 p-3 text-sm"
                  >
                    {done ? <CheckCircle2 className="h-4 w-4 text-success" /> : partial ? <Truck className="h-4 w-4 text-warning" /> : <Clock className="h-4 w-4 text-destructive" />}
                    <span className="flex-1 font-medium">{it.product}</span>
                    <span className="text-muted-foreground">{it.delivered}/{it.qtyBoxes}</span>
                    {!done && (
                      <button className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary">
                        Mark delivered
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
