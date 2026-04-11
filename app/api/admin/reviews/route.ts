import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const status = request.nextUrl.searchParams.get("status");
    const where = status ? { status } : {};

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { product: { select: { name: true, slug: true } } },
    });

    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
