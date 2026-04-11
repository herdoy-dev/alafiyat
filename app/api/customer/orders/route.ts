import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/customer-auth";

export async function GET() {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.purchase.findMany({
      where: { customerId: customer.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: { select: { productName: true, quantity: true, price: true } },
      },
    });

    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
