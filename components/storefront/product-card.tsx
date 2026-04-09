"use client";

import Link from "next/link";
import Image from "next/image";

export type StoreProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  thumbnail: string;
  category: { name: string; slug: string } | null;
};

export function ProductCard({ product }: { product: StoreProduct }) {
  const outOfStock = product.stock === 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block focus-visible:outline-none"
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/60 bg-muted">
        {product.thumbnail && (
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            unoptimized
          />
        )}

        {/* Subtle hover overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/15 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-[1px]">
            <span className="rounded-full bg-background px-3 py-1 font-display text-xs italic tracking-wide text-foreground shadow-sm">
              Out of stock
            </span>
          </div>
        )}

        {product.category && !outOfStock && (
          <div className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 backdrop-blur-sm">
            <span className="font-display text-[10px] italic tracking-wide text-muted-foreground">
              {product.category.name}
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-start justify-between gap-2 px-1">
        <h3 className="line-clamp-2 font-display text-base leading-snug tracking-tight text-foreground/90 transition-colors group-hover:text-foreground">
          {product.name}
        </h3>
        <p className="shrink-0 font-display text-base leading-snug tracking-tight tabular-nums text-foreground">
          ৳{product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
