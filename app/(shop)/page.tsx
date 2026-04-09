import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
        <section className="border-b border-border/60 bg-gradient-to-b from-primary/[0.04] to-background">
          <div className="container mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-32">
            <div className="max-w-2xl space-y-5">
              <p className="font-display text-sm italic text-muted-foreground">
                Welcome to Al Amirat
              </p>
              <h1 className="font-display text-5xl leading-[0.95] tracking-tight md:text-7xl">
                Quality goods,{" "}
                <em className="font-display italic">delivered.</em>
              </h1>
              <p className="text-base text-muted-foreground md:text-lg">
                Curated essentials, paid easily with bKash, Nagad, Rocket, Upay
                — or cash on delivery.
              </p>
              <Button size="lg" asChild className="rounded-full">
                <Link href="/products">
                  Browse all products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
          <SectionHeader
            eyebrow="Shop by category"
            title="Pick your aisle"
          />
          <div className="mt-6">
            <CategorySlider categories={categories} />
          </div>
        </section>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="container mx-auto max-w-6xl border-t border-border/40 px-4 py-12 md:px-8 md:py-16">
          <SectionHeader
            eyebrow="Hand-picked"
            title="Featured this week"
            href="/products"
          />
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Latest */}
      <section className="container mx-auto max-w-6xl border-t border-border/40 px-4 py-12 md:px-8 md:py-16">
        <SectionHeader
          eyebrow="Just landed"
          title="New arrivals"
          href="/products"
        />
        {latest.length === 0 ? (
          <p className="mt-6 text-muted-foreground">No products yet.</p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {latest.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  href,
}: {
  eyebrow: string;
  title: string;
  href?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="font-display text-sm italic text-muted-foreground">
          {eyebrow}
        </p>
        <h2 className="mt-1 font-display text-3xl leading-none tracking-tight md:text-4xl">
          {title}
        </h2>
      </div>
      {href && (
        <Button variant="ghost" size="sm" asChild className="group">
          <Link href={href}>
            View all
            <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
      )}
    </div>
  );
}
