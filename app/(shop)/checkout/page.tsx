"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Banknote, Smartphone, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/stores/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      <div className="container mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
        <div className="rounded-3xl border border-dashed border-border/60 bg-card/40 px-6 py-20 text-center">
          <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground/60" />
          <h1 className="mt-6 font-display text-4xl tracking-tight md:text-5xl">
            Your cart is <em className="font-display italic">empty</em>
          </h1>
          <Button asChild size="lg" className="mt-8 rounded-full">
            <Link href="/products">
              Browse products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
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

  const isCod = form.paymentMethod === COD;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
      <header className="mb-10 flex flex-col gap-1 md:mb-12">
        <p className="font-display text-sm italic text-muted-foreground">
          One last step
        </p>
        <h1 className="font-display text-4xl leading-[1.05] tracking-tight md:text-6xl">
          Checkout
        </h1>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid gap-8 lg:grid-cols-3 lg:gap-12"
      >
        <div className="space-y-8 lg:col-span-2">
          {/* Shipping */}
          <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-xs md:p-8">
            <p className="font-display text-xs italic uppercase tracking-[0.18em] text-muted-foreground">
              Step 01
            </p>
            <h2 className="mt-1 font-display text-2xl tracking-tight md:text-3xl">
              Where to?
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="shippingName">Full name</Label>
                <Input
                  id="shippingName"
                  required
                  value={form.shippingName}
                  onChange={(e) =>
                    setForm({ ...form, shippingName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
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
              <div className="space-y-2">
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
              <div className="space-y-2 sm:col-span-2">
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
              <div className="space-y-2 sm:col-span-2">
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
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="notes">Order notes (optional)</Label>
                <Input
                  id="notes"
                  placeholder="Anything we should know?"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-xs md:p-8">
            <p className="font-display text-xs italic uppercase tracking-[0.18em] text-muted-foreground">
              Step 02
            </p>
            <h2 className="mt-1 font-display text-2xl tracking-tight md:text-3xl">
              How to pay
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, paymentMethod: COD })}
                className={cn(
                  "flex items-start gap-3 rounded-2xl border p-4 text-left transition-all",
                  isCod
                    ? "border-primary bg-primary/5 shadow-xs"
                    : "border-border/70 hover:border-foreground/30"
                )}
              >
                <Banknote
                  className={cn(
                    "mt-0.5 h-5 w-5 shrink-0",
                    isCod ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <div>
                  <p className="font-display text-base tracking-tight">
                    Cash on delivery
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Pay when you receive
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, paymentMethod: "bKash" })}
                className={cn(
                  "flex items-start gap-3 rounded-2xl border p-4 text-left transition-all",
                  !isCod
                    ? "border-primary bg-primary/5 shadow-xs"
                    : "border-border/70 hover:border-foreground/30"
                )}
              >
                <Smartphone
                  className={cn(
                    "mt-0.5 h-5 w-5 shrink-0",
                    !isCod ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <div>
                  <p className="font-display text-base tracking-tight">
                    Pay now
                  </p>
                  <p className="text-xs text-muted-foreground">
                    bKash · Nagad · Rocket · Upay
                  </p>
                </div>
              </button>
            </div>

            {isCod ? (
              <div className="mt-5 rounded-xl border border-border/60 bg-muted/40 p-4 text-sm text-muted-foreground">
                Pay{" "}
                <span className="font-display tabular-nums text-foreground">
                  ৳{total().toLocaleString()}
                </span>{" "}
                in cash to the delivery agent when your order arrives.
              </div>
            ) : (
              <div className="mt-5 space-y-5">
                <div className="space-y-2">
                  <Label>Mobile banking provider</Label>
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
                <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
                  <p className="font-display text-xs italic uppercase tracking-[0.18em] text-muted-foreground">
                    Send payment to
                  </p>
                  <p className="mt-1 font-display text-lg tracking-tight">
                    {form.paymentMethod}{" "}
                    <span className="font-mono text-base">
                      {PAYMENT_NUMBERS[form.paymentMethod]}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Amount:{" "}
                    <span className="tabular-nums text-foreground">
                      ৳{total().toLocaleString()}
                    </span>
                  </p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
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
                  <div className="space-y-2">
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
              </div>
            )}
          </section>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <p className="font-display text-xs italic uppercase tracking-[0.18em] text-muted-foreground">
              Order summary
            </p>
            <h2 className="mt-1 font-display text-2xl tracking-tight">
              Your <em className="font-display italic">order</em>
            </h2>

            <ul className="mt-5 space-y-3 border-y border-border/60 py-5">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between gap-3 text-sm"
                >
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-1 font-display text-base tracking-tight">
                      {item.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      × {item.quantity}
                    </span>
                  </span>
                  <span className="shrink-0 tabular-nums">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-baseline justify-between">
              <span className="font-display text-sm italic text-muted-foreground">
                Total
              </span>
              <span className="font-display text-3xl tracking-tight tabular-nums">
                ৳{total().toLocaleString()}
              </span>
            </div>

            <Button
              type="submit"
              className="mt-6 w-full rounded-full"
              size="lg"
              disabled={submitting}
            >
              {submitting ? "Placing order..." : "Place order"}
              {!submitting && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
