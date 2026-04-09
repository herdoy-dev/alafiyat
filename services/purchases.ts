import prisma from "@/lib/prisma";
import type { EditPurchaseInput } from "@/schemas/purchase";

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

export async function editPurchase(
  purchaseId: string,
  input: EditPurchaseInput
) {
  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
    include: { items: true },
  });

  if (!purchase) throw new Error("Purchase not found");
  if (purchase.courierProvider) {
    throw new Error("Cannot edit an order that has been sent to courier");
  }

  // Validate every product exists and has stock for the delta
  const productIds = Array.from(new Set(input.items.map((i) => i.productId)));
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));
  for (const item of input.items) {
    if (!productMap.has(item.productId)) {
      throw new Error(`Product not found: ${item.productId}`);
    }
  }

  // If the purchase is already approved, stock has been decremented for the
  // existing items. Compute the delta per product so we adjust correctly.
  const wasApproved = purchase.status === "approved";

  const oldQtyByProduct = new Map<string, number>();
  if (wasApproved) {
    for (const item of purchase.items) {
      oldQtyByProduct.set(
        item.productId,
        (oldQtyByProduct.get(item.productId) || 0) + item.quantity
      );
    }
  }

  const newQtyByProduct = new Map<string, number>();
  for (const item of input.items) {
    newQtyByProduct.set(
      item.productId,
      (newQtyByProduct.get(item.productId) || 0) + item.quantity
    );
  }

  if (wasApproved) {
    // For each product, compute delta = new - old. If delta > 0, ensure stock.
    const allIds = new Set([
      ...oldQtyByProduct.keys(),
      ...newQtyByProduct.keys(),
    ]);
    for (const pid of allIds) {
      const delta =
        (newQtyByProduct.get(pid) || 0) - (oldQtyByProduct.get(pid) || 0);
      if (delta > 0) {
        const product = productMap.get(pid);
        // Product may not be in productMap if it's only in old items; fetch.
        const stock = product
          ? product.stock
          : (await prisma.product.findUnique({ where: { id: pid } }))?.stock ??
            0;
        if (stock < delta) {
          throw new Error(
            `Insufficient stock for ${product?.name || pid}: need ${delta} more`
          );
        }
      }
    }
  }

  const newAmount = input.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  await prisma.$transaction(async (tx) => {
    // Replace items
    await tx.purchaseItem.deleteMany({ where: { purchaseId } });
    await tx.purchaseItem.createMany({
      data: input.items.map((i) => ({
        purchaseId,
        productId: i.productId,
        productName: i.productName,
        price: i.price,
        quantity: i.quantity,
      })),
    });

    // Update shipping + amount
    await tx.purchase.update({
      where: { id: purchaseId },
      data: {
        shippingName: input.shippingName,
        shippingPhone: input.shippingPhone,
        shippingAddress: input.shippingAddress,
        shippingCity: input.shippingCity,
        notes: input.notes ?? null,
        amount: newAmount,
      },
    });

    // Stock adjustments only if approved
    if (wasApproved) {
      const allIds = new Set([
        ...oldQtyByProduct.keys(),
        ...newQtyByProduct.keys(),
      ]);
      for (const pid of allIds) {
        const delta =
          (newQtyByProduct.get(pid) || 0) - (oldQtyByProduct.get(pid) || 0);
        if (delta !== 0) {
          await tx.product.update({
            where: { id: pid },
            data: { stock: { decrement: delta } },
          });
        }
      }
    }
  });

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

export async function unapprovePurchase(purchaseId: string) {
  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
    include: { items: true },
  });

  if (!purchase) throw new Error("Purchase not found");
  if (purchase.status !== "approved")
    throw new Error("Only approved orders can be reverted");
  if (purchase.courierProvider)
    throw new Error("Cannot change status after sending to courier");

  await prisma.$transaction([
    prisma.purchase.update({
      where: { id: purchaseId },
      data: { status: "pending" },
    }),
    ...purchase.items.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      })
    ),
  ]);

  return prisma.purchase.findUnique({
    where: { id: purchaseId },
    include: { items: true },
  });
}

export async function reopenPurchase(purchaseId: string) {
  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
  });

  if (!purchase) throw new Error("Purchase not found");
  if (purchase.status !== "rejected")
    throw new Error("Only rejected orders can be reopened");

  await prisma.purchase.update({
    where: { id: purchaseId },
    data: { status: "pending" },
  });

  return prisma.purchase.findUnique({
    where: { id: purchaseId },
    include: { items: true },
  });
}
