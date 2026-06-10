import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Printer, Download, RotateCcw, MapPin, Phone, Mail } from "lucide-react";
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
      <Panel className="invoice-sheet mx-auto max-w-3xl bg-white p-0 text-black">
        <div className="border-[6px] border-black p-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-6 border-b-2 border-black pb-6">
            <div>
              <div className="flex items-center gap-3">
                <img src={logo.url} alt="Universal Ceramics" className="h-14 w-auto object-contain" />
                <div>
                  <div className="font-display text-2xl font-extrabold tracking-tight leading-none">UNIVERSAL CERAMICS</div>
                  <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-600">Premium Tiles & Sanitary Solutions</div>
                </div>
              </div>
              <div className="mt-5 space-y-1.5 text-[13px] text-neutral-700">
                <div className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /><span>8-A, National Highway, Morbi Road,<br />At. Wankaner, Rajkot - 360 005, Gujarat, India</span></div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" /><span>+91 98765 43210</span></div>
                <div className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" /><span>info@universalceramics.com</span></div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display text-2xl font-extrabold tracking-tight">TAX INVOICE</div>
              <div className="mt-4 space-y-1.5 text-[13px]">
                <Detail label="Invoice No." value={o.id} />
                <Detail label="Order No." value={o.orderId} />
                <Detail label="Date" value={o.date} />
                <Detail label="GSTIN" value="24ABCDE1234F1Z5" />
              </div>
            </div>
          </div>

          {/* Bill To / Order details */}
          <div className="grid grid-cols-2 gap-8 py-6 text-[13px]">
            <div className="border-r border-dashed border-neutral-300 pr-8">
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-neutral-500">Bill To</div>
              <div className="text-base font-semibold">{o.customer}</div>
              <div className="mt-1 text-neutral-600">Premium Customer</div>
            </div>
            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-neutral-500">Order Details</div>
              <Detail label="Order No." value={o.orderId} />
              <Detail label="Order Date" value={o.date} />
            </div>
          </div>

          {/* Items table */}
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-y-2 border-black text-left text-xs uppercase tracking-wide text-neutral-600">
                <th className="py-3 pr-2 font-bold">Sr.</th>
                <th className="py-3 pr-2 font-bold">Description</th>
                <th className="py-3 pr-2 text-right font-bold">Qty</th>
                <th className="py-3 pr-2 text-right font-bold">Rate (₹)</th>
                <th className="py-3 text-right font-bold">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {o.items.map((i, idx) => (
                <tr key={i.product} className="border-b border-dashed border-neutral-300">
                  <td className="py-3 pr-2 text-neutral-500">{idx + 1}</td>
                  <td className="py-3 pr-2 font-medium">{i.product}</td>
                  <td className="py-3 pr-2 text-right">{i.qtyBoxes}</td>
                  <td className="py-3 pr-2 text-right">{i.rate.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                  <td className="py-3 text-right font-semibold">{(i.qtyBoxes * i.rate).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="mt-6 grid grid-cols-2 gap-8">
            <div className="text-[13px]">
              <div className="font-bold uppercase tracking-wide">Total Items: {o.items.length}</div>
              <div className="mt-6 text-xs font-bold uppercase tracking-[0.15em] text-neutral-500">Amount (in words)</div>
              <div className="mt-1 text-neutral-700">{numberToWords(o.total)} Only</div>
            </div>
            <div className="text-[13px]">
              <div className="flex justify-between border-b border-dashed border-neutral-300 py-1.5"><span className="uppercase tracking-wide text-neutral-600">Sub Total</span><span>{inr(o.subtotal)}</span></div>
              <div className="flex justify-between border-b border-dashed border-neutral-300 py-1.5"><span className="uppercase tracking-wide text-neutral-600">GST 18%</span><span>{inr(o.gst)}</span></div>
              <div className="mt-2 flex items-center justify-between border-y-2 border-black py-3 text-lg font-extrabold"><span>AMOUNT TOTAL</span><span>{inr(o.total)}</span></div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-10 flex items-end justify-between gap-6 border-t border-neutral-300 pt-6">
            <div className="text-[11px] text-neutral-500">Scan to verify<br />this invoice</div>
            <div className="text-center">
              <div className="mb-2 border-b border-neutral-400 pb-1 font-display text-base italic text-neutral-700">Authorized</div>
              <div className="text-[11px] text-neutral-500">Authorized Signature</div>
            </div>
          </div>
          <div className="mt-6 border-t-2 border-black pt-3 text-center text-xs font-bold uppercase tracking-[0.2em]">
            Thank You For Visiting Universal Ceramics
          </div>
        </div>
      </Panel>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-24 font-semibold text-neutral-700">{label}</span>
      <span className="text-neutral-500">:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function numberToWords(n: number): string {
  const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const two = (num: number): string => (num < 20 ? a[num] : `${b[Math.floor(num / 10)]}${num % 10 ? " " + a[num % 10] : ""}`);
  const three = (num: number): string => {
    const h = Math.floor(num / 100);
    const r = num % 100;
    return `${h ? a[h] + " Hundred" + (r ? " " : "") : ""}${r ? two(r) : ""}`;
  };
  let num = Math.round(n);
  if (num === 0) return "Zero Rupees";
  const parts: string[] = [];
  const crore = Math.floor(num / 10000000); num %= 10000000;
  const lakh = Math.floor(num / 100000); num %= 100000;
  const thousand = Math.floor(num / 1000); num %= 1000;
  if (crore) parts.push(`${two(crore)} Crore`);
  if (lakh) parts.push(`${two(lakh)} Lakh`);
  if (thousand) parts.push(`${two(thousand)} Thousand`);
  if (num) parts.push(three(num));
  return `Rupees ${parts.join(" ").trim()}`;
}
