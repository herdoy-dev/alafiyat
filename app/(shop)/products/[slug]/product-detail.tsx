"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  Minus,
  Plus,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/stores/cart";
import { cn } from "@/lib/utils";
import { trackAllViewContent, trackAllAddToCart } from "@/lib/tracking";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  thumbnail: string;
  images: string[];
  category: { name: string; slug: string } | null;
};

export function ProductDetail({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const [quantity, setQuantity] = useState(1);

  const gallery = [product.thumbnail, ...product.images].filter(Boolean);
  const [activeImage, setActiveImage] = useState(gallery[0] ?? "");
  const inStock = product.stock > 0;

  useEffect(() => {
    trackAllViewContent(product.id, product.name, product.price);
  }, [product.id, product.name, product.price]);

  const imageRef = useRef<HTMLDivElement>(null);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = imageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  }

  function handleAdd() {
    add(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.thumbnail,
        stock: product.stock,
      },
      quantity
    );
    trackAllAddToCart(product.id, product.name, product.price, quantity);
    toast.success(`Added ${product.name} to cart`);
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-14">
      {/* Breadcrumb */}
      <Link
        href="/products"
        className="group mb-8 inline-flex items-center gap-2 font-display text-sm italic text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        Back to all products
      </Link>

      {/* Top: gallery + buy panel */}
      <div className="grid gap-10 md:gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Gallery */}
        <div className="lg:col-span-7">
          <div
            ref={imageRef}
            className="relative aspect-square cursor-zoom-in overflow-hidden rounded-3xl border border-border/60 bg-muted shadow-sm"
            onMouseEnter={() => setZoomed(true)}
            onMouseLeave={() => setZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            {activeImage && (
              <Image
                src={activeImage}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-200 ease-out"
                style={{
                  transform: zoomed ? "scale(2)" : "scale(1)",
                  transformOrigin: `${origin.x}% ${origin.y}%`,
                }}
                unoptimized
                priority
              />
            )}
          </div>
          {gallery.length > 1 && (
            <div className="-mx-4 mt-4 flex gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
              {gallery.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveImage(src)}
                  className={cn(
                    "relative aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-muted transition-all md:h-24 md:w-24",
                    activeImage === src
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border/60 opacity-60 hover:opacity-100"
                  )}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Buy panel */}
        <div className="lg:col-span-5">
          <div className="space-y-7 lg:sticky lg:top-24">
            {/* Title block */}
            <div className="space-y-3">
              {product.category && (
                <p className="font-display text-sm italic text-muted-foreground">
                  In{" "}
                  <Link
                    href={`/products?category=${product.category.slug}`}
                    className="text-foreground underline decoration-primary/40 underline-offset-4 hover:text-primary"
                  >
                    {product.category.name}
                  </Link>
                </p>
              )}
              <h1 className="font-display text-4xl leading-[1.05] tracking-tight md:text-5xl">
                {product.name}
              </h1>
              <p className="font-display text-3xl tracking-tight tabular-nums text-foreground md:text-4xl">
                ৳{product.price.toLocaleString()}
              </p>
            </div>

            <div className="h-px w-full bg-border/60" />

            {/* Stock status */}
            <div className="flex items-center gap-2 text-sm">
              {inStock ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">In stock</span>
                  <span className="text-muted-foreground tabular-nums">
                    · {product.stock} available
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="font-medium text-destructive">
                    Currently out of stock
                  </span>
                </>
              )}
            </div>

            {/* Quantity + add to cart */}
            {inStock && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-display text-xs italic uppercase tracking-[0.2em] text-muted-foreground">
                    Quantity
                  </span>
                  <div className="flex items-center rounded-full border border-border/70">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-10 text-center font-display text-base tabular-nums">
                      {quantity}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full"
                      onClick={() =>
                        setQuantity((q) => Math.min(product.stock, q + 1))
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleAdd}
                  className="w-full rounded-full"
                  size="lg"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Add to cart · ৳
                  {(product.price * quantity).toLocaleString()}
                </Button>
              </div>
            )}

            <div className="h-px w-full bg-border/60" />

            {/* Quick details */}
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="font-display text-[11px] italic uppercase tracking-[0.18em] text-muted-foreground">
                  SKU
                </dt>
                <dd className="mt-1 font-mono text-xs">
                  {product.id.slice(-8).toUpperCase()}
                </dd>
              </div>
              {product.category && (
                <div>
                  <dt className="font-display text-[11px] italic uppercase tracking-[0.18em] text-muted-foreground">
                    Category
                  </dt>
                  <dd className="mt-1 font-medium">{product.category.name}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>

      {/* Bottom: description */}
      <div className="mt-16 border-t border-border/60 pt-12 md:mt-24 md:pt-16">
        <p className="font-display text-sm italic text-muted-foreground">
          About this product
        </p>
        <h2 className="mt-1 font-display text-3xl leading-tight tracking-tight md:text-4xl">
          The full story
        </h2>
        <div
          className="rich-content mt-6 max-w-3xl"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </div>
    </div>
  );
}
