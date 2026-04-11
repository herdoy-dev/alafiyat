import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [
      activeVisitors,
      recentViews,
      trafficSourcesRaw,
      utmBreakdownRaw,
      topPagesRaw,
      deviceBreakdownRaw,
      browserBreakdownRaw,
      cityBreakdownRaw,
      totalViewsToday,
      totalViews7d,
    ] = await Promise.all([
      // Active visitors (distinct sessions in last 5 min)
      prisma.pageView.findMany({
        where: { createdAt: { gte: fiveMinAgo } },
        select: { sessionId: true },
        distinct: ["sessionId"],
      }),
      // Recent 50 page views
      prisma.pageView.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        select: {
          id: true,
          sessionId: true,
          page: true,
          referrer: true,
          device: true,
          browser: true,
          city: true,
          country: true,
          utmSource: true,
          createdAt: true,
        },
      }),
      // Traffic sources (referrer) last 7 days
      prisma.pageView.groupBy({
        by: ["referrer"],
        _count: { _all: true },
        where: {
          createdAt: { gte: sevenDaysAgo },
          referrer: { not: null },
        },
        orderBy: { _count: { referrer: "desc" } },
        take: 10,
      }),
      // UTM breakdown last 7 days
      prisma.pageView.groupBy({
        by: ["utmSource", "utmCampaign"],
        _count: { _all: true },
        where: {
          createdAt: { gte: sevenDaysAgo },
          utmSource: { not: null },
        },
        orderBy: { _count: { utmSource: "desc" } },
        take: 15,
      }),
      // Top pages last 7 days
      prisma.pageView.groupBy({
        by: ["page"],
        _count: { _all: true },
        where: { createdAt: { gte: sevenDaysAgo } },
        orderBy: { _count: { page: "desc" } },
        take: 10,
      }),
      // Device breakdown last 7 days
      prisma.pageView.groupBy({
        by: ["device"],
        _count: { _all: true },
        where: {
          createdAt: { gte: sevenDaysAgo },
          device: { not: null },
        },
      }),
      // Browser breakdown last 7 days
      prisma.pageView.groupBy({
        by: ["browser"],
        _count: { _all: true },
        where: {
          createdAt: { gte: sevenDaysAgo },
          browser: { not: null },
        },
        orderBy: { _count: { browser: "desc" } },
        take: 8,
      }),
      // City breakdown last 7 days
      prisma.pageView.groupBy({
        by: ["city"],
        _count: { _all: true },
        where: {
          createdAt: { gte: sevenDaysAgo },
          city: { not: null },
        },
        orderBy: { _count: { city: "desc" } },
        take: 10,
      }),
      // Total views today
      prisma.pageView.count({
        where: {
          createdAt: {
            gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          },
        },
      }),
      // Total views last 7 days
      prisma.pageView.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
    ]);

    // Hourly timeline (last 24h)
    const hourlyViews = await prisma.pageView.findMany({
      where: { createdAt: { gte: twentyFourHoursAgo } },
      select: { createdAt: true },
    });

    const hourlyMap = new Map<string, number>();
    for (let h = 23; h >= 0; h--) {
      const d = new Date(now.getTime() - h * 60 * 60 * 1000);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:00`;
      hourlyMap.set(key, 0);
    }
    for (const v of hourlyViews) {
      const d = v.createdAt;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:00`;
      if (hourlyMap.has(key)) {
        hourlyMap.set(key, (hourlyMap.get(key) ?? 0) + 1);
      }
    }

    const hourlyTimeline = Array.from(hourlyMap.entries()).map(
      ([hour, views]) => ({ hour, views })
    );

    // Parse referrer domains
    function parseDomain(ref: string) {
      try {
        return new URL(ref).hostname.replace("www.", "");
      } catch {
        return ref;
      }
    }

    return NextResponse.json({
      activeVisitors: activeVisitors.length,
      totalViewsToday,
      totalViews7d,
      recentViews,
      trafficSources: trafficSourcesRaw.map((t) => ({
        source: parseDomain(t.referrer!),
        count: t._count._all,
      })),
      utmBreakdown: utmBreakdownRaw.map((u) => ({
        source: u.utmSource,
        campaign: u.utmCampaign,
        count: u._count._all,
      })),
      topPages: topPagesRaw.map((p) => ({
        page: p.page,
        count: p._count._all,
      })),
      deviceBreakdown: deviceBreakdownRaw.map((d) => ({
        device: d.device,
        count: d._count._all,
      })),
      browserBreakdown: browserBreakdownRaw.map((b) => ({
        browser: b.browser,
        count: b._count._all,
      })),
      cityBreakdown: cityBreakdownRaw.map((c) => ({
        city: c.city,
        count: c._count._all,
      })),
      hourlyTimeline,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
