import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Send } from "lucide-react";
import { PageHeader, Panel } from "@/components/ui-bits";
import { orders, products, customers, inr } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/copilot")({
  head: () => ({ meta: [{ title: "AI Copilot — Universal Ceramics" }] }),
  component: Copilot,
});

const SUGGESTIONS = [
  "Show today's revenue",
  "Show pending deliveries",
  "Which tile sold most this month?",
  "Show low stock products",
  "Generate business insights",
];

function answer(q: string): string {
  const s = q.toLowerCase();
  if (s.includes("revenue")) return `Today's revenue is ${inr(434000)}, up 18% versus yesterday. Monthly revenue stands at ${inr(8642000)}.`;
  if (s.includes("pending") || s.includes("deliver")) {
    const p = orders.filter((o) => o.status !== "Delivered");
    return `There are ${p.length} orders awaiting delivery: ${p.map((o) => `${o.id} (${o.status})`).join(", ")}.`;
  }
  if (s.includes("most") || s.includes("best")) {
    const top = [...products].sort((a, b) => b.sold - a.sold)[0];
    return `${top.name} is the top seller with ${top.sold} boxes sold at ${inr(top.price)} per box.`;
  }
  if (s.includes("low stock") || s.includes("stock")) {
    const low = products.filter((p) => p.stock <= 30);
    return `${low.length} products are low on stock: ${low.map((p) => `${p.name} (${p.stock} boxes)`).join(", ")}. Reorder recommended.`;
  }
  if (s.includes("customer")) {
    const top = [...customers].sort((a, b) => b.spend - a.spend)[0];
    return `Your highest-value customer is ${top.name} with lifetime spend of ${inr(top.spend)} across ${top.orders} orders.`;
  }
  return "Based on current data: revenue is trending up 12% MoM, repeat customer rate is 58%, and 3 SKUs need reordering. Focus on restocking Premium Grey and Terra Sand to avoid lost sales.";
}

interface Msg { role: "user" | "ai"; text: string }

function Copilot() {
  const { user } = useAuth();
  const userName = user?.name || "Admin";
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: `Hello ${userName} — I'm your AI Business Copilot, connected to live showroom data. Ask me anything.` },
  ]);
  const [input, setInput] = useState("");

  const ask = (q: string) => {
    if (!q.trim()) return;
    setMsgs((m) => [...m, { role: "user", text: q }, { role: "ai", text: answer(q) }]);
    setInput("");
  };

  return (
    <div>
      <PageHeader title="AI Business Copilot" subtitle="Natural-language answers from your live business database" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        <Panel className="flex h-[60vh] flex-col p-0">
          <div className="flex-1 space-y-4 overflow-y-auto scrollbar-thin p-6">
            {msgs.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}
              >
                {m.role === "ai" && (
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg gold-gradient text-primary-foreground">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${m.role === "user" ? "gold-gradient text-primary-foreground" : "bg-secondary/60"}`}>
                  {m.text}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="border-t border-border p-4">
            <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your business anything…"
                className="flex-1 rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none focus:border-primary/50"
              />
              <button type="submit" className="grid h-12 w-12 place-items-center rounded-xl gold-gradient text-primary-foreground">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </Panel>

        <Panel>
          <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">Suggested</h3>
          <div className="space-y-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => ask(s)}
                className="w-full rounded-xl border border-border bg-secondary/30 p-3 text-left text-sm transition-colors hover:border-primary/40"
              >
                {s}
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
