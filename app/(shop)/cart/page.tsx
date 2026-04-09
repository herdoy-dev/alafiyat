"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/stores/cart";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, setQuantity, remove, total } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
        <div className="rounded-3xl border border-dashed border-border/60 bg-card/40 px-6 py-20 text-center">
          <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground/60" />
          <p className="mt-6 font-display text-sm italic text-muted-foreground">
            Nothing here yet
          </p>
          <h1 className="mt-1 font-display text-4xl leading-tight tracking-tight md:text-5xl">
            Your cart is <em className="font-display italic">empty</em>
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-sm text-muted-foreground">
            Browse the catalog and add a few things you love.
          </p>
          <Button asChild size="lg" className="mt-8 rounded-full">
            <Link href="/products">
              Start shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
      <header className="mb-10 flex flex-col gap-1 md:mb-12">
        <p className="font-display text-sm italic text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "items"} ·
          ৳{total().toLocaleString()}
        </p>
        <h1 className="font-display text-4xl leading-[1.05] tracking-tight md:text-6xl">
          Your <em className="font-display italic">cart</em>
        </h1>
      </header>

      <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
        {/* Items list */}
        <div className="space-y-3 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-xs sm:flex-row sm:items-center"
            >
              {/* Image */}
              <Link
                href={`/products/${item.slug}`}
                className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:h-20 sm:w-20"
              >
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}
              </Link>

              {/* Name + price */}
              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${item.slug}`}
                  className="font-display text-base leading-tight tracking-tight hover:text-primary"
                >
                  {item.name}
                </Link>
                <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                  ৳{item.price.toLocaleString()} each
                </p>
              </div>

              {/* Qty controls */}
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center rounded-full border border-border/70">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center font-display text-sm tabular-nums">
                    {item.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <p className="font-display text-base tabular-nums sm:w-20 sm:text-right">
                  ৳{(item.price * item.quantity).toLocaleString()}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  onClick={() => remove(item.id)}
                  aria-label="Remove from cart"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <p className="font-display text-xs italic uppercase tracking-[0.18em] text-muted-foreground">
              Order summary
            </p>
            <h2 className="mt-1 font-display text-2xl tracking-tight">
              Almost <em className="font-display italic">yours</em>
            </h2>

            <dl className="mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="tabular-nums">
                  ৳{total().toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="font-display italic text-muted-foreground">
                  At checkout
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex items-baseline justify-between border-t border-border/60 pt-5">
              <span className="font-display text-sm italic text-muted-foreground">
                Total
              </span>
              <span className="font-display text-3xl tracking-tight tabular-nums">
                ৳{total().toLocaleString()}
              </span>
            </div>

            <Button asChild className="mt-6 w-full rounded-full" size="lg">
              <Link href="/checkout">
                Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="mt-2 w-full text-muted-foreground"
            >
              <Link href="/products">Continue shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
