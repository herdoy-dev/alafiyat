import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limit = Number(request.nextUrl.searchParams.get("limit")) || 50;
    const offset = Number(request.nextUrl.searchParams.get("offset")) || 0;

    // Get distinct sessions ordered by most recent activity
    const sessionIds = await prisma.pageView.findMany({
      select: { sessionId: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      distinct: ["sessionId"],
      skip: offset,
      take: limit,
    });

    if (sessionIds.length === 0) {
      return NextResponse.json({ sessions: [], total: 0 });
    }

    const ids = sessionIds.map((s) => s.sessionId);

    // Fetch all page views for these sessions
    const views = await prisma.pageView.findMany({
      where: { sessionId: { in: ids } },
      orderBy: { createdAt: "asc" },
      select: {
        sessionId: true,
        page: true,
        referrer: true,
        device: true,
        browser: true,
        city: true,
        country: true,
        utmSource: true,
        utmCampaign: true,
        createdAt: true,
      },
    });

    // Group by session
    const sessionMap = new Map<
      string,
      typeof views
    >();
    for (const v of views) {
      const arr = sessionMap.get(v.sessionId) || [];
      arr.push(v);
      sessionMap.set(v.sessionId, arr);
    }

    const sessions = ids.map((id) => {
      const pages = sessionMap.get(id) || [];
      const first = pages[0];
      const last = pages[pages.length - 1];
      const durationMs = first && last
        ? new Date(last.createdAt).getTime() - new Date(first.createdAt).getTime()
        : 0;

      return {
        sessionId: id,
        pageCount: pages.length,
        entryPage: first?.page || "",
        exitPage: last?.page || "",
        referrer: first?.referrer || null,
        utmSource: first?.utmSource || null,
        utmCampaign: first?.utmCampaign || null,
        device: first?.device || null,
        browser: first?.browser || null,
        city: first?.city || null,
        country: first?.country || null,
        startedAt: first?.createdAt || null,
        durationSeconds: Math.round(durationMs / 1000),
        pages: pages.map((p) => ({
          page: p.page,
          time: p.createdAt,
        })),
      };
    });

    const total = await prisma.pageView.findMany({
      select: { sessionId: true },
      distinct: ["sessionId"],
    });

    return NextResponse.json({
      sessions,
      total: total.length,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
