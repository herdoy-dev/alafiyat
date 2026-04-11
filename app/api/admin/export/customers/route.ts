import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";
import { generateCSV } from "@/lib/csv";

export async function GET() {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { purchases: true } } },
    });

    const headers = ["Name", "Phone", "Email", "Address", "City", "Orders", "Joined"];
    const rows = customers.map((c) => [
      c.fullName,
      c.phone,
      c.email,
      c.address,
      c.city,
      c._count.purchases,
      c.createdAt.toISOString().slice(0, 10),
    ]);

    const csv = generateCSV(headers, rows);

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="customers-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
