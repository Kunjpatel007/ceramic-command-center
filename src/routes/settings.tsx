import { createFileRoute } from "@tanstack/react-router";
import { Shield, KeyRound, Users, ScrollText } from "lucide-react";
import { PageHeader, Panel } from "@/components/ui-bits";
import { staff, activities } from "@/lib/mock-data";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Universal Ceramics" }] }),
  component: Settings,
});

const ROLES = [
  { role: "Owner", perms: "Full access · all modules & reports" },
  { role: "Manager", perms: "Orders, deliveries, customers, analytics" },
  { role: "Worker", perms: "Deliveries & inventory updates" },
  { role: "Accountant", perms: "Invoices, payments & financial reports" },
];

function Settings() {
  return (
    <div>
      <PageHeader title="Settings & Security" subtitle="Roles, access control, security PIN & activity logs" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel>
          <div className="mb-4 flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /><h3 className="font-display text-lg font-semibold">Security</h3></div>
          <div className="space-y-3">
            <Field label="Username" value="admin" icon={<Users className="h-4 w-4" />} />
            <Field label="Password" value="••••••••••" icon={<KeyRound className="h-4 w-4" />} />
            <div className="rounded-xl bg-secondary/40 p-4">
              <div className="mb-2 text-sm text-muted-foreground">4-Digit Security PIN</div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="grid h-12 w-12 place-items-center rounded-lg border border-primary/40 bg-background/60 font-display text-xl">•</div>
                ))}
              </div>
            </div>
          </div>
        </Panel>

        <Panel>
          <div className="mb-4 flex items-center gap-2"><Users className="h-5 w-5 text-primary" /><h3 className="font-display text-lg font-semibold">Roles & Permissions</h3></div>
          <div className="space-y-2">
            {ROLES.map((r) => (
              <div key={r.role} className="rounded-xl bg-secondary/40 p-3">
                <div className="text-sm font-semibold gold-text">{r.role}</div>
                <div className="text-xs text-muted-foreground">{r.perms}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <div className="mb-4 flex items-center gap-2"><Users className="h-5 w-5 text-primary" /><h3 className="font-display text-lg font-semibold">Team</h3></div>
          <div className="space-y-2">
            {staff.map((s) => (
              <div key={s.name} className="flex items-center gap-3 rounded-xl bg-secondary/40 p-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg gold-gradient text-xs font-bold text-primary-foreground">{s.name.split(" ").map((x) => x[0]).join("")}</div>
                <div className="flex-1"><div className="text-sm font-medium">{s.name}</div><div className="text-xs text-muted-foreground">{s.role}</div></div>
                <span className={`text-xs ${s.status === "Active" ? "text-success" : "text-muted-foreground"}`}>{s.status}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <div className="mb-4 flex items-center gap-2"><ScrollText className="h-5 w-5 text-primary" /><h3 className="font-display text-lg font-semibold">Activity Log</h3></div>
          <div className="space-y-3">
            {activities.map((a, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <div><span className="font-medium">{a.who}</span> <span className="text-muted-foreground">{a.what}</span><div className="text-xs text-muted-foreground">{a.when}</div></div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Field({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-secondary/40 p-3">
      <span className="text-primary">{icon}</span>
      <div className="flex-1"><div className="text-xs text-muted-foreground">{label}</div><div className="text-sm font-medium">{value}</div></div>
    </div>
  );
}
