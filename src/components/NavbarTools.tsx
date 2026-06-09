import { Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  Search, Bell, X, Package, ShoppingCart, Users, FileText, AlertTriangle, Clock, CheckCheck,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "../lib/store";
import { customers } from "../lib/mock-data";
import { useAuth } from "../lib/auth";

type Result = {
  id: string;
  label: string;
  sub: string;
  to: string;
  icon: typeof Package;
};

function useClickOutside<T extends HTMLElement>(onClose: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);
  return ref;
}

export function GlobalSearch() {
  const { products, orders, invoices } = useStore();
  const { canAccess } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo<Result[]>(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    const out: Result[] = [];
    if (canAccess("/catalog") || canAccess("/inventory")) {
      products.forEach((p) => {
        if (
          p.name.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          p.size.toLowerCase().includes(term) ||
          p.barcode.includes(term) ||
          p.id.toLowerCase().includes(term)
        )
          out.push({ id: p.id, label: p.name, sub: `${p.category} · ${p.size} · ${p.stock} in stock`, to: canAccess("/inventory") ? "/inventory" : "/catalog", icon: Package });
      });
    }
    if (canAccess("/orders")) {
      orders.forEach((o) => {
        if (o.id.toLowerCase().includes(term) || o.customer.toLowerCase().includes(term) || (o.mobile ?? "").includes(term))
          out.push({ id: o.id, label: o.id, sub: `${o.customer} · ${o.status}`, to: "/orders", icon: ShoppingCart });
      });
    }
    if (canAccess("/customers")) {
      customers.forEach((c) => {
        if (c.name.toLowerCase().includes(term) || c.mobile.includes(term) || c.city.toLowerCase().includes(term))
          out.push({ id: c.id, label: c.name, sub: `${c.type} · ${c.city}`, to: "/customers", icon: Users });
      });
    }
    if (canAccess("/invoices")) {
      invoices.forEach((inv) => {
        if (inv.id.toLowerCase().includes(term) || inv.customer.toLowerCase().includes(term))
          out.push({ id: inv.id, label: inv.id, sub: `${inv.customer} · invoice`, to: "/invoices", icon: FileText });
      });
    }
    return out.slice(0, 8);
  }, [q, products, orders, invoices, canAccess]);

  useEffect(() => setActive(0), [q]);

  function go(r: Result) {
    setOpen(false);
    setQ("");
    navigate({ to: r.to });
  }

  useEffect(() => {
    function key(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => {
          setOpen((v) => !v);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground sm:flex sm:w-auto sm:gap-2 sm:px-3"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
        <span className="hidden text-xs text-muted-foreground md:inline">Search…</span>
        <kbd className="hidden rounded border border-border px-1.5 text-[10px] text-muted-foreground md:inline">⌘K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute right-0 z-50 mt-2 w-[min(92vw,26rem)] overflow-hidden rounded-xl border border-border bg-popover shadow-[var(--shadow-elegant)]"
          >
            <div className="flex items-center gap-2 border-b border-border px-3">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
                  if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
                  if (e.key === "Enter" && results[active]) go(results[active]);
                  if (e.key === "Escape") setOpen(false);
                }}
                placeholder="Search tiles, orders, customers, invoices…"
                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {q && (
                <button onClick={() => setQ("")} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto p-1.5">
              {!q.trim() && <p className="px-3 py-6 text-center text-xs text-muted-foreground">Start typing to search across the showroom.</p>}
              {q.trim() && results.length === 0 && <p className="px-3 py-6 text-center text-xs text-muted-foreground">No matches for “{q}”.</p>}
              {results.map((r, i) => (
                <button
                  key={`${r.to}-${r.id}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(r)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${i === active ? "bg-accent/50" : "hover:bg-accent/30"}`}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                    <r.icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{r.label}</span>
                    <span className="block truncate text-xs text-muted-foreground">{r.sub}</span>
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const LOW_STOCK = 30;

export function Notifications() {
  const { products, orders } = useStore();
  const { canAccess } = useAuth();
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

  const items = useMemo(() => {
    const out: { id: string; title: string; sub: string; to: string; icon: typeof AlertTriangle; tone: string }[] = [];
    if (canAccess("/inventory") || canAccess("/catalog")) {
      products
        .filter((p) => p.stock <= LOW_STOCK)
        .forEach((p) =>
          out.push({
            id: `stock-${p.id}`,
            title: `Low stock: ${p.name}`,
            sub: `Only ${p.stock} boxes left — restock soon`,
            to: canAccess("/inventory") ? "/inventory" : "/catalog",
            icon: AlertTriangle,
            tone: "text-warning",
          }),
        );
    }
    if (canAccess("/orders")) {
      orders
        .filter((o) => o.status === "Pending")
        .forEach((o) =>
          out.push({
            id: `order-${o.id}`,
            title: `Pending order ${o.id}`,
            sub: `${o.customer} · awaiting dispatch`,
            to: "/orders",
            icon: Clock,
            tone: "text-primary",
          }),
        );
    }
    return out;
  }, [products, orders, canAccess]);

  const unread = items.filter((i) => !readIds.has(i.id)).length;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute right-0 z-50 mt-2 w-[min(92vw,22rem)] overflow-hidden rounded-xl border border-border bg-popover shadow-[var(--shadow-elegant)]"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-sm font-semibold">Notifications</span>
              {unread > 0 && (
                <button
                  onClick={() => setReadIds(new Set(items.map((i) => i.id)))}
                  className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {items.length === 0 && <p className="px-4 py-8 text-center text-xs text-muted-foreground">You're all caught up 🎉</p>}
              {items.map((n) => {
                const isRead = readIds.has(n.id);
                return (
                  <Link
                    key={n.id}
                    to={n.to}
                    onClick={() => {
                      setReadIds((s) => new Set(s).add(n.id));
                      setOpen(false);
                    }}
                    className="flex items-start gap-3 border-b border-border/60 px-4 py-3 transition-colors last:border-0 hover:bg-accent/30"
                  >
                    <span className={`mt-0.5 shrink-0 ${n.tone}`}>
                      <n.icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block text-sm ${isRead ? "text-muted-foreground" : "font-medium"}`}>{n.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">{n.sub}</span>
                    </span>
                    {!isRead && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
