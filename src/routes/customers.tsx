import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus, Phone, Mail, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { PageHeader, Panel } from "@/components/ui-bits";
import { customers, orders, inr, type Customer } from "@/lib/mock-data";

export const Route = createFileRoute("/customers")({
  head: () => ({ meta: [{ title: "Customers — Universal Ceramics" }] }),
  component: Customers,
});

const TABS = ["Orders", "Invoices", "Deliveries", "Payments", "Documents", "Projects", "Wishlist", "Timeline"];

function Customers() {
  const [active, setActive] = useState<Customer>(customers[0]);
  const [tab, setTab] = useState("Orders");
  const [q, setQ] = useState("");
  const filtered = customers.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
  const custOrders = orders.filter((o) => o.customer === active.name);

  return (
    <div>
      <PageHeader
        title="Customer Database"
        subtitle="Full 360° CRM — orders, invoices, deliveries & history in one view"
        action={
          <button className="flex items-center gap-2 rounded-xl gold-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground">
            <Plus className="h-4 w-4" /> Add Customer
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
        <Panel className="p-4">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search customers…"
              className="w-full rounded-lg border border-border bg-secondary/40 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary/50"
            />
          </div>
          <div className="space-y-1.5">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c)}
                className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors ${
                  active.id === c.id ? "border border-primary/40 bg-primary/10" : "hover:bg-secondary/40"
                }`}
              >
                <div className="grid h-9 w-9 place-items-center rounded-lg gold-gradient text-xs font-bold text-primary-foreground">
                  {c.name.split(" ").map((x) => x[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.type} · {c.city}</div>
                </div>
              </button>
            ))}
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-2xl gold-gradient text-lg font-bold text-primary-foreground">
                  {active.name.split(" ").map((x) => x[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold">{active.name}</h2>
                  <div className="mt-1 inline-flex rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs text-primary">{active.type}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 text-right">
                <div><div className="text-xs text-muted-foreground">Orders</div><div className="font-display text-lg font-semibold">{active.orders}</div></div>
                <div><div className="text-xs text-muted-foreground">Lifetime</div><div className="font-display text-lg font-semibold gold-text">{inr(active.spend)}</div></div>
                <div><div className="text-xs text-muted-foreground">GST</div><div className="text-sm font-medium">{active.gst}</div></div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4 text-primary" />{active.mobile}</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="h-4 w-4 text-primary" />{active.email}</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4 text-primary" />{active.city}</div>
            </div>
          </Panel>

          <Panel>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-full px-3 py-1.5 text-xs transition-colors ${tab === t ? "gold-gradient text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {t}
                </button>
              ))}
            </div>
            {tab === "Orders" && custOrders.length > 0 ? (
              <div className="space-y-2">
                {custOrders.map((o) => (
                  <motion.div key={o.id} whileHover={{ x: 3 }} className="flex items-center justify-between rounded-lg bg-secondary/40 p-3 text-sm">
                    <span className="font-medium">{o.id}</span>
                    <span className="text-muted-foreground">{o.date}</span>
                    <span>{o.status}</span>
                    <span className="font-medium">{inr(o.total)}</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="grid h-40 place-items-center text-sm text-muted-foreground">
                {tab} timeline for {active.name} will appear here.
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
