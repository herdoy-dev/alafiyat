import prisma from "@/lib/prisma";

export async function approvePurchase(purchaseId: string) {
  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
    include: { items: true },
  });

  if (!purchase) throw new Error("Purchase not found");
  if (purchase.status !== "pending")
    throw new Error("Purchase already processed");

  await prisma.$transaction([
    prisma.purchase.update({
      where: { id: purchaseId },
      data: { status: "approved" },
    }),
    ...purchase.items.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    ),
  ]);

  return prisma.purchase.findUnique({
    where: { id: purchaseId },
    include: { items: true },
  });
}

export async function rejectPurchase(purchaseId: string) {
  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
  });

  if (!purchase) throw new Error("Purchase not found");
  if (purchase.status !== "pending")
    throw new Error("Purchase already processed");

  await prisma.purchase.update({
    where: { id: purchaseId },
    data: { status: "rejected" },
  });

  return prisma.purchase.findUnique({
    where: { id: purchaseId },
    include: { items: true },
  });
}
