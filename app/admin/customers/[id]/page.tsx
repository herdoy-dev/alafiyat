import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  TrendingUp,
  Eye,
  ShieldAlert,
  Truck,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  computeCustomerRisk,
  courierStatusVariant,
  formatCourierStatus,
  riskVariant,
} from "@/lib/customer-risk";

function statusVariant(status: string) {
  if (status === "approved") return "success" as const;
  if (status === "rejected") return "destructive" as const;
  return "secondary" as const;
}

export default async function CustomerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      purchases: {
        orderBy: { createdAt: "desc" },
        include: { items: true },
      },
    },
  });
  if (!customer) notFound();

  const totalSpent = customer.purchases
    .filter((p) => p.status === "approved")
    .reduce((sum, p) => sum + p.amount, 0);
  const approvedCount = customer.purchases.filter(
    (p) => p.status === "approved"
  ).length;

  const risk = computeCustomerRisk(customer.purchases);
  const { shippedCount, deliveredCount, failedCount } = risk;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/customers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {customer.fullName}
          </h1>
          <p className="text-sm text-muted-foreground">
            Customer since{" "}
            {new Date(customer.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Orders"
          value={customer.purchases.length.toString()}
          icon={ShoppingBag}
        />
        <StatCard
          label="Approved Orders"
          value={approvedCount.toString()}
          icon={ShoppingBag}
        />
        <StatCard
          label="Total Spent"
          value={`৳${totalSpent.toLocaleString()}`}
          icon={TrendingUp}
        />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Customer Risk
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-1">
            <Badge variant={riskVariant(risk.level)}>{risk.label}</Badge>
            <p className="text-xs text-muted-foreground">{risk.description}</p>
            {shippedCount > 0 && (
              <p className="text-xs text-muted-foreground">
                {deliveredCount} delivered · {failedCount} failed ·{" "}
                {shippedCount - deliveredCount - failedCount} in transit
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-base">Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row icon={Phone} label="Phone" value={customer.phone} />
            {customer.email && (
              <Row icon={Mail} label="Email" value={customer.email} />
            )}
            <Row
              icon={MapPin}
              label="Address"
              value={`${customer.address}, ${customer.city}`}
            />
            <Row
              icon={CalendarDays}
              label="Last update"
              value={new Date(customer.updatedAt).toLocaleDateString()}
            />
          </CardContent>
        </Card>

        {/* Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Order History ({customer.purchases.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {customer.purchases.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No orders yet.
              </p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Courier</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customer.purchases.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-mono text-xs">
                          #{p.id.slice(-6).toUpperCase()}
                        </TableCell>
                        <TableCell className="text-sm">
                          {p.items.length}{" "}
                          {p.items.length === 1 ? "item" : "items"}
                        </TableCell>
                        <TableCell>৳{p.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariant(p.status)}>
                            {p.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {p.courierProvider ? (
                            <div className="flex flex-col items-start gap-1">
                              <Badge
                                variant="outline"
                                className="capitalize"
                              >
                                <Truck className="h-3 w-3" />
                                {p.courierProvider}
                              </Badge>
                              {p.courierStatus && (
                                <Badge
                                  variant={courierStatusVariant(
                                    p.courierStatus
                                  )}
                                >
                                  {formatCourierStatus(p.courierStatus)}
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              —
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            asChild
                          >
                            <Link href={`/admin/purchases/${p.id}`}>
                              <Eye className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="break-words font-medium">{value}</p>
      </div>
    </div>
  );
}
