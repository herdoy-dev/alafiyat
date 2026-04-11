"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  Package,
  TrendingUp,
  XCircle,
  ShoppingCart,
  Truck,
  PackageCheck,
  PackageX,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import { RevenueChart } from "@/components/admin/charts/revenue-chart";
import { OrdersStatusChart } from "@/components/admin/charts/orders-status-chart";
import { TopProductsChart } from "@/components/admin/charts/top-products-chart";
import { PaymentMethodsChart } from "@/components/admin/charts/payment-methods-chart";
import { OrdersCountChart } from "@/components/admin/charts/orders-count-chart";
import { ProductsCategoryChart } from "@/components/admin/charts/products-category-chart";
import { ProfitBreakdownChart } from "@/components/admin/charts/profit-breakdown-chart";
import { RevenueByCategoryChart } from "@/components/admin/charts/revenue-by-category-chart";
import { CourierStatusChart } from "@/components/admin/charts/courier-status-chart";
import { CourierProviderChart } from "@/components/admin/charts/courier-provider-chart";
import { UtmBreakdownChart } from "@/components/admin/charts/utm-breakdown-chart";

type Stats = {
  summary: {
    totalRevenue: number;
    totalUsers: number;
    totalProducts: number;
    pendingPurchases: number;
    approvedPurchases: number;
    rejectedPurchases: number;
    totalOrders: number;
    avgOrderValue: number;
  };
  revenueByDay: { date: string; revenue: number }[];
  ordersByDay: { date: string; count: number }[];
  ordersByStatus: { status: string; count: number }[];
  topProducts: { name: string; quantity: number }[];
  ordersByPaymentMethod: { method: string; count: number }[];
  productsByCategory: { category: string; count: number }[];
  revenueByProduct: { name: string; revenue: number }[];
  revenueByCategory: { category: string; revenue: number }[];
  courierByProvider: { provider: string; count: number }[];
  courierByStatus: { status: string; count: number }[];
  courierSummary: { sent: number; awaitingDispatch: number };
  utmBreakdown: { source: string; count: number; revenue: number }[];
  lowStockProducts: { id: string; name: string; slug: string; stock: number }[];
  outOfStockCount: number;
};

