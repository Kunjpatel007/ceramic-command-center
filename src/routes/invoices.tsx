import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Printer, Download, RotateCcw } from "lucide-react";
import { PageHeader, Panel } from "@/components/ui-bits";
import { inr } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import logo from "@/assets/universal-ceramics-logo.png.asset.json";

export const Route = createFileRoute("/invoices")({
  head: () => ({ meta: [{ title: "Invoices — Universal Ceramics" }] }),
  component: Invoices,
});

function Invoices() {
  const { invoices } = useStore();
  const [selected, setSelected] = useState(0);
  const o = invoices[selected] ?? invoices[0];

  return (
    <div>
      <PageHeader
        title="Invoice System"
        subtitle="Auto-generated GST invoices — every new order creates one instantly"
        action={
          <div className="flex gap-2">
            <button className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm hover:border-primary/50"><RotateCcw className="h-4 w-4" /> Reprint</button>
            <button onClick={() => window.print()} className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm hover:border-primary/50"><Printer className="h-4 w-4" /> Print</button>
            <button className="flex items-center gap-2 rounded-xl gold-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground"><Download className="h-4 w-4" /> PDF</button>
          </div>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {invoices.map((iv, i) => (
          <button
            key={iv.id}
            onClick={() => setSelected(i)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              i === selected ? "border-primary/40 bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {iv.id} · {iv.customer}
          </button>
        ))}
      </div>

      {o && (
      <Panel className="mx-auto max-w-3xl bg-white p-10 text-black">
        <div className="flex items-start justify-between border-b-2 border-black pb-6">
          <div className="flex items-center gap-3">
            <img src={logo.url} alt="Universal Ceramics" className="h-16 w-auto object-contain" />
            <div>
              <div className="font-display text-xl font-bold">UNIVERSAL CERAMICS</div>
              <div className="text-xs text-neutral-600">Premium Tiles & Sanitaryware</div>
            </div>
          </div>
          <div className="text-right text-sm">
            <div className="text-lg font-bold">TAX INVOICE</div>
            <div className="text-neutral-600">GSTIN: 27ABCDE1234F1Z5</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-6 text-sm">
          <div>
            <div className="text-xs uppercase text-neutral-500">Billed To</div>
            <div className="font-semibold">{o.customer}</div>
          </div>
          <div className="text-right">
            <div>Invoice #: {o.id}</div>
            <div>Order #: {o.orderId}</div>
            <div>Date: {o.date}</div>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-black text-left">
              <th className="py-2">Product</th><th className="py-2 text-right">Boxes</th>
              <th className="py-2 text-right">Rate</th><th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {o.items.map((i) => (
              <tr key={i.product} className="border-b border-neutral-200">
                <td className="py-2">{i.product}</td>
                <td className="py-2 text-right">{i.qtyBoxes}</td>
                <td className="py-2 text-right">{inr(i.rate)}</td>
                <td className="py-2 text-right">{inr(i.qtyBoxes * i.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 ml-auto w-60 text-sm">
          <div className="flex justify-between py-1"><span>Subtotal</span><span>{inr(o.subtotal)}</span></div>
          <div className="flex justify-between py-1"><span>GST (18%)</span><span>{inr(o.gst)}</span></div>
          <div className="mt-2 flex justify-between border-t-2 border-black pt-2 text-base font-bold"><span>Total</span><span>{inr(o.total)}</span></div>
        </div>

        <div className="mt-10 border-t border-neutral-300 pt-4 text-center text-sm font-semibold tracking-wide">
          THANK YOU FOR CHOOSING UNIVERSAL CERAMICS
        </div>
      </Panel>
      )}
    </div>
  );
}
