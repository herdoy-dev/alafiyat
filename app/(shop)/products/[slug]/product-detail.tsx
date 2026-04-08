"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  Minus,
  Plus,
  ShoppingCart,
  CheckCircle2,
  XCircle,
  Tag,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/stores/cart";
import { cn } from "@/lib/utils";

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

  const imageRef = useRef<HTMLDivElement>(null);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = imageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
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
    toast.success(`Added ${product.name} to cart`);
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
      <Link
        href="/products"
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to products
      </Link>

      {/* Top: gallery + buy panel */}
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div className="mx-auto w-full max-w-md space-y-4">
          <div
            ref={imageRef}
            className="relative aspect-square cursor-zoom-in overflow-hidden rounded-xl border bg-muted"
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
            <div className="grid grid-cols-5 gap-3">
              {gallery.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveImage(src)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-md border bg-muted transition",
                    activeImage === src
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                      : "opacity-70 hover:opacity-100"
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
        <div>
          <div className="lg:sticky lg:top-20 space-y-6">
            <div className="space-y-3">
              {product.category && (
                <Badge variant="secondary" className="uppercase tracking-wide">
                  {product.category.name}
                </Badge>
              )}
              <h1 className="text-3xl font-bold leading-tight md:text-4xl">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-primary">
                ৳{product.price.toLocaleString()}
              </p>
            </div>

            <Separator />

            {/* Stock status */}
            <div className="flex items-center gap-2 text-sm">
              {inStock ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-green-600 dark:text-green-400">
                    In stock
                  </span>
                  <span className="text-muted-foreground">
                    ({product.stock} available)
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="font-medium text-destructive">
                    Out of stock
                  </span>
                </>
              )}
            </div>

            {/* Quantity + add to cart */}
            {inStock && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Quantity</span>
                  <div className="flex items-center rounded-md border">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center text-sm font-medium">
                      {quantity}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() =>
                        setQuantity((q) => Math.min(product.stock, q + 1))
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button onClick={handleAdd} className="w-full" size="lg">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to cart
                </Button>
              </div>
            )}

            <Separator />

            {/* Quick details */}
            <dl className="space-y-3 text-sm">
              {product.category && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="ml-auto font-medium">
                    {product.category.name}
                  </dd>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <dt className="text-muted-foreground">SKU</dt>
                <dd className="ml-auto font-mono text-xs">
                  {product.id.slice(-8).toUpperCase()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Bottom: description */}
      <div className="mt-16">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">
          Product Description
        </h2>
        <Separator className="mb-6" />
        <div
          className="rich-content max-w-3xl"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </div>
    </div>
  );
}
