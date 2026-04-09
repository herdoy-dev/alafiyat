"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Banknote, Smartphone, Minus, Plus, Loader2 } from "lucide-react";
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
import {
  trackAddToCart,
  trackInitiateCheckout,
  trackPurchase,
} from "@/lib/pixel";

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

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

type Theme = "light" | "dark";

type Props = {
  product: Product;
  ctaLabel?: string;
  theme?: Theme;
  className?: string;
};

export function LandingOrderForm({
  product,
  ctaLabel = "Place order",
  theme = "light",
  className,
}: Props) {
  const router = useRouter();
  const isDark = theme === "dark";

  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState({
    customerEmail: "",
    shippingName: "",
    shippingPhone: "",
    shippingAddress: "",
    shippingCity: "",
    notes: "",
    paymentMethod: COD,
    phoneNumber: "",
    transactionId: "",
  });

  const inStock = product.stock > 0;
  const isCod = form.paymentMethod === COD;
  const total = product.price * quantity;

  function markTouched() {
    if (!touched) {
      setTouched(true);
      trackAddToCart(product.id, product.price, quantity);
    }
  }

  function bumpQty(delta: number) {
    setQuantity((q) => Math.max(1, Math.min(product.stock || 99, q + delta)));
    markTouched();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inStock) return;

    trackInitiateCheckout(product.id, total);
    setSubmitting(true);
    try {
      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ productId: product.id, quantity }],
          customerEmail: form.customerEmail,
          shippingName: form.shippingName,
          shippingPhone: form.shippingPhone,
          shippingAddress: form.shippingAddress,
          shippingCity: form.shippingCity,
          notes: form.notes,
          paymentMethod: form.paymentMethod,
          phoneNumber: form.phoneNumber,
          transactionId: form.transactionId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to place order");
        return;
      }
      trackPurchase(product.id, total, data.purchase?.id);
      toast.success("Order placed!");
      router.push("/order-success");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      id="order-form"
      onSubmit={handleSubmit}
      onFocus={markTouched}
      className={cn(
        "rounded-2xl border p-5 md:p-7",
        isDark
          ? "border-white/15 bg-white/[0.04] text-white backdrop-blur-sm"
          : "border-border/60 bg-card text-foreground shadow-sm",
        className
      )}
    >
      {/* Live total */}
      <div
        className={cn(
          "mb-5 flex items-center justify-between rounded-xl px-4 py-3",
          isDark ? "bg-white/[0.06]" : "bg-muted/60"
        )}
      >
        <div>
          <p
            className={cn(
              "text-xs",
              isDark ? "text-white/60" : "text-muted-foreground"
            )}
          >
            Total
          </p>
          <p className="text-2xl font-semibold tabular-nums md:text-3xl">
            ৳{total.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border bg-background/40 p-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => bumpQty(-1)}
            disabled={quantity <= 1}
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <span className="w-6 text-center text-sm font-semibold tabular-nums">
            {quantity}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => bumpQty(1)}
            disabled={quantity >= product.stock}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Shipping fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="lf-name">Full name</Label>
          <Input
            id="lf-name"
            required
            value={form.shippingName}
            onChange={(e) =>
              setForm({ ...form, shippingName: e.target.value })
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lf-phone">Phone</Label>
          <Input
            id="lf-phone"
            required
            value={form.shippingPhone}
            onChange={(e) =>
              setForm({ ...form, shippingPhone: e.target.value })
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lf-email">Email (optional)</Label>
          <Input
            id="lf-email"
            type="email"
            value={form.customerEmail}
            onChange={(e) =>
              setForm({ ...form, customerEmail: e.target.value })
            }
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="lf-address">Address</Label>
          <Input
            id="lf-address"
            required
            value={form.shippingAddress}
            onChange={(e) =>
              setForm({ ...form, shippingAddress: e.target.value })
            }
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="lf-city">City</Label>
          <Input
            id="lf-city"
            required
            value={form.shippingCity}
            onChange={(e) =>
              setForm({ ...form, shippingCity: e.target.value })
            }
          />
        </div>
      </div>

      {/* Payment */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setForm({ ...form, paymentMethod: COD })}
          className={cn(
            "flex items-start gap-3 rounded-2xl border p-4 text-left transition-all",
            isCod
              ? isDark
                ? "border-white/40 bg-white/10"
                : "border-primary bg-primary/5"
              : isDark
                ? "border-white/15 hover:border-white/30"
                : "border-border/70 hover:border-foreground/30"
          )}
        >
          <Banknote
            className={cn(
              "mt-0.5 h-5 w-5 shrink-0",
              isCod && !isDark ? "text-primary" : ""
            )}
          />
          <div>
            <p className="font-semibold">Cash on delivery</p>
            <p className="text-xs opacity-70">Pay when you receive</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setForm({ ...form, paymentMethod: "bKash" })}
          className={cn(
            "flex items-start gap-3 rounded-2xl border p-4 text-left transition-all",
            !isCod
              ? isDark
                ? "border-white/40 bg-white/10"
                : "border-primary bg-primary/5"
              : isDark
                ? "border-white/15 hover:border-white/30"
                : "border-border/70 hover:border-foreground/30"
          )}
        >
          <Smartphone
            className={cn(
              "mt-0.5 h-5 w-5 shrink-0",
              !isCod && !isDark ? "text-primary" : ""
            )}
          />
          <div>
            <p className="font-semibold">Pay now</p>
            <p className="text-xs opacity-70">bKash · Nagad · Rocket · Upay</p>
          </div>
        </button>
      </div>

      {!isCod && (
        <div className="mt-5 space-y-4">
          <div className="space-y-1.5">
            <Label>Mobile banking provider</Label>
            <Select
              value={form.paymentMethod}
              onValueChange={(v) => setForm({ ...form, paymentMethod: v })}
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
          <div
            className={cn(
              "rounded-xl border p-4 text-sm",
              isDark
                ? "border-white/15 bg-white/[0.04]"
                : "border-border/60 bg-muted/40"
            )}
          >
            <p className="text-xs opacity-70">Send payment to</p>
            <p className="mt-1 text-base">
              <span className="font-semibold">{form.paymentMethod}</span>{" "}
              <span className="font-mono">
                {PAYMENT_NUMBERS[form.paymentMethod]}
              </span>
            </p>
            <p className="mt-1 opacity-70">
              Amount:{" "}
              <span className="tabular-nums">৳{total.toLocaleString()}</span>
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="lf-payer">Your {form.paymentMethod} number</Label>
              <Input
                id="lf-payer"
                required
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm({ ...form, phoneNumber: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lf-txn">Transaction ID</Label>
              <Input
                id="lf-txn"
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

      <Button
        type="submit"
        size="lg"
        disabled={submitting || !inStock}
        className={cn(
          "mt-6 w-full rounded-full",
          isDark && "bg-white text-black hover:bg-white/90"
        )}
      >
        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!inStock ? "Out of stock" : submitting ? "Placing order..." : `${ctaLabel} · ৳${total.toLocaleString()}`}
      </Button>
    </form>
  );
}
