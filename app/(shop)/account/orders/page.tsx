"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomerAuth } from "@/components/providers/customer-auth-provider";
import { ArrowLeft, Package, ChevronRight } from "lucide-react";

type Order = {
  id: string;
  amount: number;
  status: string;
  courierStatus: string | null;
  paymentMethod: string;
  createdAt: string;
  items: { productName: string; quantity: number }[];
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function OrdersPage() {
  const { customer } = useCustomerAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customer) return;
    async function fetchOrders() {
      try {
        const res = await fetch("/api/customer/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders);
        }
      } catch {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [customer]);

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 md:py-16">
      <Link
        href="/account"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        My Account
      </Link>

      <header className="mb-8">
        <p className="font-display text-sm italic text-muted-foreground">
          Purchase history
        </p>
        <h1 className="mt-1 font-display text-4xl tracking-tight">
          My <em className="font-display italic">orders</em>
        </h1>
      </header>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 py-16 text-center">
          <Package className="mx-auto h-10 w-10 text-muted-foreground/60" />
          <p className="mt-4 font-display text-xl italic text-muted-foreground">
            No orders yet
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-xs transition-colors hover:border-primary/30"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-muted-foreground">
                    #{order.id.slice(-8).toUpperCase()}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${STATUS_COLORS[order.status] || "bg-muted"}`}
                  >
                    {order.status}
                  </span>
                  {order.courierStatus && (
                    <span className="rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 text-[10px] font-medium">
                      {order.courierStatus}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm truncate">
                  {order.items.map((i) => `${i.productName} ×${i.quantity}`).join(", ")}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display text-lg tabular-nums">
                  ৳{order.amount.toLocaleString()}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
