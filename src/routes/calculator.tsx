import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { PageHeader, Panel } from "@/components/ui-bits";
import { inr } from "@/lib/mock-data";

export const Route = createFileRoute("/calculator")({
  head: () => ({ meta: [{ title: "Tile Calculator — Universal Ceramics" }] }),
  component: TileCalculator,
});

interface Room {
  name: string;
  length: number;
  width: number;
}

const BOX_COVERAGE = 1.44; // sqm per box
const RATE = 1120; // per box
const WASTAGE = 0.1;

function TileCalculator() {
  const [rooms, setRooms] = useState<Room[]>([
    { name: "Living Room", length: 6, width: 5 },
    { name: "Bedroom", length: 4, width: 3.5 },
    { name: "Kitchen", length: 3, width: 3 },
    { name: "Bathroom", length: 2.4, width: 2 },
  ]);

  const update = (i: number, key: keyof Room, val: string) =>
    setRooms((r) => r.map((room, idx) => (idx === i ? { ...room, [key]: key === "name" ? val : Number(val) } : room)));

  const totalArea = rooms.reduce((s, r) => s + r.length * r.width, 0);
  const withWastage = totalArea * (1 + WASTAGE);
  const boxes = Math.ceil(withWastage / BOX_COVERAGE);
  const cost = boxes * RATE;

  return (
    <div>
      <PageHeader title="Smart Tile Calculator" subtitle="Room-by-room area, boxes, wastage & cost — flows into quotations" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Rooms</h3>
            <button
              onClick={() => setRooms((r) => [...r, { name: "New Room", length: 3, width: 3 }])}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm hover:border-primary/50"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
          <div className="space-y-3">
            {rooms.map((r, i) => (
              <div key={i} className="grid grid-cols-[2fr_1fr_1fr_auto] items-center gap-3 rounded-xl bg-secondary/40 p-3">
                <input value={r.name} onChange={(e) => update(i, "name", e.target.value)} className="rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/50" />
                <input type="number" value={r.length} onChange={(e) => update(i, "length", e.target.value)} className="rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/50" placeholder="Length m" />
                <input type="number" value={r.width} onChange={(e) => update(i, "width", e.target.value)} className="rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/50" placeholder="Width m" />
                <button onClick={() => setRooms((rr) => rr.filter((_, idx) => idx !== i))} className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="border-primary/40 shadow-[var(--shadow-glow)]">
          <h3 className="mb-4 font-display text-lg font-semibold">Estimate</h3>
          <Row label="Total Area" value={`${totalArea.toFixed(2)} m²`} />
          <Row label={`Wastage (${WASTAGE * 100}%)`} value={`${(withWastage - totalArea).toFixed(2)} m²`} />
          <Row label="Area + Wastage" value={`${withWastage.toFixed(2)} m²`} />
          <Row label="Tiles Required" value={`${Math.ceil(withWastage / 0.72)} pcs`} />
          <Row label="Boxes Required" value={`${boxes} boxes`} />
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm text-muted-foreground">Estimated Cost</span>
            <span className="font-display text-2xl font-semibold gold-text">{inr(cost)}</span>
          </div>
          <button className="mt-5 w-full rounded-xl gold-gradient py-3 text-sm font-semibold text-primary-foreground">
            Convert to Quotation
          </button>
        </Panel>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
