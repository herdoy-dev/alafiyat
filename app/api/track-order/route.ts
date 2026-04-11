import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, orderId } = body;

    if (!phone || !orderId) {
      return NextResponse.json(
        { error: "Phone and order ID are required" },
        { status: 400 }
      );
    }

    const trimmedId = orderId.trim().toUpperCase();

    // Try matching by full ID or last 8 characters
    const order = await prisma.purchase.findFirst({
      where: {
        shippingPhone: phone.trim(),
        OR: [
          { id: trimmedId },
          { id: { endsWith: trimmedId.toLowerCase() } },
        ],
      },
      include: {
        items: {
          select: { productName: true, quantity: true, price: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found. Check your phone number and order ID." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      order: {
        id: order.id,
        status: order.status,
        amount: order.amount,
        paymentMethod: order.paymentMethod,
        courierProvider: order.courierProvider,
        courierTrackingCode: order.courierTrackingCode,
        courierStatus: order.courierStatus,
        createdAt: order.createdAt,
        items: order.items,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
