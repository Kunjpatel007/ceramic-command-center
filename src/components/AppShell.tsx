import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  LayoutDashboard, ShoppingCart, Users, Boxes, BookImage, FileText,
  BarChart3, Sparkles, Settings, Calculator, LogOut, ShieldAlert,
  Menu, X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useAuth } from "../lib/auth";
import { GlobalSearch, Notifications } from "./NavbarTools";
import logo from "../assets/universal-ceramics-logo.png.asset.json";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/catalog", label: "Tiles Catalog", icon: BookImage },
  { to: "/orders", label: "Orders", icon: ShoppingCart },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/inventory", label: "Inventory", icon: Boxes },
  { to: "/invoices", label: "Invoices", icon: FileText },
  { to: "/calculator", label: "Calculator", icon: Calculator },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/copilot", label: "AI Copilot", icon: Sparkles },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout, canAccess } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);

  const nav = NAV.filter((n) => canAccess(n.to));
  const home = user?.role === "worker" ? "/catalog" : "/";
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
        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-4 sm:gap-6 sm:px-6">
          <Link to={home} className="flex shrink-0 items-center gap-3">
            <img
              src={logo.url}
              alt="Universal Ceramics"
              className="h-10 w-auto object-contain"
            />
            <div className="hidden leading-tight sm:block">
              <div className="text-white ">Universal Ceramics</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hide-scroll ml-2 hidden flex-1 items-center gap-1 overflow-x-auto scrollbar-thin lg:flex">
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

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <GlobalSearch />
            <Notifications />
            <div className="flex items-center gap-2 rounded-lg border border-border py-1 pl-1 pr-1 sm:pr-3">
              <div className="grid h-7 w-7 place-items-center rounded-md gold-gradient text-xs font-bold text-primary-foreground">{initials || "U"}</div>
              <div className="hidden leading-tight sm:block">
                <div className="text-xs font-medium">{user?.name}</div>
                <div className="text-[10px] capitalize text-muted-foreground">{user?.role}</div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="hidden h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground sm:grid"
            >
              <LogOut className="h-4 w-4" />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground lg:hidden"
              aria-label="Menu"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border lg:hidden"
            >
              <div className="grid gap-1 px-4 py-3 sm:px-6">
                {nav.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    activeOptions={{ exact: n.to === "/" }}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground data-[status=active]:bg-primary/10 data-[status=active]:text-foreground"
                  >
                    <n.icon className="h-4 w-4" />
                    {n.label}
                  </Link>
                ))}
                <button
                  onClick={() => { setMenuOpen(false); logout(); }}
                  className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8">
        {blocked ? (
          <AccessDenied />
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}

function AccessDenied() {
  const { user } = useAuth();
  const home = user?.role === "worker" ? "/catalog" : "/";
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
        to={home}
        className="mt-6 inline-flex rounded-lg gold-gradient px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        Go to {user?.role === "worker" ? "Catalog" : "Dashboard"}
      </Link>
    </div>
  );
}
