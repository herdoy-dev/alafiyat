"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Search, Eye } from "lucide-react";
import { DataPagination } from "@/components/admin/data-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

type PurchaseItem = {
  id: string;
  productName: string;
  quantity: number;
  price: number;
};

type Purchase = {
  id: string;
  customerEmail: string | null;
  amount: number;
  paymentMethod: string;
  phoneNumber: string;
  transactionId: string;
  status: string;
  createdAt: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  notes: string | null;
  items: PurchaseItem[];
};

interface PurchasesTableProps {
  purchases: Purchase[];
  loading: boolean;
  onAction: (purchaseId: string, status: "approved" | "rejected") => void;
  processingId: { id: string; action: "approved" | "rejected" } | null;
  filters: { search: string; status: string; method: string };
  onFilterChange: (key: string, value: string) => void;
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "approved"
      ? "success"
      : status === "rejected"
        ? "destructive"
        : "secondary";

  return <Badge variant={variant}>{status}</Badge>;
}

export function PurchasesTable({
  purchases,
  loading,
  onAction,
  processingId,
  filters,
  onFilterChange,
  total,
  page,
  limit,
  onPageChange,
  onLimitChange,
}: PurchasesTableProps) {
  const [localSearch, setLocalSearch] = useState(filters.search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);

  function handleSearchChange(value: string) {
    setLocalSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onFilterChange("search", value);
    }, 400);
  }

  const hasActiveFilters = filters.search || filters.status || filters.method;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-50">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search name, email, phone, transaction ID..."
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={filters.status || "all"}
          onValueChange={(v) => onFilterChange("status", v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-37.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.method || "all"}
          onValueChange={(v) => onFilterChange("method", v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-37.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="bKash">bKash</SelectItem>
            <SelectItem value="Rocket">Rocket</SelectItem>
            <SelectItem value="Nagad">Nagad</SelectItem>
            <SelectItem value="Upay">Upay</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: limit }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : purchases.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          {hasActiveFilters
            ? "No matching orders found."
            : "No orders yet."}
        </p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Shipping</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Txn ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{purchase.shippingName}</p>
                      {purchase.customerEmail && (
                        <p className="text-xs text-muted-foreground">
                          {purchase.customerEmail}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5 text-sm">
                      {purchase.items.map((item) => (
                        <div key={item.id}>
                          {item.productName}
                          <span className="text-muted-foreground">
                            {" "}
                            × {item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-44 text-xs text-muted-foreground">
                    <div>{purchase.shippingPhone}</div>
                    <div>
                      {purchase.shippingAddress}, {purchase.shippingCity}
                    </div>
                  </TableCell>
                  <TableCell>৳{purchase.amount.toLocaleString()}</TableCell>
                  <TableCell className="capitalize">
                    {purchase.paymentMethod}
                    <div className="font-mono text-xs text-muted-foreground">
                      {purchase.phoneNumber}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {purchase.transactionId}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={purchase.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(purchase.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        title="View details"
                        asChild
                      >
                        <Link href={`/admin/purchases/${purchase.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      {purchase.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            loading={
                              processingId?.id === purchase.id &&
                              processingId.action === "approved"
                            }
                            disabled={processingId?.id === purchase.id}
                            onClick={() => onAction(purchase.id, "approved")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            loading={
                              processingId?.id === purchase.id &&
                              processingId.action === "rejected"
                            }
                            disabled={processingId?.id === purchase.id}
                            onClick={() => onAction(purchase.id, "rejected")}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {!loading && purchases.length > 0 && (
        <DataPagination
          page={page}
          limit={limit}
          total={total}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      )}
    </div>
  );
}
