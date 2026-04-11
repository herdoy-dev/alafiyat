import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/customer-auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const order = await prisma.purchase.findFirst({
      where: { id, customerId: customer.id },
      include: {
        items: {
          select: { productName: true, price: true, quantity: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
