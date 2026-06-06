// Centralized mock business data for the Universal Ceramics showroom OS.
// Replace with Lovable Cloud queries when backend is enabled.

export type DeliveryStatus = "Pending" | "Partially Delivered" | "Delivered";

export interface Product {
  id: string;
  name: string;
  size: string;
  finish: string;
  price: number;
  stock: number;
  reserved: number;
  category: string;
  sold: number;
  image: string;
}

export interface OrderItem {
  product: string;
  qtyBoxes: number;
  delivered: number;
  rate: number;
}

export interface Order {
  id: string;
  customer: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: DeliveryStatus;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email: string;
  city: string;
  gst: string;
  type: "Retail" | "Dealer" | "Architect" | "Builder";
  orders: number;
  spend: number;
}

export const products: Product[] = [
  { id: "P-1001", name: "Royal White", size: "600x1200", finish: "Glossy", price: 1240, stock: 320, reserved: 40, category: "Floor", sold: 1820, image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=600&q=80" },
  { id: "P-1002", name: "Premium Grey", size: "800x800", finish: "Matte", price: 980, stock: 28, reserved: 12, category: "Floor", sold: 1510, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80" },
  { id: "P-1003", name: "Marble Beige", size: "600x600", finish: "Polished", price: 1120, stock: 540, reserved: 60, category: "Wall", sold: 1340, image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80" },
  { id: "P-1004", name: "Carrara Lux", size: "1200x2400", finish: "Glossy", price: 3450, stock: 14, reserved: 6, category: "Slab", sold: 760, image: "https://images.unsplash.com/photo-1597072689227-8882273e8f6a?w=600&q=80" },
  { id: "P-1005", name: "Onyx Black", size: "600x1200", finish: "Matte", price: 1680, stock: 210, reserved: 25, category: "Wall", sold: 990, image: "https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=600&q=80" },
  { id: "P-1006", name: "Terra Sand", size: "300x600", finish: "Rustic", price: 640, stock: 8, reserved: 4, category: "Bathroom", sold: 540, image: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=600&q=80" },
];

export const customers: Customer[] = [
  { id: "C-501", name: "Mehta Constructions", mobile: "+91 98200 11223", email: "info@mehta.co", city: "Mumbai", gst: "27AABCM1234F1Z5", type: "Builder", orders: 24, spend: 1840000 },
  { id: "C-502", name: "Anita Sharma", mobile: "+91 99300 44556", email: "anita.s@gmail.com", city: "Pune", gst: "—", type: "Retail", orders: 3, spend: 248000 },
  { id: "C-503", name: "Skyline Architects", mobile: "+91 98765 33221", email: "studio@skyline.in", city: "Bengaluru", gst: "29AAACS7788K1Z2", type: "Architect", orders: 11, spend: 920000 },
  { id: "C-504", name: "Royal Interiors", mobile: "+91 90040 99887", email: "hello@royalint.in", city: "Delhi", gst: "07AAFCR4455L1Z9", type: "Dealer", orders: 18, spend: 1310000 },
  { id: "C-505", name: "Rahul Verma", mobile: "+91 99870 22110", email: "rahul.v@outlook.com", city: "Nagpur", gst: "—", type: "Retail", orders: 2, spend: 96000 },
];

export const orders: Order[] = [
  { id: "ORD-2401", customer: "Mehta Constructions", date: "2026-06-06", total: 348000, status: "Partially Delivered",
    items: [
      { product: "Royal White", qtyBoxes: 120, delivered: 120, rate: 1240 },
      { product: "Premium Grey", qtyBoxes: 90, delivered: 30, rate: 980 },
      { product: "Marble Beige", qtyBoxes: 60, delivered: 0, rate: 1120 },
    ] },
  { id: "ORD-2402", customer: "Anita Sharma", date: "2026-06-06", total: 86000, status: "Pending",
    items: [{ product: "Carrara Lux", qtyBoxes: 24, delivered: 0, rate: 3450 }] },
  { id: "ORD-2403", customer: "Skyline Architects", date: "2026-06-05", total: 212000, status: "Delivered",
    items: [
      { product: "Onyx Black", qtyBoxes: 80, delivered: 80, rate: 1680 },
      { product: "Marble Beige", qtyBoxes: 70, delivered: 70, rate: 1120 },
    ] },
  { id: "ORD-2404", customer: "Royal Interiors", date: "2026-06-05", total: 154000, status: "Partially Delivered",
    items: [
      { product: "Royal White", qtyBoxes: 100, delivered: 60, rate: 1240 },
      { product: "Terra Sand", qtyBoxes: 50, delivered: 0, rate: 640 },
    ] },
  { id: "ORD-2405", customer: "Rahul Verma", date: "2026-06-04", total: 48000, status: "Pending",
    items: [{ product: "Premium Grey", qtyBoxes: 48, delivered: 0, rate: 980 }] },
];

export const revenueTrend = [
  { day: "Mon", revenue: 320 }, { day: "Tue", revenue: 410 }, { day: "Wed", revenue: 380 },
  { day: "Thu", revenue: 520 }, { day: "Fri", revenue: 610 }, { day: "Sat", revenue: 740 }, { day: "Sun", revenue: 480 },
];

export const activities = [
  { who: "Priya (Manager)", what: "approved invoice INV-9921", when: "2 min ago" },
  { who: "Arjun (Worker)", what: "marked 30 boxes delivered for ORD-2401", when: "9 min ago" },
  { who: "System", what: "Low stock alert: Premium Grey", when: "14 min ago" },
  { who: "Kavya (Accountant)", what: "recorded payment ₹1,20,000", when: "31 min ago" },
  { who: "Rohan (Owner)", what: "created order ORD-2402", when: "1 hr ago" },
];

export const staff = [
  { name: "Priya Nair", role: "Manager", orders: 42, status: "Active" },
  { name: "Arjun Rao", role: "Worker", orders: 0, status: "Active" },
  { name: "Kavya Iyer", role: "Accountant", orders: 0, status: "Idle" },
  { name: "Rohan Shah", role: "Owner", orders: 18, status: "Active" },
];

export function orderProgress(o: Order) {
  const total = o.items.reduce((s, i) => s + i.qtyBoxes, 0);
  const done = o.items.reduce((s, i) => s + i.delivered, 0);
  return Math.round((done / total) * 100);
}

export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
