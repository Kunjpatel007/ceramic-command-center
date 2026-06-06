import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
} from "recharts";
import { PageHeader, Panel, StatCard } from "@/components/ui-bits";
import { products, customers, revenueTrend, inr } from "@/lib/mock-data";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Universal Ceramics" }] }),
  component: Analytics,
});

const tooltip = { background: "oklch(0.2 0.006 60)", border: "1px solid oklch(0.32 0.008 60)", borderRadius: 12, color: "#fff" };

function Analytics() {
  const bestSellers = [...products].sort((a, b) => b.sold - a.sold).slice(0, 6).map((p) => ({ name: p.name, sold: p.sold }));
  const topCustomers = [...customers].sort((a, b) => b.spend - a.spend).slice(0, 5);

  return (
    <div>
      <PageHeader title="Analytics Center" subtitle="Revenue, sales, best sellers & customer intelligence" />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Gross Revenue" value={inr(8642000)} hint="this month" accent />
        <StatCard label="Net Profit" value={inr(2310000)} hint="26.7% margin" delay={0.05} />
        <StatCard label="Orders" value="146" hint="+12% MoM" delay={0.1} />
        <StatCard label="Repeat Rate" value="58%" hint="loyal customers" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel>
          <h3 className="mb-4 font-display text-lg font-semibold">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueTrend} margin={{ left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.008 60)" vertical={false} />
              <XAxis dataKey="day" stroke="oklch(0.6 0.01 70)" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis stroke="oklch(0.6 0.01 70)" tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip contentStyle={tooltip} />
              <Line type="monotone" dataKey="revenue" stroke="oklch(0.82 0.13 78)" strokeWidth={3} dot={{ r: 4, fill: "oklch(0.82 0.13 78)" }} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel>
          <h3 className="mb-4 font-display text-lg font-semibold">Best Sellers</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={bestSellers} margin={{ left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.008 60)" vertical={false} />
              <XAxis dataKey="name" stroke="oklch(0.6 0.01 70)" tickLine={false} axisLine={false} fontSize={10} interval={0} angle={-15} height={50} textAnchor="end" />
              <YAxis stroke="oklch(0.6 0.01 70)" tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip contentStyle={tooltip} cursor={{ fill: "oklch(0.3 0.008 60 / 30%)" }} />
              <Bar dataKey="sold" radius={[6, 6, 0, 0]}>
                {bestSellers.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? "oklch(0.82 0.13 78)" : "oklch(0.5 0.05 70)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel>
          <h3 className="mb-4 font-display text-lg font-semibold">Top Customers</h3>
          <div className="space-y-3">
            {topCustomers.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3">
                <span className="w-5 font-display text-sm text-primary">{i + 1}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.type} · {c.orders} orders</div>
                </div>
                <span className="font-medium gold-text">{inr(c.spend)}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <h3 className="mb-4 font-display text-lg font-semibold">Slow Moving Stock</h3>
          <div className="space-y-3">
            {[...products].sort((a, b) => a.sold - b.sold).slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <img src={p.image} alt={p.name} className="h-9 w-9 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.sold} sold · {p.stock} in stock</div>
                </div>
                <span className="text-xs text-warning">Review</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
