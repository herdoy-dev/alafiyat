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
} from "lucide-react";
import { RevenueChart } from "@/components/admin/charts/revenue-chart";
import { OrdersStatusChart } from "@/components/admin/charts/orders-status-chart";
import { TopProductsChart } from "@/components/admin/charts/top-products-chart";
import { PaymentMethodsChart } from "@/components/admin/charts/payment-methods-chart";
import { OrdersCountChart } from "@/components/admin/charts/orders-count-chart";
import { ProductsCategoryChart } from "@/components/admin/charts/products-category-chart";

type Stats = {
  summary: {
    totalRevenue: number;
    totalUsers: number;
    totalProducts: number;
    pendingPurchases: number;
    approvedPurchases: number;
  };
  revenueByDay: { date: string; revenue: number }[];
  ordersByDay: { date: string; count: number }[];
  ordersByStatus: { status: string; count: number }[];
  topProducts: { name: string; quantity: number }[];
  ordersByPaymentMethod: { method: string; count: number }[];
  productsByCategory: { category: string; count: number }[];
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
    {
      title: "Pending",
      value: stats ? stats.summary.pendingPurchases.toLocaleString() : "",
      icon: Clock,
      tone: "muted" as const,
    },
    {
      title: "Approved",
      value: stats ? stats.summary.approvedPurchases.toLocaleString() : "",
      icon: CheckCircle,
      tone: "muted" as const,
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
              <p
                className={
                  card.tone === "primary"
                    ? "mt-2 font-display text-3xl leading-none tracking-tight tabular-nums"
                    : "mt-2 font-display text-3xl leading-none tracking-tight tabular-nums"
                }
              >
                {card.value}
              </p>
            )}
          </div>
        ))}
      </div>

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
