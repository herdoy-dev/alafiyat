import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductFilters } from "@/components/storefront/product-filters";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

type SearchParams = {
  category?: string;
  search?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { category: categorySlug, search, sort, minPrice, maxPrice } = params;

  const categories = await prisma.category.findMany({
    select: { slug: true, name: true },
    orderBy: { name: "asc" },
  });

  const category = categorySlug
    ? await prisma.category.findUnique({ where: { slug: categorySlug } })
    : null;

  // Build where clause
  const where: Record<string, unknown> = {};
  if (category) where.categoryId = category.id;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) (where.price as Record<string, unknown>).gte = Number(minPrice);
    if (maxPrice) (where.price as Record<string, unknown>).lte = Number(maxPrice);
  }

  // Build orderBy
  let orderBy: Record<string, string> = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  else if (sort === "price_desc") orderBy = { price: "desc" };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: { category: true },
  });

  const title = search
    ? `Results for "${search}"`
    : category
      ? category.name
      : "All products";

  const subtitle = search
    ? "Search results"
    : category
      ? "Filtered by category"
      : "Browse the catalog";

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
      <header className="mb-8 flex flex-col gap-3 md:mb-10">
        <p className="font-display text-sm italic text-muted-foreground">
          {subtitle}
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-4xl leading-[1.05] tracking-tight md:text-6xl">
            {search ? (
              title
            ) : category ? (
              category.name
            ) : (
              <>
                All <em className="font-display italic">products</em>
              </>
            )}
          </h1>
          <p className="font-display text-base italic text-muted-foreground">
            {products.length} {products.length === 1 ? "item" : "items"}
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="mb-8">
        <Suspense fallback={<Skeleton className="h-10 w-full" />}>
          <ProductFilters categories={categories} />
        </Suspense>
      </div>

      {products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/60 py-20 text-center">
          <p className="font-display text-2xl italic text-muted-foreground">
            Nothing found. Try adjusting your filters.
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
