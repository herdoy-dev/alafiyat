import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { purchaseSchema } from "@/schemas/purchase";
import { validationError } from "@/lib/api-utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = purchaseSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed);
    }

    const ids = parsed.data.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: ids } },
    });

    if (products.length !== ids.length) {
      return NextResponse.json(
        { error: "One or more products not found" },
        { status: 400 }
      );
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    let amount = 0;
    const itemsData = parsed.data.items.map((item) => {
      const product = productMap.get(item.productId)!;
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
      amount += product.price * item.quantity;
      return {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: item.quantity,
      };
    });

    const isCod = parsed.data.paymentMethod === "Cash on Delivery";

    // Find-or-create customer keyed by phone; refresh latest contact details
    const customerEmail = parsed.data.customerEmail || null;
    const customer = await prisma.customer.upsert({
      where: { phone: parsed.data.shippingPhone },
      create: {
        fullName: parsed.data.shippingName,
        phone: parsed.data.shippingPhone,
        email: customerEmail,
        address: parsed.data.shippingAddress,
        city: parsed.data.shippingCity,
      },
      update: {
        fullName: parsed.data.shippingName,
        email: customerEmail ?? undefined,
        address: parsed.data.shippingAddress,
        city: parsed.data.shippingCity,
      },
    });

    const purchase = await prisma.purchase.create({
      data: {
        customerId: customer.id,
        customerEmail,
        amount,
        paymentMethod: parsed.data.paymentMethod,
        phoneNumber: isCod
          ? parsed.data.shippingPhone
          : parsed.data.phoneNumber,
        transactionId: isCod ? "COD" : parsed.data.transactionId,
        shippingName: parsed.data.shippingName,
        shippingPhone: parsed.data.shippingPhone,
        shippingAddress: parsed.data.shippingAddress,
        shippingCity: parsed.data.shippingCity,
        notes: parsed.data.notes,
        status: "pending",
        items: { create: itemsData },
      },
      include: { items: true },
    });

    return NextResponse.json({ purchase });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
