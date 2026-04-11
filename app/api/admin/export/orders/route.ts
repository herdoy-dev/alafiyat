import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";
import { generateCSV } from "@/lib/csv";

export async function GET() {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const orders = await prisma.purchase.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });

    const headers = [
      "Order ID", "Date", "Customer", "Phone", "Email", "City",
      "Amount", "Discount", "Status", "Payment Method",
      "Courier", "Courier Status", "Tracking Code", "Items",
    ];

    const rows = orders.map((o) => [
      o.id.slice(-8).toUpperCase(),
      o.createdAt.toISOString().slice(0, 10),
      o.shippingName,
      o.shippingPhone,
      o.customerEmail,
      o.shippingCity,
      o.amount,
      o.discountAmount,
      o.status,
      o.paymentMethod,
      o.courierProvider,
      o.courierStatus,
      o.courierTrackingCode,
      o.items.map((i) => `${i.productName} x${i.quantity}`).join("; "),
    ]);

    const csv = generateCSV(headers, rows);

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="orders-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
