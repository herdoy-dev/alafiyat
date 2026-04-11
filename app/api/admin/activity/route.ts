import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
    const limit = 30;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.auditLog.count(),
    ]);

    // Fetch admin names
    const userIds = [...new Set(logs.map((l) => l.userId))];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true },
    });
    const nameMap = new Map(users.map((u) => [u.id, u.name]));

    const enriched = logs.map((l) => ({
      ...l,
      userName: nameMap.get(l.userId) || "Unknown",
    }));

    return NextResponse.json({ logs: enriched, total, page, limit });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
