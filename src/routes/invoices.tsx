import { createFileRoute } from "@tanstack/react-router";
import { Printer, Download, RotateCcw } from "lucide-react";
import { PageHeader, Panel } from "@/components/ui-bits";
import { orders, inr } from "@/lib/mock-data";

export const Route = createFileRoute("/invoices")({
  head: () => ({ meta: [{ title: "Invoices — Universal Ceramics" }] }),
  component: Invoices,
});

function Invoices() {
  const o = orders[0];
  const subtotal = o.items.reduce((s, i) => s + i.qtyBoxes * i.rate, 0);
  const gst = Math.round(subtotal * 0.18);

  return (
    <div>
      <PageHeader
        title="Invoice System"
        subtitle="Professional GST invoices — generate, print & reprint"
        action={
          <div className="flex gap-2">
            <button className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm hover:border-primary/50"><RotateCcw className="h-4 w-4" /> Reprint</button>
            <button className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm hover:border-primary/50"><Printer className="h-4 w-4" /> Print</button>
            <button className="flex items-center gap-2 rounded-xl gold-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground"><Download className="h-4 w-4" /> PDF</button>
          </div>
        }
      />

      <Panel className="mx-auto max-w-3xl bg-white p-10 text-black">
        <div className="flex items-start justify-between border-b-2 border-black pb-6">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-black text-xl font-bold text-white">U</div>
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
            <div>Invoice #: INV-9921</div>
            <div>Order #: {o.id}</div>
            <div>Date: {o.date} · 18:42</div>
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
          <div className="flex justify-between py-1"><span>Subtotal</span><span>{inr(subtotal)}</span></div>
          <div className="flex justify-between py-1"><span>GST (18%)</span><span>{inr(gst)}</span></div>
          <div className="mt-2 flex justify-between border-t-2 border-black pt-2 text-base font-bold"><span>Total</span><span>{inr(subtotal + gst)}</span></div>
        </div>

        <div className="mt-10 border-t border-neutral-300 pt-4 text-center text-sm font-semibold tracking-wide">
          THANK YOU FOR CHOOSING UNIVERSAL CERAMICS
        </div>
      </Panel>
    </div>
  );
}
