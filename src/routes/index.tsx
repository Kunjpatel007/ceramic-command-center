import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import {
  IndianRupee, Clock, Truck, PackageCheck, AlertTriangle, TrendingUp, Activity,
} from "lucide-react";
import { StatCard, Panel, StatusBadge, Progress } from "@/components/ui-bits";
import {
  orders, products, activities, staff, revenueTrend, inr, orderProgress,
} from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Command Center — Universal Ceramics Showroom OS" },
      { name: "description", content: "Executive command center for the Universal Ceramics showroom operating system." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const pending = orders.filter((o) => o.status === "Pending").length;
  const partial = orders.filter((o) => o.status === "Partially Delivered").length;
  const delivered = orders.filter((o) => o.status === "Delivered").length;
  const lowStock = products.filter((p) => p.stock <= 30);
  const topProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-primary">Executive Command Center</p>
          <h1 className="mt-1 font-display text-3xl font-semibold">Good evening, Rohan</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs text-success">
          <span className="h-2 w-2 animate-pulse rounded-full bg-success" /> Live sync active
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Today's Revenue" value={inr(434000)} hint="+18% vs yesterday" icon={<IndianRupee className="h-4 w-4" />} accent delay={0} />
        <StatCard label="Monthly Revenue" value={inr(8642000)} hint="+12% vs last month" icon={<TrendingUp className="h-4 w-4" />} delay={0.05} />
        <StatCard label="Pending Orders" value={String(pending)} hint="awaiting dispatch" icon={<Clock className="h-4 w-4" />} delay={0.1} />
        <StatCard label="Partially Delivered" value={String(partial)} hint="in progress" icon={<Truck className="h-4 w-4" />} delay={0.15} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Delivered Orders" value={String(delivered)} hint="completed" icon={<PackageCheck className="h-4 w-4" />} delay={0.2} />
        <StatCard label="Low Stock Alerts" value={String(lowStock.length)} hint="needs reorder" icon={<AlertTriangle className="h-4 w-4" />} delay={0.25} />
        <StatCard label="Active Customers" value="312" hint="this quarter" icon={<Activity className="h-4 w-4" />} delay={0.3} />
        <StatCard label="Avg. Order Value" value={inr(186000)} hint="+5% MoM" icon={<TrendingUp className="h-4 w-4" />} delay={0.35} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Revenue Trends</h3>
            <span className="text-xs text-muted-foreground">Last 7 days (₹ thousands)</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueTrend} margin={{ left: -16, right: 8 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.82 0.13 78)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.82 0.13 78)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.008 60)" vertical={false} />
              <XAxis dataKey="day" stroke="oklch(0.6 0.01 70)" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis stroke="oklch(0.6 0.01 70)" tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip
                contentStyle={{ background: "oklch(0.2 0.006 60)", border: "1px solid oklch(0.32 0.008 60)", borderRadius: 12, color: "#fff" }}
              />
              <Area type="monotone" dataKey="revenue" stroke="oklch(0.82 0.13 78)" strokeWidth={2.5} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel>
          <h3 className="mb-4 font-display text-lg font-semibold">Top Products</h3>
          <div className="space-y-4">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="w-5 font-display text-sm text-primary">{i + 1}</span>
                <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.sold} boxes sold</div>
                </div>
                <span className="text-sm font-medium gold-text">{inr(p.price)}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <h3 className="mb-4 font-display text-lg font-semibold">Recent Orders</h3>
          <div className="space-y-3">
            {orders.map((o) => (
              <motion.div
                key={o.id}
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 rounded-xl border border-border bg-secondary/40 p-3"
              >
                <div className="w-24">
                  <div className="text-sm font-medium">{o.id}</div>
                  <div className="text-xs text-muted-foreground">{o.date}</div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm">{o.customer}</div>
                  <div className="mt-1.5"><Progress value={orderProgress(o)} /></div>
                </div>
                <StatusBadge status={o.status} />
                <div className="w-24 text-right text-sm font-medium">{inr(o.total)}</div>
              </motion.div>
            ))}
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel>
            <h3 className="mb-4 font-display text-lg font-semibold">Recent Activity</h3>
            <div className="space-y-3">
              {activities.map((a, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <div>
                    <span className="font-medium">{a.who}</span>{" "}
                    <span className="text-muted-foreground">{a.what}</span>
                    <div className="text-xs text-muted-foreground">{a.when}</div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <h3 className="mb-4 font-display text-lg font-semibold">Staff Activity</h3>
            <div className="space-y-3">
              {staff.map((s) => (
                <div key={s.name} className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-lg gold-gradient text-xs font-bold text-primary-foreground">
                    {s.name.split(" ").map((x) => x[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.role}</div>
                  </div>
                  <span className={`text-xs ${s.status === "Active" ? "text-success" : "text-muted-foreground"}`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
