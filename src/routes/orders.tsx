import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Plus, Truck, Check, X, FileText } from "lucide-react";
import { PageHeader, Panel, StatusBadge, Progress } from "@/components/ui-bits";
import { inr } from "@/lib/mock-data";
import { useStore, createOrder, applyDelivery, type NewOrderItem } from "@/lib/store";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Orders — Universal Ceramics" }] }),
  component: Orders,
});

function Orders() {
  const { orders: data, products, invoices } = useStore();
  const [open, setOpen] = useState<string | null>(data[0]?.id ?? null);
  const [filter, setFilter] = useState("All");
  const [feeding, setFeeding] = useState<{ orderId: string; idx: number } | null>(null);
  const [qty, setQty] = useState("");
  const [showNew, setShowNew] = useState(false);

  const tabs = ["All", "Pending", "Partially Delivered", "Delivered"];
  const list = filter === "All" ? data : data.filter((o) => o.status === filter);

  function confirm(orderId: string, idx: number, addBoxes: number) {
    applyDelivery(orderId, idx, addBoxes);
    setFeeding(null);
    setQty("");
  }

  function invoiceFor(orderId: string) {
    return invoices.find((iv) => iv.orderId === orderId);
  }

  return (
    <div>
      <PageHeader
        title="Order Management"
        subtitle="New orders auto-generate an invoice and deduct stock from inventory"
        action={
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-2 rounded-xl gold-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
          >
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
        {list.map((o) => {
          const inv = invoiceFor(o.id);
          return (
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
                  <div className="w-40"><Progress value={progress(o.items)} /></div>
                  <span className="text-xs text-muted-foreground">{progress(o.items)}% delivered</span>
                  {inv && (
                    <span className="flex items-center gap-1 text-xs text-primary">
                      <FileText className="h-3 w-3" /> {inv.id}
                    </span>
                  )}
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
                                      if (n > 0) confirm(o.id, idx, n);
                                    }}
                                    className="rounded-lg gold-gradient px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                                  >
                                    Confirm delivery
                                  </button>
                                  <button
                                    onClick={() => confirm(o.id, idx, remaining)}
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
          );
        })}
      </div>

      <AnimatePresence>
        {showNew && (
          <NewOrderModal products={products} onClose={() => setShowNew(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function progress(items: { qtyBoxes: number; delivered: number }[]) {
  const total = items.reduce((s, i) => s + i.qtyBoxes, 0);
  const done = items.reduce((s, i) => s + i.delivered, 0);
  return total ? Math.round((done / total) * 100) : 0;
}

function NewOrderModal({
  products,
  onClose,
}: {
  products: ReturnType<typeof useStore>["products"];
  onClose: () => void;
}) {
  const [customer, setCustomer] = useState("");
  const [lines, setLines] = useState<NewOrderItem[]>([{ productId: products[0]?.id ?? "", qtyBoxes: 0 }]);
  const [created, setCreated] = useState<{ orderId: string; invoiceId: string } | null>(null);

  function setLine(i: number, patch: Partial<NewOrderItem>) {
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  }

  const total = lines.reduce((s, l) => {
    const p = products.find((x) => x.id === l.productId);
    return s + (p ? p.price * l.qtyBoxes : 0);
  }, 0);

  function submit() {
    const picks = lines.filter((l) => l.productId && l.qtyBoxes > 0);
    if (!customer.trim() || picks.length === 0) return;
    const { order, invoice } = createOrder(customer.trim(), picks);
    setCreated({ orderId: order.id, invoiceId: invoice.id });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-glow)]"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Create New Order</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>

        {created ? (
          <div className="space-y-4 text-sm">
            <div className="rounded-xl border border-success/30 bg-success/10 p-4 text-success">
              <div className="flex items-center gap-2 font-medium"><Check className="h-4 w-4" /> Order {created.orderId} created</div>
              <ul className="mt-2 list-disc pl-5 text-foreground/80">
                <li>Invoice <span className="font-medium">{created.invoiceId}</span> auto-generated</li>
                <li>Inventory stock deducted automatically</li>
              </ul>
            </div>
            <button onClick={onClose} className="w-full rounded-xl gold-gradient px-4 py-2.5 font-semibold text-primary-foreground">Done</button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Customer</label>
              <input
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="Customer name"
                className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm outline-none focus:border-primary/50"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-muted-foreground">Tiles</label>
              {lines.map((l, i) => {
                const p = products.find((x) => x.id === l.productId);
                return (
                  <div key={i} className="flex items-center gap-2">
                    <select
                      value={l.productId}
                      onChange={(e) => setLine(i, { productId: e.target.value })}
                      className="flex-1 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm outline-none focus:border-primary/50"
                    >
                      {products.map((pr) => (
                        <option key={pr.id} value={pr.id}>{pr.name} · {pr.stock} in stock</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={1}
                      value={l.qtyBoxes || ""}
                      onChange={(e) => setLine(i, { qtyBoxes: Number(e.target.value) || 0 })}
                      placeholder="Boxes"
                      className="w-24 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm outline-none focus:border-primary/50"
                    />
                    {lines.length > 1 && (
                      <button onClick={() => setLines((prev) => prev.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })}
              <button
                onClick={() => setLines((prev) => [...prev, { productId: products[0]?.id ?? "", qtyBoxes: 0 }])}
                className="flex items-center gap-1 text-xs text-primary"
              >
                <Plus className="h-3.5 w-3.5" /> Add tile
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
              <span className="text-muted-foreground">Order total</span>
              <span className="font-display text-lg font-semibold">{inr(total)}</span>
            </div>

            <button
              onClick={submit}
              disabled={!customer.trim() || total === 0}
              className="w-full rounded-xl gold-gradient px-4 py-2.5 font-semibold text-primary-foreground disabled:opacity-40"
            >
              Create order & generate invoice
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
