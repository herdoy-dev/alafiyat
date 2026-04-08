import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProductForm } from "../../product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <ProductForm
      mode="edit"
      productId={product.id}
      initialValues={{
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        stock: product.stock,
        thumbnail: product.thumbnail,
        images: product.images,
        categoryId: product.categoryId ?? "",
        featured: product.featured,
      }}
    />
  );
}
