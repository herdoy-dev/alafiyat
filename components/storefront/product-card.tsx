"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  return (
    <Link href={`/products/${product.slug}`} className="group">
      <Card className="overflow-hidden transition-shadow hover:shadow-md py-0">
        <div className="relative aspect-square w-full bg-muted">
          {product.thumbnail && (
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              unoptimized
            />
          )}
          {product.stock === 0 && (
            <Badge
              variant="destructive"
              className="absolute top-2 right-2"
            >
              Out of stock
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="space-y-1">
            {product.category && (
              <p className="text-xs text-muted-foreground">
                {product.category.name}
              </p>
            )}
            <h3 className="font-medium line-clamp-1">{product.name}</h3>
            <p className="font-semibold text-primary">৳{product.price}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
