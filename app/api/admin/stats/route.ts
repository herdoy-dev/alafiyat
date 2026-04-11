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
      rejectedPurchases,
      totalOrders,
      recentPurchases,
      ordersByStatusRaw,
      topProductsRaw,
      ordersByMethodRaw,
      productsByCategoryRaw,
      courierByProviderRaw,
      courierByStatusRaw,
      courierSentCount,
      courierNotSentCount,
      revenueByProductRaw,
      lowStockProducts,
      outOfStockCount,
      utmBreakdownRaw,
    ] = await Promise.all([
      prisma.purchase.aggregate({
        _sum: { amount: true },
        where: { status: "approved" },
      }),
      prisma.user.count(),
      prisma.product.count(),
      prisma.purchase.count({ where: { status: "pending" } }),
      prisma.purchase.count({ where: { status: "approved" } }),
      prisma.purchase.count({ where: { status: "rejected" } }),
      prisma.purchase.count(),
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
      // Courier: by provider
      prisma.purchase.groupBy({
        by: ["courierProvider"],
        _count: { _all: true },
        where: { courierProvider: { not: null } },
      }),
      // Courier: by status
      prisma.purchase.groupBy({
        by: ["courierStatus"],
        _count: { _all: true },
        where: { courierStatus: { not: null } },
      }),
      // Courier: sent count
      prisma.purchase.count({ where: { courierSentAt: { not: null } } }),
      // Courier: not sent count (approved but not dispatched)
      prisma.purchase.count({
        where: { status: "approved", courierSentAt: null },
      }),
      // Revenue by product (top 5 revenue earners)
      prisma.purchaseItem.groupBy({
        by: ["productName"],
        _sum: { price: true, quantity: true },
        where: { purchase: { status: "approved" } },
        orderBy: { _sum: { price: "desc" } },
        take: 5,
      }),
      // Low stock products
      prisma.product.findMany({
        where: { stock: { gt: 0, lte: 5 } },
        select: { id: true, name: true, slug: true, stock: true },
        orderBy: { stock: "asc" },
        take: 10,
      }),
      // Out of stock products count
      prisma.product.count({ where: { stock: 0 } }),
      // UTM source breakdown
      prisma.purchase.groupBy({
        by: ["utmSource"],
        _count: { _all: true },
        _sum: { amount: true },
        where: { utmSource: { not: null } },
        orderBy: { _count: { utmSource: "desc" } },
        take: 10,
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

    // Revenue by category: get approved purchase items with product's category
    const revenueByCategoryItems = await prisma.purchaseItem.findMany({
      where: { purchase: { status: "approved" } },
      select: {
        price: true,
        quantity: true,
        product: { select: { categoryId: true } },
      },
    });
    const revCatMap = new Map<string, number>();
    for (const item of revenueByCategoryItems) {
      const catId = item.product.categoryId;
      const catName = catId ? (categoryNameMap.get(catId) ?? "Uncategorized") : "Uncategorized";
      revCatMap.set(catName, (revCatMap.get(catName) ?? 0) + item.price * item.quantity);
    }
    const revenueByCategory = Array.from(revCatMap.entries())
      .map(([category, revenue]) => ({ category, revenue }))
      .sort((a, b) => b.revenue - a.revenue);

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

    // Average order value
    const avgOrderValue =
      approvedPurchases > 0
        ? Math.round((totalRevenueResult._sum.amount || 0) / approvedPurchases)
        : 0;

    return NextResponse.json({
      summary: {
        totalRevenue: totalRevenueResult._sum.amount || 0,
        totalUsers,
        totalProducts,
        pendingPurchases,
        approvedPurchases,
        rejectedPurchases,
        totalOrders,
        avgOrderValue,
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
      // Profit breakdown
      revenueByProduct: revenueByProductRaw.map((p) => ({
        name: p.productName,
        revenue: (p._sum.price ?? 0) * (p._sum.quantity ?? 1),
      })),
      revenueByCategory,
      // Courier information
      courierByProvider: courierByProviderRaw.map((c) => ({
        provider: c.courierProvider!,
        count: c._count._all,
      })),
      courierByStatus: courierByStatusRaw.map((c) => ({
        status: c.courierStatus!,
        count: c._count._all,
      })),
      courierSummary: {
        sent: courierSentCount,
        awaitingDispatch: courierNotSentCount,
      },
      // Low stock
      lowStockProducts,
      outOfStockCount,
      // UTM breakdown
      utmBreakdown: utmBreakdownRaw.map((u) => ({
        source: u.utmSource!,
        count: u._count._all,
        revenue: u._sum.amount ?? 0,
      })),
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
