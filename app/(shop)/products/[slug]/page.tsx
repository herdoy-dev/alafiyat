import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProductDetail } from "./product-detail";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!product) notFound();

  return <ProductDetail product={product} />;
}
