import Link from "next/link";
import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/product-card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categorySlug } = await searchParams;

  const category = categorySlug
    ? await prisma.category.findUnique({ where: { slug: categorySlug } })
    : null;

  const products = await prisma.product.findMany({
    where: category ? { categoryId: category.id } : undefined,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10 md:px-8">
      <div className="mb-8 space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">
          {category ? category.name : "All Products"}
        </h1>
        <p className="text-muted-foreground">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
        {category && (
          <Link href="/products">
            <Badge variant="secondary" className="gap-1.5 pr-1">
              {category.name}
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-background/60">
                <X className="h-3 w-3" />
              </span>
            </Badge>
          </Link>
        )}
      </div>

      {products.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          No products available yet. Check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
