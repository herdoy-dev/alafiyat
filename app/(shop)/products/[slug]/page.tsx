import { notFound } from "next/navigation";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { ProductDetail } from "./product-detail";
import { ProductJsonLd } from "@/components/seo/product-json-ld";

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

  return (
    <>
      <ProductJsonLd product={product} domain={domain} />
      <ProductDetail product={product} />
    </>
  );
}
