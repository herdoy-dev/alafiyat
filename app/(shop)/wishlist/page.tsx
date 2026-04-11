"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useWishlist } from "@/lib/stores/wishlist";
import { ProductCard } from "@/components/storefront/product-card";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const { items, clear } = useWishlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
      <header className="mb-10 flex flex-col gap-1 md:mb-12">
        <p className="font-display text-sm italic text-muted-foreground">
          Saved for later
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-4xl leading-[1.05] tracking-tight md:text-6xl">
            Your <em className="font-display italic">wishlist</em>
          </h1>
          {items.length > 0 && (
            <button
              onClick={clear}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </header>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/60 bg-card/40 px-6 py-20 text-center">
          <Heart className="mx-auto h-10 w-10 text-muted-foreground/60" />
          <h2 className="mt-6 font-display text-3xl tracking-tight md:text-4xl">
            Your wishlist is <em className="font-display italic">empty</em>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Tap the heart on any product to save it here.
          </p>
          <Button asChild size="lg" className="mt-8 rounded-full">
            <Link href="/products">
              Browse products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <ProductCard
              key={item.id}
              product={{
                ...item,
                stock: 1,
                thumbnail: item.image,
                category: null,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
