import prisma from "@/lib/prisma";
import { createPathaoOrder, getPathaoStatus } from "./pathao";
import { createSteadfastOrder, getSteadfastStatus } from "./steadfast";

export type CourierProvider = "pathao" | "steadfast";

export async function sendPurchaseToCourier(
  purchaseId: string,
  provider: CourierProvider
) {
  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
    include: { items: true },
  });

  if (!purchase) throw new Error("Purchase not found");
  if (purchase.status !== "approved") {
    throw new Error("Order must be approved before sending to courier");
  }
  if (purchase.courierProvider) {
    throw new Error("Order has already been sent to a courier");
  }

  const fullAddress = `${purchase.shippingAddress}, ${purchase.shippingCity}`;
  const totalQuantity = purchase.items.reduce((sum, i) => sum + i.quantity, 0);
  const itemDescription = purchase.items
    .map((i) => `${i.productName} x${i.quantity}`)
    .join(", ");
  const codAmount =
    purchase.paymentMethod === "Cash on Delivery" ? purchase.amount : 0;

  let consignmentId: string;
  let trackingCode: string | null = null;
  let courierStatus: string;

  if (provider === "steadfast") {
    const consignment = await createSteadfastOrder({
      invoice: purchase.id,
      recipientName: purchase.shippingName,
      recipientPhone: purchase.shippingPhone,
      recipientAddress: fullAddress,
      codAmount,
      note: purchase.notes || itemDescription,
    });
    consignmentId = String(consignment.consignment_id);
    trackingCode = consignment.tracking_code;
    courierStatus = consignment.status;
  } else if (provider === "pathao") {
    const order = await createPathaoOrder({
      merchantOrderId: purchase.id,
      recipientName: purchase.shippingName,
      recipientPhone: purchase.shippingPhone,
      recipientAddress: fullAddress,
      amountToCollect: codAmount,
      itemQuantity: totalQuantity,
      itemDescription,
      specialInstruction: purchase.notes || undefined,
    });
    consignmentId = order.consignment_id;
    courierStatus = order.order_status;
  } else {
    throw new Error("Unsupported courier provider");
  }

  return prisma.purchase.update({
    where: { id: purchaseId },
    data: {
      courierProvider: provider,
      courierConsignmentId: consignmentId,
      courierTrackingCode: trackingCode,
      courierStatus,
      courierSentAt: new Date(),
    },
    include: { items: true },
  });
}

export async function refreshCourierStatus(purchaseId: string) {
  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
  });

  if (!purchase) throw new Error("Purchase not found");
  if (!purchase.courierProvider || !purchase.courierConsignmentId) {
    throw new Error("Order has not been sent to a courier");
  }

  let status: string;
  if (purchase.courierProvider === "steadfast") {
    status = await getSteadfastStatus(purchase.courierConsignmentId);
  } else if (purchase.courierProvider === "pathao") {
    status = await getPathaoStatus(purchase.courierConsignmentId);
  } else {
    throw new Error("Unsupported courier provider");
  }

  return prisma.purchase.update({
    where: { id: purchaseId },
    data: { courierStatus: status },
    include: { items: true },
  });
}
