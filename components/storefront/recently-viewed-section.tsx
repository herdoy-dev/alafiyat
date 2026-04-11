"use client";

import { useRecentlyViewed } from "@/lib/stores/recently-viewed";
import { ProductCard } from "./product-card";

export function RecentlyViewedSection({ excludeId }: { excludeId?: string }) {
  const { items } = useRecentlyViewed();
  const filtered = excludeId
    ? items.filter((i) => i.id !== excludeId)
    : items;

  if (filtered.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border/60 pt-12">
      <p className="font-display text-xs italic uppercase tracking-[0.2em] text-muted-foreground">
        Your browsing history
      </p>
      <h2 className="mt-1 font-display text-2xl tracking-tight md:text-3xl">
        Recently <em className="font-display italic">viewed</em>
      </h2>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
        {filtered.slice(0, 6).map((p) => (
          <ProductCard
            key={p.id}
            product={{
              ...p,
              stock: 1,
              thumbnail: p.image,
              category: null,
            }}
          />
        ))}
      </div>
    </section>
  );
}
