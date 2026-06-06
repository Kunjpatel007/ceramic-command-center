import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import { PageHeader, Panel } from "@/components/ui-bits";
import { products, inr } from "@/lib/mock-data";

export const Route = createFileRoute("/catalog")({
  head: () => ({ meta: [{ title: "Catalog — Universal Ceramics" }] }),
  component: Catalog,
});

function Catalog() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const cats = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  const list = products.filter(
    (p) => (cat === "All" || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div>
      <PageHeader title="Product Catalog" subtitle="Browse, filter and compare the full tile collection" />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tiles…"
            className="w-64 rounded-xl border border-border bg-secondary/40 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary/50"
          />
        </div>
        <div className="flex gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${cat === c ? "border-primary/40 bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ y: -6 }}
            className="panel group overflow-hidden p-0"
          >
            <div className="relative h-44 overflow-hidden">
              <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute right-3 top-3 rounded-full bg-background/70 px-2.5 py-1 text-xs backdrop-blur">{p.finish}</div>
              {p.stock <= 30 && <div className="absolute left-3 top-3 rounded-full bg-destructive/80 px-2.5 py-1 text-xs">Low stock</div>}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-semibold">{p.name}</h3>
                  <div className="text-xs text-muted-foreground">{p.size} · {p.category}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold gold-text">{inr(p.price)}</div>
                  <div className="text-xs text-muted-foreground">per box</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>{p.stock} in stock</span>
                <button className="rounded-lg border border-border px-3 py-1.5 text-foreground transition-colors hover:border-primary/50">Room Preview</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
