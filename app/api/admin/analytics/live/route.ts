import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sinceParam = request.nextUrl.searchParams.get("since");
    const since = sinceParam ? new Date(sinceParam) : new Date(Date.now() - 30000);

    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);

    const [newViews, activeVisitors] = await Promise.all([
      prisma.pageView.findMany({
        where: { createdAt: { gt: since } },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          sessionId: true,
          page: true,
          referrer: true,
          device: true,
          browser: true,
          city: true,
          utmSource: true,
          createdAt: true,
        },
      }),
      prisma.pageView.findMany({
        where: { createdAt: { gte: fiveMinAgo } },
        select: { sessionId: true },
        distinct: ["sessionId"],
      }),
    ]);

    return NextResponse.json({
      views: newViews,
      activeVisitors: activeVisitors.length,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
