"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Banknote, Smartphone } from "lucide-react";
import { useCart } from "@/lib/stores/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const COD = "Cash on Delivery";

const PAYMENT_METHODS = [
  { value: "bKash", label: "bKash" },
  { value: "Nagad", label: "Nagad" },
  { value: "Rocket", label: "Rocket" },
  { value: "Upay", label: "Upay" },
];

const PAYMENT_NUMBERS: Record<string, string> = {
  bKash: "01XXXXXXXXX",
  Nagad: "01XXXXXXXXX",
  Rocket: "01XXXXXXXXX",
  Upay: "01XXXXXXXXX",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clear } = useCart();
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    customerEmail: "",
    shippingName: "",
    shippingPhone: "",
    shippingAddress: "",
    shippingCity: "",
    notes: "",
    paymentMethod: "bKash",
    phoneNumber: "",
    transactionId: "",
  });

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-16 md:px-8">
        <div className="rounded-lg border py-16 text-center">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <Button asChild className="mt-6">
            <Link href="/products">Shop now</Link>
          </Button>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
          ...form,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to place order");
        return;
      }
      toast.success("Order placed! Awaiting payment confirmation.");
      clear();
      router.push("/order-success");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10 md:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="shippingName">Full Name</Label>
                <Input
                  id="shippingName"
                  required
                  value={form.shippingName}
                  onChange={(e) =>
                    setForm({ ...form, shippingName: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="customerEmail">Email (optional)</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="you@example.com"
                  value={form.customerEmail}
                  onChange={(e) =>
                    setForm({ ...form, customerEmail: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="shippingPhone">Phone</Label>
                <Input
                  id="shippingPhone"
                  required
                  value={form.shippingPhone}
                  onChange={(e) =>
                    setForm({ ...form, shippingPhone: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="shippingAddress">Address</Label>
                <Input
                  id="shippingAddress"
                  required
                  value={form.shippingAddress}
                  onChange={(e) =>
                    setForm({ ...form, shippingAddress: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="shippingCity">City</Label>
                <Input
                  id="shippingCity"
                  required
                  value={form.shippingCity}
                  onChange={(e) =>
                    setForm({ ...form, shippingCity: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Order notes (optional)</Label>
                <Input
                  id="notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment mode toggle */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setForm({ ...form, paymentMethod: COD })
                  }
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-4 text-left transition",
                    form.paymentMethod === COD
                      ? "border-primary bg-primary/5 ring-2 ring-primary"
                      : "hover:border-muted-foreground/30"
                  )}
                >
                  <Banknote
                    className={cn(
                      "h-6 w-6 shrink-0",
                      form.paymentMethod === COD
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  />
                  <div>
                    <p className="font-semibold text-sm">Cash on Delivery</p>
                    <p className="text-xs text-muted-foreground">
                      Pay when you receive
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setForm({ ...form, paymentMethod: "bKash" })
                  }
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-4 text-left transition",
                    form.paymentMethod !== COD
                      ? "border-primary bg-primary/5 ring-2 ring-primary"
                      : "hover:border-muted-foreground/30"
                  )}
                >
                  <Smartphone
                    className={cn(
                      "h-6 w-6 shrink-0",
                      form.paymentMethod !== COD
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  />
                  <div>
                    <p className="font-semibold text-sm">Pay Now</p>
                    <p className="text-xs text-muted-foreground">
                      bKash / Nagad / Rocket / Upay
                    </p>
                  </div>
                </button>
              </div>

              {form.paymentMethod === COD ? (
                <div className="rounded-md border bg-muted/40 p-4 text-sm text-muted-foreground">
                  Pay <span className="font-semibold text-foreground">৳{total()}</span> in cash to the delivery agent when your order arrives.
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  <div className="grid gap-2">
                    <Label>Mobile Banking Provider</Label>
                    <Select
                      value={form.paymentMethod}
                      onValueChange={(v) =>
                        setForm({ ...form, paymentMethod: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_METHODS.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="rounded-md border bg-muted/40 p-4 text-sm">
                    <p className="font-medium">Send payment to:</p>
                    <p className="mt-1">
                      {form.paymentMethod}: {PAYMENT_NUMBERS[form.paymentMethod]}
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      Amount: ৳{total()}
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phoneNumber">
                      Your {form.paymentMethod} number
                    </Label>
                    <Input
                      id="phoneNumber"
                      required
                      value={form.phoneNumber}
                      onChange={(e) =>
                        setForm({ ...form, phoneNumber: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="transactionId">Transaction ID</Label>
                    <Input
                      id="transactionId"
                      required
                      value={form.transactionId}
                      onChange={(e) =>
                        setForm({ ...form, transactionId: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit lg:sticky lg:top-20">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="flex-1">
                  {item.name}
                  <span className="text-muted-foreground"> × {item.quantity}</span>
                </span>
                <span>৳{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="flex justify-between border-t pt-3 text-base font-semibold">
              <span>Total</span>
              <span>৳{total()}</span>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              {submitting ? "Placing order..." : "Place Order"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
