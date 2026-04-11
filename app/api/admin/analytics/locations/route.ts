import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000);

    // Get most recent view per active session with coordinates
    const recentViews = await prisma.pageView.findMany({
      where: {
        createdAt: { gte: fifteenMinAgo },
        latitude: { not: null },
        longitude: { not: null },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        sessionId: true,
        page: true,
        city: true,
        country: true,
        device: true,
        browser: true,
        latitude: true,
        longitude: true,
        createdAt: true,
      },
    });

    // Deduplicate by sessionId, keeping only the most recent per session
    const seen = new Set<string>();
    const locations = recentViews.filter((v) => {
      if (seen.has(v.sessionId)) return false;
      seen.add(v.sessionId);
      return true;
    });

    return NextResponse.json({ locations });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
