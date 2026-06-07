import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  LayoutDashboard, ShoppingCart, Users, Boxes, BookImage, FileText,
  Truck, BarChart3, Sparkles, Settings, Calculator, Bell, Search, LogOut, ShieldAlert,
} from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "../lib/auth";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/orders", label: "Orders", icon: ShoppingCart },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/inventory", label: "Inventory", icon: Boxes },
  { to: "/catalog", label: "Catalog", icon: BookImage },
  { to: "/invoices", label: "Invoices", icon: FileText },
  { to: "/deliveries", label: "Deliveries", icon: Truck },
  { to: "/calculator", label: "Calculator", icon: Calculator },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/copilot", label: "AI Copilot", icon: Sparkles },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout, canAccess } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const nav = NAV.filter((n) => canAccess(n.to));
  const initials = (user?.name ?? "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const blocked = !canAccess(pathname);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 glass border-b">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-6 px-6">
          <Link to={user?.role === "worker" ? "/orders" : "/"} className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl gold-gradient font-display text-lg font-bold text-primary-foreground shadow-[var(--shadow-glow)]">
              U
            </div>
            <div className="leading-tight">
              <div className="font-display text-sm font-semibold tracking-wide">UNIVERSAL CERAMICS</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Showroom OS</div>
            </div>
          </Link>

          <nav className="hide-scroll ml-2 flex flex-1 items-center gap-1 overflow-x-auto scrollbar-thin">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="group relative whitespace-nowrap rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground"
              >
                {({ isActive }) => (
                  <span className="flex items-center gap-2">
                    <n.icon className="h-4 w-4" />
                    {n.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-lg border border-primary/40 bg-primary/10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground">
              <Search className="h-4 w-4" />
            </button>
            <button className="relative grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
            </button>
            <div className="flex items-center gap-2 rounded-lg border border-border py-1 pl-1 pr-3">
              <div className="grid h-7 w-7 place-items-center rounded-md gold-gradient text-xs font-bold text-primary-foreground">{initials || "U"}</div>
              <div className="leading-tight">
                <div className="text-xs font-medium">{user?.name}</div>
                <div className="text-[10px] capitalize text-muted-foreground">{user?.role}</div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-6 py-8">
        {blocked ? <AccessDenied /> : children}
      </main>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="mx-auto mt-20 max-w-md rounded-2xl border border-border bg-card p-10 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-destructive/10 text-destructive">
        <ShieldAlert className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-lg font-semibold">Restricted area</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Your account doesn't have permission to view this page. Please use the menu to navigate.
      </p>
      <Link
        to="/orders"
        className="mt-6 inline-flex rounded-lg gold-gradient px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        Go to Orders
      </Link>
    </div>
  );
}