export default function AdminHomePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch {
        toast.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const summaryCards = [
    {
      title: "Revenue",
      value: stats ? `৳${stats.summary.totalRevenue.toLocaleString()}` : "",
      icon: DollarSign,
      tone: "primary" as const,
    },
    {
      title: "Avg. Order",
      value: stats ? `৳${stats.summary.avgOrderValue.toLocaleString()}` : "",
      icon: BarChart3,
      tone: "muted" as const,
    },
    {
      title: "Total Orders",
      value: stats ? stats.summary.totalOrders.toLocaleString() : "",
      icon: ShoppingCart,
      tone: "muted" as const,
    },
    {
      title: "Customers",
      value: stats ? stats.summary.totalUsers.toLocaleString() : "",
      icon: Users,
      tone: "muted" as const,
    },
    {
      title: "Products",
      value: stats ? stats.summary.totalProducts.toLocaleString() : "",
      icon: Package,
      tone: "muted" as const,
    },
  ];

  const orderStatusCards = [
    {
      title: "Pending",
      value: stats ? stats.summary.pendingPurchases.toLocaleString() : "",
      icon: Clock,
      color: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-50 dark:bg-yellow-950/30",
      border: "border-yellow-200 dark:border-yellow-800/50",
    },
    {
      title: "Approved",
      value: stats ? stats.summary.approvedPurchases.toLocaleString() : "",
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-950/30",
      border: "border-green-200 dark:border-green-800/50",
    },
    {
      title: "Rejected",
      value: stats ? stats.summary.rejectedPurchases.toLocaleString() : "",
      icon: XCircle,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-950/30",
      border: "border-red-200 dark:border-red-800/50",
    },
  ];

  const courierCards = [
    {
      title: "Dispatched",
      value: stats ? stats.courierSummary.sent.toLocaleString() : "",
      icon: PackageCheck,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-200 dark:border-blue-800/50",
    },
    {
      title: "Awaiting Dispatch",
      value: stats ? stats.courierSummary.awaitingDispatch.toLocaleString() : "",
      icon: PackageX,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-950/30",
      border: "border-orange-200 dark:border-orange-800/50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Editorial header */}
      <header className="flex flex-col gap-1">
        <p className="font-display text-sm italic text-muted-foreground">
          A bird&apos;s-eye view
        </p>
        <h1 className="font-display text-4xl leading-[1.05] tracking-tight md:text-5xl">
          Today&apos;s <em className="font-display italic">store pulse</em>
        </h1>
      </header>

      {/* Hero stat strip */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className={
              card.tone === "primary"
                ? "rounded-xl border border-primary/20 bg-primary text-primary-foreground p-5 shadow-sm"
                : "rounded-xl border border-border/70 bg-card p-5 shadow-xs"
            }
          >
            <div className="flex items-center justify-between">
              <p
                className={
                  card.tone === "primary"
                    ? "text-xs font-medium uppercase tracking-wider text-primary-foreground/70"
                    : "text-xs font-medium uppercase tracking-wider text-muted-foreground"
                }
              >
                {card.title}
              </p>
              <card.icon
                className={
                  card.tone === "primary"
                    ? "h-4 w-4 text-primary-foreground/70"
                    : "h-4 w-4 text-muted-foreground"
                }
              />
            </div>
            {loading ? (
              <Skeleton
                className={
                  card.tone === "primary"
                    ? "mt-2 h-9 w-28 bg-primary-foreground/15"
                    : "mt-2 h-9 w-28"
                }
              />
            ) : (
              <p className="mt-2 font-display text-3xl leading-none tracking-tight tabular-nums">
                {card.value}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Order status strip */}
      <section className="space-y-3">
        <SectionLabel>Order pipeline</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-3">
          {orderStatusCards.map((card) => (
            <div
              key={card.title}
              className={`rounded-xl border ${card.border} ${card.bg} p-5`}
            >
              <div className="flex items-center justify-between">
                <p className={`text-xs font-medium uppercase tracking-wider ${card.color}`}>
                  {card.title}
                </p>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
              {loading ? (
                <Skeleton className="mt-2 h-9 w-20" />
              ) : (
                <p className="mt-2 font-display text-3xl leading-none tracking-tight tabular-nums">
                  {card.value}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Revenue + Orders Status */}
      <section className="space-y-3">
        <SectionLabel>Revenue & status</SectionLabel>
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-semibold">
                Revenue · last 30 days
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading || !stats ? (
                <Skeleton className="h-[260px] w-full" />
              ) : (
                <RevenueChart data={stats.revenueByDay} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Orders by status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !stats ? (
                <Skeleton className="h-[260px] w-full" />
              ) : (
                <OrdersStatusChart data={stats.ordersByStatus} />
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Profit Breakdown */}
      <section className="space-y-3">
        <SectionLabel>Profit breakdown</SectionLabel>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Revenue by product · top 5
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !stats ? (
                <Skeleton className="h-[260px] w-full" />
              ) : (
                <ProfitBreakdownChart data={stats.revenueByProduct} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Revenue by category
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !stats ? (
                <Skeleton className="h-[260px] w-full" />
              ) : (
                <RevenueByCategoryChart data={stats.revenueByCategory} />
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Traffic sources (UTM) */}
      <section className="space-y-3">
        <SectionLabel>Traffic sources</SectionLabel>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Orders by UTM source
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !stats ? (
                <Skeleton className="h-[260px] w-full" />
              ) : (
                <UtmBreakdownChart data={stats.utmBreakdown} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Revenue by source
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !stats ? (
                <Skeleton className="h-[200px] w-full" />
              ) : stats.utmBreakdown.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No UTM data yet
                </p>
              ) : (
                <div className="divide-y divide-border/50 text-sm">
                  <div className="grid grid-cols-3 gap-2 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <span>Source</span>
                    <span className="text-right">Orders</span>
                    <span className="text-right">Revenue</span>
                  </div>
                  {stats.utmBreakdown.map((u) => (
                    <div key={u.source} className="grid grid-cols-3 gap-2 py-2">
                      <span className="font-medium">{u.source}</span>
                      <span className="text-right tabular-nums">
                        {u.count}
                      </span>
                      <span className="text-right tabular-nums">
                        ৳{u.revenue.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Courier Information */}
      <section className="space-y-3">
        <SectionLabel>Courier & fulfillment</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2 mb-4">
          {courierCards.map((card) => (
            <div
              key={card.title}
              className={`rounded-xl border ${card.border} ${card.bg} p-5`}
            >
              <div className="flex items-center justify-between">
                <p className={`text-xs font-medium uppercase tracking-wider ${card.color}`}>
                  {card.title}
                </p>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
              {loading ? (
                <Skeleton className="mt-2 h-9 w-20" />
              ) : (
                <p className="mt-2 font-display text-3xl leading-none tracking-tight tabular-nums">
                  {card.value}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  Orders by courier
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !stats ? (
                <Skeleton className="h-[260px] w-full" />
              ) : (
                <CourierProviderChart data={stats.courierByProvider} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Courier status breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !stats ? (
                <Skeleton className="h-[260px] w-full" />
              ) : (
                <CourierStatusChart data={stats.courierByStatus} />
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Top products + Payment methods */}
      <section className="space-y-3">
        <SectionLabel>Demand & payments</SectionLabel>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Top selling products
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !stats ? (
                <Skeleton className="h-[260px] w-full" />
              ) : (
                <TopProductsChart data={stats.topProducts} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Payment methods
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !stats ? (
                <Skeleton className="h-[260px] w-full" />
              ) : (
                <PaymentMethodsChart data={stats.ordersByPaymentMethod} />
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Low stock alerts */}
      {!loading && stats && (stats.lowStockProducts.length > 0 || stats.outOfStockCount > 0) && (
        <section className="space-y-3">
          <SectionLabel>Stock alerts</SectionLabel>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Inventory warnings
                {stats.outOfStockCount > 0 && (
                  <span className="rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 text-xs font-medium">
                    {stats.outOfStockCount} out of stock
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.lowStockProducts.length > 0 ? (
                <div className="divide-y divide-border/50 text-sm">
                  {stats.lowStockProducts.map((p) => (
                    <div key={p.id} className="flex items-center justify-between py-2.5">
                      <span className="font-medium">{p.name}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        p.stock <= 2
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                      }`}>
                        {p.stock} left
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  All products have healthy stock levels.
                </p>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* Orders count + Products by category */}
      <section className="space-y-3">
        <SectionLabel>Volume & catalog</SectionLabel>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Orders · last 30 days
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !stats ? (
                <Skeleton className="h-[260px] w-full" />
              ) : (
                <OrdersCountChart data={stats.ordersByDay} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Products by category
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !stats ? (
                <Skeleton className="h-[260px] w-full" />
              ) : (
                <ProductsCategoryChart data={stats.productsByCategory} />
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-display text-xs italic uppercase tracking-[0.2em] text-muted-foreground">
      {children}
    </p>
  );
}
