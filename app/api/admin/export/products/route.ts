import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";
import { generateCSV } from "@/lib/csv";

export async function GET() {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });

    const headers = ["Name", "Slug", "Price", "Stock", "Category", "Featured", "Created"];
    const rows = products.map((p) => [
      p.name,
      p.slug,
      p.price,
      p.stock,
      p.category?.name,
      p.featured ? "Yes" : "No",
      p.createdAt.toISOString().slice(0, 10),
    ]);

    const csv = generateCSV(headers, rows);

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="products-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
