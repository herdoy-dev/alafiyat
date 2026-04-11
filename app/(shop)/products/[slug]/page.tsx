import { notFound } from "next/navigation";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { ProductDetail } from "./product-detail";
import { ProductJsonLd } from "@/components/seo/product-json-ld";
import { RelatedProducts } from "@/components/storefront/related-products";

export const dynamic = "force-dynamic";

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
}

async function getDomain() {
  const row = await prisma.siteSetting.findUnique({
    where: { key: "site_domain" },
  });
  const d = row?.value || "https://example.com";
  return d.startsWith("http") ? d : `https://${d}`;
}

async function getRelatedProducts(productId: string, categoryId: string | null) {
  if (!categoryId) return [];
  return prisma.product.findMany({
    where: {
      categoryId,
      id: { not: productId },
      stock: { gt: 0 },
    },
    take: 4,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [product, domain] = await Promise.all([
    getProduct(slug),
    getDomain(),
  ]);
  if (!product) return {};

  const description = product.description
    .replace(/<[^>]*>/g, "")
    .slice(0, 160);

  return {
    title: `${product.name} | Al Amirat`,
    description,
    openGraph: {
      title: product.name,
      description,
      images: [{ url: product.thumbnail }],
      type: "website",
    },
    alternates: {
      canonical: `${domain}/products/${slug}`,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, domain] = await Promise.all([
    getProduct(slug),
    getDomain(),
  ]);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(
    product.id,
    product.categoryId
  );

  return (
    <>
      <ProductJsonLd product={product} domain={domain} />
      <ProductDetail product={product} />
      <div className="container mx-auto max-w-6xl px-4 md:px-8 pb-16">
        <RelatedProducts products={relatedProducts} />
      </div>
    </>
  );
}
