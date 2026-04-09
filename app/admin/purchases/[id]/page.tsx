import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  Hash,
  Mail,
  MapPin,
  Phone,
  StickyNote,
  Truck,
  User,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OrderActions } from "./order-actions";
import { CourierActions, CourierRefreshButton } from "./courier-actions";

function formatCourierStatus(status: string) {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function courierStatusVariant(status: string) {
  const s = status.toLowerCase();
  if (s.includes("delivered") && !s.includes("pending"))
    return "success" as const;
  if (s.includes("cancel") || s.includes("returned") || s.includes("hold"))
    return "destructive" as const;
  if (
    s.includes("in_review") ||
    s.includes("pending") ||
    s.includes("pickup") ||
    s.includes("transit") ||
    s.includes("shipping") ||
    s.includes("on_delivery")
  )
    return "secondary" as const;
  return "outline" as const;
}

function statusVariant(status: string) {
  if (status === "approved") return "success" as const;
  if (status === "rejected") return "destructive" as const;
  return "secondary" as const;
}

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const purchase = await prisma.purchase.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!purchase) notFound();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/purchases">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                Order #{purchase.id.slice(-8).toUpperCase()}
              </h1>
              <Badge variant={statusVariant(purchase.status)}>
                {purchase.status}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Placed{" "}
              {new Date(purchase.createdAt).toLocaleString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        {purchase.status === "pending" && (
          <OrderActions purchaseId={purchase.id} />
        )}
        {purchase.status === "approved" && !purchase.courierProvider && (
          <CourierActions purchaseId={purchase.id} />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items + Summary */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Items ({purchase.items.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {purchase.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        ৳{item.price.toLocaleString()} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">
                  ৳{purchase.amount.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {purchase.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <StickyNote className="h-4 w-4" />
                  Order Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-sm text-muted-foreground">
                  {purchase.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Customer + Shipping + Payment */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row icon={User} label="Name" value={purchase.shippingName} />
              <Row icon={Phone} label="Phone" value={purchase.shippingPhone} />
              {purchase.customerEmail && (
                <Row
                  icon={Mail}
                  label="Email"
                  value={purchase.customerEmail}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Shipping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row
                icon={MapPin}
                label="Address"
                value={`${purchase.shippingAddress}, ${purchase.shippingCity}`}
              />
            </CardContent>
          </Card>

          {purchase.courierProvider && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Truck className="h-4 w-4" />
                    Courier
                  </CardTitle>
                  <CourierRefreshButton purchaseId={purchase.id} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <Row
                  icon={Truck}
                  label="Provider"
                  value={
                    purchase.courierProvider === "pathao"
                      ? "Pathao"
                      : "Steadfast"
                  }
                />
                {purchase.courierStatus && (
                  <div className="flex items-start gap-2">
                    <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">Status</p>
                      <Badge
                        variant={courierStatusVariant(purchase.courierStatus)}
                      >
                        {formatCourierStatus(purchase.courierStatus)}
                      </Badge>
                    </div>
                  </div>
                )}
                {purchase.courierConsignmentId && (
                  <Row
                    icon={Hash}
                    label="Consignment ID"
                    value={purchase.courierConsignmentId}
                    mono
                  />
                )}
                {purchase.courierTrackingCode && (
                  <Row
                    icon={Hash}
                    label="Tracking code"
                    value={purchase.courierTrackingCode}
                    mono
                  />
                )}
                {purchase.courierSentAt && (
                  <Row
                    icon={CalendarDays}
                    label="Sent at"
                    value={new Date(purchase.courierSentAt).toLocaleString()}
                  />
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row
                icon={CreditCard}
                label="Method"
                value={purchase.paymentMethod}
              />
              {purchase.paymentMethod !== "Cash on Delivery" && (
                <>
                  <Row
                    icon={Phone}
                    label="Payer phone"
                    value={purchase.phoneNumber}
                    mono
                  />
                  <Row
                    icon={Hash}
                    label="Transaction ID"
                    value={purchase.transactionId}
                    mono
                  />
                </>
              )}
              <Row
                icon={CalendarDays}
                label="Updated"
                value={new Date(purchase.updatedAt).toLocaleString()}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p
          className={
            mono
              ? "break-all font-mono text-xs"
              : "break-words font-medium"
          }
        >
          {value}
        </p>
      </div>
    </div>
  );
}
