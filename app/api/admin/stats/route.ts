import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";

const DAYS = 30;

function dateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function emptyDays(): Map<string, { revenue: number; count: number }> {
  const map = new Map<string, { revenue: number; count: number }>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    map.set(dateKey(d), { revenue: 0, count: 0 });
  }
  return map;
}

export async function GET() {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const since = new Date();
    since.setHours(0, 0, 0, 0);
    since.setDate(since.getDate() - (DAYS - 1));

    const [
      totalRevenueResult,
      totalUsers,
      totalProducts,
      pendingPurchases,
      approvedPurchases,
      recentPurchases,
      ordersByStatusRaw,
      topProductsRaw,
      ordersByMethodRaw,
      productsByCategoryRaw,
    ] = await Promise.all([
      prisma.purchase.aggregate({
        _sum: { amount: true },
        where: { status: "approved" },
      }),
      prisma.user.count(),
      prisma.product.count(),
      prisma.purchase.count({ where: { status: "pending" } }),
      prisma.purchase.count({ where: { status: "approved" } }),
      prisma.purchase.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true, amount: true, status: true },
      }),
      prisma.purchase.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
      prisma.purchaseItem.groupBy({
        by: ["productName"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
      prisma.purchase.groupBy({
        by: ["paymentMethod"],
        _count: { _all: true },
      }),
      prisma.product.groupBy({
        by: ["categoryId"],
        _count: { _all: true },
      }),
    ]);

    const categoryIds = productsByCategoryRaw
      .map((c) => c.categoryId)
      .filter((id): id is string => id !== null);
    const categories =
      categoryIds.length > 0
        ? await prisma.category.findMany({
            where: { id: { in: categoryIds } },
            select: { id: true, name: true },
          })
        : [];
    const categoryNameMap = new Map(categories.map((c) => [c.id, c.name]));

    // Bucket recent purchases into days
    const buckets = emptyDays();
    for (const p of recentPurchases) {
      const key = dateKey(p.createdAt);
      const bucket = buckets.get(key);
      if (!bucket) continue;
      bucket.count += 1;
      if (p.status === "approved") bucket.revenue += p.amount;
    }

    const revenueByDay: { date: string; revenue: number }[] = [];
    const ordersByDay: { date: string; count: number }[] = [];
    for (const [date, v] of buckets) {
      revenueByDay.push({ date, revenue: v.revenue });
      ordersByDay.push({ date, count: v.count });
    }

    return NextResponse.json({
      summary: {
        totalRevenue: totalRevenueResult._sum.amount || 0,
        totalUsers,
        totalProducts,
        pendingPurchases,
        approvedPurchases,
      },
      revenueByDay,
      ordersByDay,
      ordersByStatus: ordersByStatusRaw.map((s) => ({
        status: s.status,
        count: s._count._all,
      })),
      topProducts: topProductsRaw.map((p) => ({
        name: p.productName,
        quantity: p._sum.quantity ?? 0,
      })),
      ordersByPaymentMethod: ordersByMethodRaw.map((m) => ({
        method: m.paymentMethod,
        count: m._count._all,
      })),
      productsByCategory: productsByCategoryRaw.map((c) => ({
        category: c.categoryId
          ? categoryNameMap.get(c.categoryId) ?? "Uncategorized"
          : "Uncategorized",
        count: c._count._all,
      })),
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
