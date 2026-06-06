import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { QrCode, Barcode, AlertTriangle, PackagePlus, Check, X } from "lucide-react";
import { PageHeader, Panel, StatCard } from "@/components/ui-bits";
import { products as initialProducts, inr } from "@/lib/mock-data";
import type { Product } from "@/lib/mock-data";

export const Route = createFileRoute("/inventory")({
  head: () => ({ meta: [{ title: "Inventory — Universal Ceramics" }] }),
  component: Inventory,
});

function Inventory() {
  const [items, setItems] = useState<Product[]>(
    initialProducts.map((p) => ({ ...p }))
  );
  const [restocking, setRestocking] = useState<string | null>(null);
  const [restockQty, setRestockQty] = useState<string>("");

  const totalStock = items.reduce((s, p) => s + p.stock, 0);
  const reserved = items.reduce((s, p) => s + p.reserved, 0);
  const low = items.filter((p) => p.stock <= 30);

  function startRestock(id: string) {
    setRestocking(id);
    setRestockQty("");
  }

  function cancelRestock() {
    setRestocking(null);
    setRestockQty("");
  }

  function applyRestock(id: string) {
    const qty = parseInt(restockQty, 10);
    if (!qty || qty <= 0) return;
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: p.stock + qty } : p))
    );
    setRestocking(null);
    setRestockQty("");
  }

  return (
    <div>
      <PageHeader title="Inventory Management" subtitle="Real-time stock with reserved & available tracking" />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Stock" value={`${totalStock} boxes`} accent />
        <StatCard label="Reserved" value={`${reserved} boxes`} delay={0.05} />
        <StatCard label="Available" value={`${totalStock - reserved} boxes`} delay={0.1} />
        <StatCard label="Low Stock SKUs" value={String(low.length)} hint="reorder needed" icon={<AlertTriangle className="h-4 w-4" />} delay={0.15} />
      </div>

      <Panel className="p-0">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto_auto] gap-4 border-b border-border px-6 py-3 text-xs uppercase tracking-wider text-muted-foreground">
          <span>Product</span><span>Available</span><span>Reserved</span><span>Total</span><span>Value</span><span>Codes</span><span>Action</span>
        </div>
        {items.map((p) => {
          const isLow = p.stock <= 30;
          const isRestocking = restocking === p.id;
          return (
            <div key={p.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto_auto] items-center gap-4 border-b border-border/50 px-6 py-4 text-sm last:border-0">
              <div className="flex items-center gap-3">
                <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.id} · {p.size}</div>
                </div>
              </div>
              <span className={isLow ? "font-semibold text-destructive" : ""}>{p.stock - p.reserved}{isLow && " ⚠"}</span>
              <span className="text-muted-foreground">{p.reserved}</span>
              <span>{p.stock}</span>
              <span className="font-medium">{inr(p.stock * p.price)}</span>
              <div className="flex gap-2 text-muted-foreground">
                <Barcode className="h-4 w-4" /><QrCode className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2">
                {isRestocking ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      placeholder="Boxes"
                      value={restockQty}
                      onChange={(e) => setRestockQty(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") applyRestock(p.id);
                        if (e.key === "Escape") cancelRestock();
                      }}
                      className="h-8 w-20 rounded-md border border-border bg-background px-2 text-sm outline-none focus:border-primary"
                      autoFocus
                    />
                    <button
                      onClick={() => applyRestock(p.id)}
                      className="flex h-8 items-center gap-1 rounded-md bg-primary px-2 text-xs font-medium text-primary-foreground hover:opacity-90"
                    >
                      <Check className="h-3.5 w-3.5" /> Add
                    </button>
                    <button
                      onClick={cancelRestock}
                      className="flex h-8 items-center rounded-md border border-border px-2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startRestock(p.id)}
                    className="flex h-8 items-center gap-1 rounded-md border border-border px-3 text-xs font-medium text-muted-foreground transition hover:border-primary hover:text-foreground"
                  >
                    <PackagePlus className="h-3.5 w-3.5" /> Restock
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </Panel>
    </div>
  );
}
