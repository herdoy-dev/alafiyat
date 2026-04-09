import Link from "next/link";
import { X } from "lucide-react";
import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/product-card";

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
    <div className="container mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
      <header className="mb-10 flex flex-col gap-3 md:mb-12">
        <p className="font-display text-sm italic text-muted-foreground">
          {category ? "Filtered by category" : "Browse the catalog"}
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-4xl leading-[1.05] tracking-tight md:text-6xl">
            {category ? category.name : (
              <>
                All <em className="font-display italic">products</em>
              </>
            )}
          </h1>
          <p className="font-display text-base italic text-muted-foreground">
            {products.length} {products.length === 1 ? "item" : "items"}
          </p>
        </div>
        {category && (
          <Link
            href="/products"
            className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border/70 bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            Clear filter: {category.name}
            <X className="h-3 w-3" />
          </Link>
        )}
      </header>

      {products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/60 py-20 text-center">
          <p className="font-display text-2xl italic text-muted-foreground">
            Nothing here yet. Check back soon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
