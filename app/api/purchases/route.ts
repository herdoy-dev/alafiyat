import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { purchaseSchema } from "@/schemas/purchase";
import { validationError } from "@/lib/api-utils";
import { trackServerPurchase } from "@/lib/facebook-capi";

export async function POST(request: NextRequest) {
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

    // Validate and apply coupon if provided
    let discountAmount = 0;
    const discountCode = parsed.data.discountCode || null;

    if (discountCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: discountCode.toUpperCase().trim() },
      });
      if (
        coupon &&
        coupon.active &&
        (!coupon.expiresAt || new Date(coupon.expiresAt) >= new Date()) &&
        (coupon.maxUses === null || coupon.usedCount < coupon.maxUses) &&
        amount >= coupon.minOrder
      ) {
        if (coupon.type === "percentage") {
          discountAmount = Math.round((amount * coupon.value) / 100);
        } else {
          discountAmount = Math.min(coupon.value, amount);
        }
        // Increment usage
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }
    }

    const finalAmount = Math.max(0, amount - discountAmount);

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
        amount: finalAmount,
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
        discountCode,
        discountAmount,
        utmSource: parsed.data.utmSource || null,
        utmMedium: parsed.data.utmMedium || null,
        utmCampaign: parsed.data.utmCampaign || null,
        utmContent: parsed.data.utmContent || null,
        utmTerm: parsed.data.utmTerm || null,
        status: "pending",
        items: { create: itemsData },
      },
      include: { items: true },
    });

    // Facebook Conversions API: send Purchase event server-side (fire-and-forget)
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null;
    const userAgent = request.headers.get("user-agent") || null;
    const fbc = request.cookies.get("_fbc")?.value || null;
    const fbp = request.cookies.get("_fbp")?.value || null;
    const referer = request.headers.get("referer") || undefined;

    trackServerPurchase({
      orderId: purchase.id,
      value: finalAmount,
      email: customerEmail,
      phone: parsed.data.shippingPhone,
      city: parsed.data.shippingCity,
      ip,
      userAgent,
      fbc,
      fbp,
      sourceUrl: referer,
    }).catch(() => {});

    return NextResponse.json({ purchase });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
