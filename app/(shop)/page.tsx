import Link from "next/link";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/storefront/product-card";
import { HeroSlider } from "@/components/storefront/hero-slider";
import { CategorySlider } from "@/components/storefront/category-slider";
import { HERO_PRODUCTS_KEY } from "@/lib/settings";

export const dynamic = "force-dynamic";

async function getHeroProducts() {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: HERO_PRODUCTS_KEY },
  });
  if (!setting?.value) return null;
  let ids: string[] = [];
  try {
    const parsed = JSON.parse(setting.value);
    if (Array.isArray(parsed)) {
      ids = parsed.filter((id): id is string => typeof id === "string");
    }
  } catch {
    return null;
  }
  if (ids.length === 0) return null;
  const rows = await prisma.product.findMany({
    where: { id: { in: ids } },
    include: { category: true },
  });
  // Preserve admin-defined order
  const byId = new Map(rows.map((r) => [r.id, r]));
  return ids.map((id) => byId.get(id)).filter((p): p is NonNullable<typeof p> => !!p);
}

export default async function HomePage() {
  const featured = await prisma.product.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { category: true },
  });

  const latest = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { category: true },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const heroSelected = await getHeroProducts();
  const heroProducts =
    heroSelected && heroSelected.length > 0 ? heroSelected : latest.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      {heroProducts.length > 0 ? (
        <HeroSlider products={heroProducts} />
      ) : (
        <section className="border-b bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
            <div className="max-w-2xl space-y-4">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Shop the latest products
              </h1>
              <p className="text-lg text-muted-foreground">
                Curated quality goods, delivered to your door. Pay easily with
                bKash, Nagad, Rocket, or Upay.
              </p>
              <Button size="lg" asChild>
                <Link href="/products">Browse all products</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <CategorySlider categories={categories} />

      {/* Featured */}
      {featured.length > 0 && (
        <section className="container mx-auto max-w-6xl px-4 py-12 md:px-8">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">Featured</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Latest */}
      <section className="container mx-auto max-w-6xl px-4 py-12 md:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">New arrivals</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/products">View all</Link>
          </Button>
        </div>
        {latest.length === 0 ? (
          <p className="text-muted-foreground">No products yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {latest.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
