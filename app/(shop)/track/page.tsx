"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react";

type TrackResult = {
  id: string;
  status: string;
  amount: number;
  paymentMethod: string;
  courierProvider: string | null;
  courierTrackingCode: string | null;
  courierStatus: string | null;
  createdAt: string;
  items: { productName: string; quantity: number; price: number }[];
};

const STATUS_ICONS: Record<string, typeof CheckCircle> = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
};

export default function TrackOrderPage() {
  const [phone, setPhone] = useState("");
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [searched, setSearched] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, orderId }),
      });
      const data = await res.json();
      if (res.ok && data.order) {
        setResult(data.order);
      } else {
        setResult(null);
        toast.error(data.error || "Order not found");
      }
    } catch {
      toast.error("Something went wrong");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  const StatusIcon = result ? (STATUS_ICONS[result.status] || Clock) : Clock;

  return (
    <div className="container mx-auto max-w-xl px-4 py-12 md:py-16">
      <header className="mb-8 text-center">
        <p className="font-display text-sm italic text-muted-foreground">
          Where&apos;s my order?
        </p>
        <h1 className="mt-1 font-display text-4xl tracking-tight md:text-5xl">
          Track <em className="font-display italic">order</em>
        </h1>
      </header>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border/60 bg-card p-6 shadow-xs space-y-5"
      >
        <div className="space-y-2">
          <Label htmlFor="phone">Phone number (used at checkout)</Label>
          <Input
            id="phone"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="01XXXXXXXXX"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="orderId">Order ID</Label>
          <Input
            id="orderId"
            required
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. A1B2C3D4"
          />
          <p className="text-xs text-muted-foreground">
            The 8-character code from your order confirmation
          </p>
        </div>
        <Button type="submit" className="w-full rounded-full" disabled={loading}>
          <Search className="mr-2 h-4 w-4" />
          {loading ? "Searching..." : "Track order"}
        </Button>
      </form>

      {searched && !result && !loading && (
        <div className="mt-8 rounded-2xl border border-dashed border-border/60 py-12 text-center">
          <Package className="mx-auto h-8 w-8 text-muted-foreground/60" />
          <p className="mt-3 text-muted-foreground">
            No order found. Check your phone number and order ID.
          </p>
        </div>
      )}

      {result && (
        <div className="mt-8 space-y-4">
          {/* Status */}
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <StatusIcon className="h-5 w-5 text-primary" />
              <div>
                <p className="font-display text-lg tracking-tight capitalize">
                  {result.status}
                </p>
                <p className="text-xs text-muted-foreground">
                  Order #{result.id.slice(-8).toUpperCase()} · Placed{" "}
                  {new Date(result.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="font-display text-xl tabular-nums">
                  ৳{result.amount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Courier */}
          {result.courierProvider && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50 dark:border-blue-800/50 dark:bg-blue-950/30 p-5">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="font-medium">
                    {result.courierProvider}
                    {result.courierStatus && ` · ${result.courierStatus}`}
                  </p>
                  {result.courierTrackingCode && (
                    <p className="mt-0.5 font-mono text-sm">
                      Tracking: {result.courierTrackingCode}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Items */}
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-xs">
            <p className="font-display text-xs italic uppercase tracking-[0.18em] text-muted-foreground mb-3">
              Items
            </p>
            <div className="divide-y divide-border/50 text-sm">
              {result.items.map((item, i) => (
                <div key={i} className="flex justify-between py-2">
                  <span>
                    {item.productName} ×{item.quantity}
                  </span>
                  <span className="tabular-nums">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
