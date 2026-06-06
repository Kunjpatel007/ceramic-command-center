import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Plus, Truck, Check } from "lucide-react";
import { PageHeader, Panel, StatusBadge, Progress } from "@/components/ui-bits";
import { orders as seedOrders, inr, orderProgress, type Order, type DeliveryStatus } from "@/lib/mock-data";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Orders — Universal Ceramics" }] }),
  component: Orders,
});

function deriveStatus(o: Order): DeliveryStatus {
  const total = o.items.reduce((s, i) => s + i.qtyBoxes, 0);
  const done = o.items.reduce((s, i) => s + i.delivered, 0);
  if (done === 0) return "Pending";
  if (done >= total) return "Delivered";
  return "Partially Delivered";
}

function Orders() {
  const [data, setData] = useState<Order[]>(() => seedOrders.map((o) => ({ ...o, items: o.items.map((i) => ({ ...i })) })));
  const [open, setOpen] = useState<string | null>(data[0].id);
  const [filter, setFilter] = useState("All");
  // tracks which item index (per order) is currently being fed a delivery quantity
  const [feeding, setFeeding] = useState<{ orderId: string; idx: number } | null>(null);
  const [qty, setQty] = useState("");

  const tabs = ["All", "Pending", "Partially Delivered", "Delivered"];
  const list = filter === "All" ? data : data.filter((o) => o.status === filter);

  function applyDelivery(orderId: string, idx: number, addBoxes: number) {
    setData((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const items = o.items.map((it, i) => {
          if (i !== idx) return it;
          const delivered = Math.min(it.qtyBoxes, it.delivered + addBoxes);
          return { ...it, delivered };
        });
        const updated = { ...o, items };
        return { ...updated, status: deriveStatus(updated) };
      }),
    );
    setFeeding(null);
    setQty("");
  }

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
                    <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                      Select a tile to record what was delivered
                    </div>
                    {o.items.map((it, idx) => {
                      const pct = Math.round((it.delivered / it.qtyBoxes) * 100);
                      const done = it.delivered >= it.qtyBoxes;
                      const isFeeding = feeding?.orderId === o.id && feeding?.idx === idx;
                      const remaining = it.qtyBoxes - it.delivered;
                      return (
                        <div key={it.product} className="rounded-lg bg-secondary/40 p-3 text-sm">
                          <div className="flex items-center gap-4">
                            <div className="flex-1 font-medium">{it.product}</div>
                            <div className="w-32 text-muted-foreground">{it.delivered}/{it.qtyBoxes} boxes</div>
                            <div className="w-28"><Progress value={pct} /></div>
                            <div className="w-24 text-right">{inr(it.qtyBoxes * it.rate)}</div>
                            <span className={`w-24 text-right text-xs ${pct === 100 ? "text-success" : pct === 0 ? "text-destructive" : "text-warning"}`}>
                              {pct === 100 ? "Delivered" : pct === 0 ? "Pending" : "Partial"}
                            </span>
                            {done ? (
                              <span className="flex w-32 items-center justify-end gap-1 text-xs text-success">
                                <Check className="h-3.5 w-3.5" /> Complete
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  setFeeding(isFeeding ? null : { orderId: o.id, idx });
                                  setQty("");
                                }}
                                className="flex w-32 items-center justify-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs text-primary"
                              >
                                <Truck className="h-3.5 w-3.5" /> Mark delivered
                              </button>
                            )}
                          </div>
                          <AnimatePresence initial={false}>
                            {isFeeding && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-background/60 p-3">
                                  <span className="text-xs text-muted-foreground">
                                    Delivered tile: <span className="font-medium text-foreground">{it.product}</span> · {remaining} boxes remaining
                                  </span>
                                  <input
                                    type="number"
                                    min={1}
                                    max={remaining}
                                    value={qty}
                                    onChange={(e) => setQty(e.target.value)}
                                    placeholder="Boxes delivered"
                                    className="w-36 rounded-lg border border-border bg-secondary/60 px-3 py-1.5 text-sm outline-none focus:border-primary/50"
                                  />
                                  <button
                                    onClick={() => {
                                      const n = Math.max(0, Math.min(remaining, Number(qty) || 0));
                                      if (n > 0) applyDelivery(o.id, idx, n);
                                    }}
                                    className="rounded-lg gold-gradient px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                                  >
                                    Confirm delivery
                                  </button>
                                  <button
                                    onClick={() => applyDelivery(o.id, idx, remaining)}
                                    className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                                  >
                                    Deliver all
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
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
