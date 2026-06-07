// Shared in-memory store for the showroom OS.
// Keeps products (inventory), orders and invoices in sync so that creating a
// new order automatically: (1) generates a GST invoice and (2) deducts stock.
// Backed by useSyncExternalStore — swap for Lovable Cloud queries later.

import { useSyncExternalStore } from "react";
import {
  products as seedProducts,
  orders as seedOrders,
  type Product,
  type Order,
  type OrderItem,
  type Invoice,
  type DeliveryStatus,
} from "./mock-data";

interface State {
  products: Product[];
  orders: Order[];
  invoices: Invoice[];
}

function deriveStatus(items: OrderItem[]): DeliveryStatus {
  const total = items.reduce((s, i) => s + i.qtyBoxes, 0);
  const done = items.reduce((s, i) => s + i.delivered, 0);
  if (done === 0) return "Pending";
  if (done >= total) return "Delivered";
  return "Partially Delivered";
}

function buildInvoice(o: Order, seq: number): Invoice {
  const subtotal = o.items.reduce((s, i) => s + i.qtyBoxes * i.rate, 0);
  const gst = Math.round(subtotal * 0.18);
  return {
    id: `INV-${9920 + seq}`,
    orderId: o.id,
    customer: o.customer,
    date: o.date,
    items: o.items.map((i) => ({ ...i })),
    subtotal,
    gst,
    total: subtotal + gst,
  };
}

let state: State = {
  products: seedProducts.map((p) => ({ ...p })),
  orders: seedOrders.map((o) => ({ ...o, items: o.items.map((i) => ({ ...i })) })),
  invoices: seedOrders.map((o, idx) => buildInvoice(o, idx + 1)),
};

const listeners = new Set<() => void>();
function emit() {
  state = { ...state };
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

// ---- actions ----

export interface NewOrderItem {
  productId: string;
  qtyBoxes: number;
}

let orderSeq = seedOrders.length;
let invoiceSeq = seedOrders.length;

export function createOrder(
  customer: string,
  picks: NewOrderItem[],
  details?: { mobile?: string; address?: string },
) {
  orderSeq += 1;
  invoiceSeq += 1;
  const id = `ORD-${2400 + orderSeq}`;
  const date = new Date().toISOString().slice(0, 10);

  const items: OrderItem[] = picks.map((pick) => {
    const product = state.products.find((p) => p.id === pick.productId)!;
    return { product: product.name, qtyBoxes: pick.qtyBoxes, delivered: 0, rate: product.price };
  });
  const total = items.reduce((s, i) => s + i.qtyBoxes * i.rate, 0);
  const order: Order = { id, customer, mobile: details?.mobile, address: details?.address, date, items, total, status: "Pending" };

  // 1. deduct stock from inventory
  const products = state.products.map((p) => {
    const pick = picks.find((x) => x.productId === p.id);
    if (!pick) return p;
    return { ...p, stock: Math.max(0, p.stock - pick.qtyBoxes), sold: p.sold + pick.qtyBoxes };
  });

  // 2. auto-generate invoice
  const invoice = buildInvoice(order, invoiceSeq);

  state = {
    products,
    orders: [order, ...state.orders],
    invoices: [invoice, ...state.invoices],
  };
  emit();
  return { order, invoice };
}

export function applyDelivery(orderId: string, idx: number, addBoxes: number) {
  state = {
    ...state,
    orders: state.orders.map((o) => {
      if (o.id !== orderId) return o;
      const items = o.items.map((it, i) =>
        i === idx ? { ...it, delivered: Math.min(it.qtyBoxes, it.delivered + addBoxes) } : it,
      );
      return { ...o, items, status: deriveStatus(items) };
    }),
  };
  emit();
}

export function restock(productId: string, qty: number) {
  state = {
    ...state,
    products: state.products.map((p) => (p.id === productId ? { ...p, stock: p.stock + qty } : p)),
  };
  emit();
}

// ---- hooks ----

function getSnapshot() {
  return state;
}

export function useStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
