import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Box, Check, Info, Ruler, Sparkles, Package } from "lucide-react";
import { PageHeader, Panel } from "@/components/ui-bits";
import { inr, type Product } from "@/lib/mock-data";
import { useStore, createOrder } from "@/lib/store";

export const Route = createFileRoute("/catalog/$productId")({
  head: () => ({ meta: [{ title: "Tile Details — Universal Ceramics" }] }),
  component: TileDetail,
  notFoundComponent: () => (
    <div className="p-10 text-center">
      <p className="text-muted-foreground">Tile not found.</p>
      <Link to="/catalog" className="mt-4 inline-block text-primary underline">Back to catalog</Link>
    </div>
  ),
});

function instructionsFor(p: Product): string[] {
  return [
    `Recommended for ${p.category.toLowerCase()} applications with a ${p.finish.toLowerCase()} finish.`,
    `Each box covers approximately ${p.size.includes("1200") ? "1.44" : "1.08"} sq.m. Order 5–10% extra for cuts and wastage.`,
    "Acclimatise tiles on-site for 24 hours before laying. Use a notched trowel and high-grip adhesive.",
    "Maintain consistent 2–3mm spacing with tile spacers; grout after 24 hours of setting.",
    "Clean with a pH-neutral cleaner. Avoid acidic or abrasive agents to preserve the surface.",
  ];
}

function TileDetail() {
  const { productId } = Route.useParams();
  const { products } = useStore();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === productId);

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const [showOrder, setShowOrder] = useState(false);
  const [customer, setCustomer] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [qty, setQty] = useState("1");
  const [done, setDone] = useState(false);

  const instructions = useMemo(() => (product ? instructionsFor(product) : []), [product]);

  if (!product) {
    return (
      <div className="p-10 text-center">
        <p className="text-muted-foreground">Tile not found.</p>
        <Link to="/catalog" className="mt-4 inline-block text-primary underline">Back to catalog</Link>
      </div>
    );
  }

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -py * 18, y: px * 18 });
  }

  const boxes = Math.max(1, parseInt(qty) || 1);
  const total = boxes * product.price;

  function placeOrder() {
    if (!customer.trim()) return;
    createOrder(customer.trim(), [{ productId: product!.id, qtyBoxes: boxes }], {
      mobile: mobile.trim() || undefined,
      address: address.trim() || undefined,
    });
    setDone(true);
    setTimeout(() => navigate({ to: "/orders" }), 900);
  }

  return (
    <div>
      <Link to="/catalog" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to catalog
      </Link>

      <PageHeader title={product.name} subtitle={`${product.size} · ${product.finish} · ${product.category}`} />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 3D Visualization */}
        <Panel className="flex flex-col items-center justify-center bg-secondary/30" >
          <div className="mb-4 flex items-center gap-2 self-start text-sm font-medium text-muted-foreground">
            <Box className="h-4 w-4 text-primary" /> 3D Visualization
          </div>
          <div
            className="flex h-72 w-full items-center justify-center"
            style={{ perspective: "900px" }}
            onMouseMove={onMove}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          >
            <motion.div
              ref={cardRef}
              className="relative h-56 w-56 rounded-lg shadow-2xl"
              style={{
                transformStyle: "preserve-3d",
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              }}
              animate={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
              transition={{ type: "spring", stiffness: 120, damping: 12 }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 h-full w-full rounded-lg object-cover"
                style={{ transform: "translateZ(18px)" }}
              />
              <div
                className="absolute inset-0 rounded-lg bg-foreground/40"
                style={{ transform: "translateZ(-6px)" }}
              />
            </motion.div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Move your cursor over the tile to rotate it.</p>
        </Panel>

        {/* Info + price */}
        <div className="space-y-6">
          <Panel>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Price</div>
                <div className="mt-1 font-display text-3xl font-semibold gold-text">{inr(product.price)}</div>
                <div className="text-xs text-muted-foreground">per box</div>
              </div>
              <button
                onClick={() => setShowOrder((v) => !v)}
                className="flex items-center gap-2 rounded-xl gold-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
              >
                <Package className="h-4 w-4" /> Create Order
              </button>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <Spec icon={<Ruler className="h-4 w-4" />} label="Size" value={product.size} />
              <Spec icon={<Sparkles className="h-4 w-4" />} label="Finish" value={product.finish} />
              <Spec icon={<Info className="h-4 w-4" />} label="Category" value={product.category} />
              <Spec icon={<Package className="h-4 w-4" />} label="In stock" value={`${product.stock} boxes`} />
              <Spec icon={<Info className="h-4 w-4" />} label="Barcode" value={product.barcode} />
              <Spec icon={<Check className="h-4 w-4" />} label="Sold" value={`${product.sold} boxes`} />
            </div>
          </Panel>

          {showOrder && (
            <Panel>
              <h3 className="mb-4 font-display text-lg font-semibold">Create Order</h3>
              {done ? (
                <div className="flex items-center gap-2 text-success">
                  <Check className="h-5 w-5" /> Order placed! Redirecting…
                </div>
              ) : (
                <div className="space-y-3">
                  <Field label="Customer name" value={customer} onChange={setCustomer} placeholder="e.g. Mehta Constructions" />
                  <Field label="Mobile number" value={mobile} onChange={setMobile} placeholder="+91 98XXXXXXXX" />
                  <Field label="Delivery address" value={address} onChange={setAddress} placeholder="Street, city, pincode" />
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">Quantity (boxes)</label>
                    <input
                      type="number"
                      min={1}
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-sm outline-none focus:border-primary/50"
                    />
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
                    <span className="text-muted-foreground">Total ({boxes} boxes)</span>
                    <span className="font-semibold gold-text">{inr(total)}</span>
                  </div>
                  <button
                    onClick={placeOrder}
                    disabled={!customer.trim()}
                    className="w-full rounded-xl gold-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] disabled:opacity-50"
                  >
                    Place Order
                  </button>
                </div>
              )}
            </Panel>
          )}
        </div>
      </div>

      {/* Instructions */}
      <Panel className="mt-6">
        <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
          <Info className="h-5 w-5 text-primary" /> Installation & Care Instructions
        </h3>
        <ul className="space-y-2.5">
          {instructions.map((line, i) => (
            <li key={i} className="flex gap-3 text-sm text-muted-foreground">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 px-3 py-2">
      <span className="text-primary">{icon}</span>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="truncate font-medium">{value}</div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="mb-1 block text-xs text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-sm outline-none focus:border-primary/50"
      />
    </div>
  );
}
