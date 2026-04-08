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
import { DollarSign, Users, Clock, CheckCircle, Package } from "lucide-react";
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
      title: "Total Revenue",
      value: stats ? `৳${stats.summary.totalRevenue.toLocaleString()}` : "",
      icon: DollarSign,
    },
    {
      title: "Total Users",
      value: stats ? stats.summary.totalUsers.toLocaleString() : "",
      icon: Users,
    },
    {
      title: "Products",
      value: stats ? stats.summary.totalProducts.toLocaleString() : "",
      icon: Package,
    },
    {
      title: "Pending Orders",
      value: stats ? stats.summary.pendingPurchases.toLocaleString() : "",
      icon: Clock,
    },
    {
      title: "Approved Orders",
      value: stats ? stats.summary.approvedPurchases.toLocaleString() : "",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {summaryCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-7 w-24" />
              ) : (
                <p className="text-2xl font-bold">{card.value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Row: Revenue + Orders Status */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue (last 30 days)</CardTitle>
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
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
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

      {/* Row: Top products + Payment methods */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
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
          <CardHeader>
            <CardTitle>Orders by Payment Method</CardTitle>
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

      {/* Row: Orders count + Products by category */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Orders (last 30 days)</CardTitle>
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
          <CardHeader>
            <CardTitle>Products by Category</CardTitle>
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
    </div>
  );
}
