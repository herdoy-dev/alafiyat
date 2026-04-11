"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

type OrderDetail = {
  id: string;
  amount: number;
  status: string;
  paymentMethod: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  courierProvider: string | null;
  courierTrackingCode: string | null;
  courierStatus: string | null;
  discountCode: string | null;
  discountAmount: number;
  createdAt: string;
  items: {
    productName: string;
    price: number;
    quantity: number;
  }[];
};

const STATUS_CONFIG: Record<string, { icon: typeof CheckCircle; color: string }> = {
  pending: { icon: Clock, color: "text-yellow-600" },
  approved: { icon: CheckCircle, color: "text-green-600" },
  rejected: { icon: XCircle, color: "text-red-600" },
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch(`/api/customer/orders/${id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order);
        } else {
          toast.error("Order not found");
        }
      } catch {
        toast.error("Failed to load order");
      } finally {
        setLoading(false);
      }
    }
    fetch_();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16">
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16 text-center">
        <Package className="mx-auto h-10 w-10 text-muted-foreground/60" />
        <p className="mt-4 font-display text-xl">Order not found</p>
      </div>
    );
  }

  const statusConf = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusConf.icon;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 md:py-16">
      <Link
        href="/account/orders"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All Orders
      </Link>

      <header className="mb-8">
        <p className="font-mono text-sm text-muted-foreground">
          #{order.id.slice(-8).toUpperCase()}
        </p>
        <h1 className="mt-1 font-display text-3xl tracking-tight">
          Order <em className="font-display italic">details</em>
        </h1>
      </header>

      {/* Status */}
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-xs mb-4">
        <div className="flex items-center gap-3">
          <StatusIcon className={`h-5 w-5 ${statusConf.color}`} />
          <div>
            <p className="font-display text-base tracking-tight capitalize">
              {order.status}
            </p>
            <p className="text-xs text-muted-foreground">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Courier tracking */}
      {order.courierProvider && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 dark:border-blue-800/50 dark:bg-blue-950/30 p-5 mb-4">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="font-display text-base tracking-tight">
                {order.courierProvider}
                {order.courierStatus && (
                  <span className="ml-2 text-sm text-blue-600 dark:text-blue-400">
                    · {order.courierStatus}
                  </span>
                )}
              </p>
              {order.courierTrackingCode && (
                <p className="mt-0.5 font-mono text-sm text-blue-700 dark:text-blue-300">
                  Tracking: {order.courierTrackingCode}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-xs mb-4">
        <p className="font-display text-xs italic uppercase tracking-[0.18em] text-muted-foreground mb-3">
          Items
        </p>
        <div className="divide-y divide-border/50">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between py-2.5 text-sm">
              <span>
                {item.productName}{" "}
                <span className="text-muted-foreground">×{item.quantity}</span>
              </span>
              <span className="tabular-nums">
                ৳{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        {order.discountAmount > 0 && (
          <div className="flex justify-between border-t border-border/50 pt-2.5 text-sm text-green-600 dark:text-green-400">
            <span>Discount ({order.discountCode})</span>
            <span>−৳{order.discountAmount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-border/50 pt-2.5 mt-2">
          <span className="font-display text-sm italic">Total</span>
          <span className="font-display text-xl tabular-nums">
            ৳{order.amount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Shipping + Payment */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-xs">
          <p className="font-display text-xs italic uppercase tracking-[0.18em] text-muted-foreground mb-2">
            Shipping
          </p>
          <p className="text-sm font-medium">{order.shippingName}</p>
          <p className="text-sm text-muted-foreground">{order.shippingPhone}</p>
          <p className="text-sm text-muted-foreground">
            {order.shippingAddress}, {order.shippingCity}
          </p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-xs">
          <p className="font-display text-xs italic uppercase tracking-[0.18em] text-muted-foreground mb-2">
            Payment
          </p>
          <p className="text-sm font-medium">{order.paymentMethod}</p>
        </div>
      </div>
    </div>
  );
}
