import { createFileRoute } from "@tanstack/react-router";
import { QrCode, Barcode, AlertTriangle } from "lucide-react";
import { PageHeader, Panel, StatCard } from "@/components/ui-bits";
import { products, inr } from "@/lib/mock-data";

export const Route = createFileRoute("/inventory")({
  head: () => ({ meta: [{ title: "Inventory — Universal Ceramics" }] }),
  component: Inventory,
});

function Inventory() {
  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const reserved = products.reduce((s, p) => s + p.reserved, 0);
  const low = products.filter((p) => p.stock <= 30);

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
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 border-b border-border px-6 py-3 text-xs uppercase tracking-wider text-muted-foreground">
          <span>Product</span><span>Available</span><span>Reserved</span><span>Total</span><span>Value</span><span>Codes</span>
        </div>
        {products.map((p) => {
          const isLow = p.stock <= 30;
          return (
            <div key={p.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] items-center gap-4 border-b border-border/50 px-6 py-4 text-sm last:border-0">
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
            </div>
          );
        })}
      </Panel>
    </div>
  );
}
