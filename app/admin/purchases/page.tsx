"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PurchasesTable } from "@/components/admin/purchases-table";

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

function PurchasesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const filters = {
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "",
    method: searchParams.get("method") || "",
  };
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 8;

  const fetchPurchases = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      searchParams.forEach((value, key) => {
        if (value) params.set(key, value);
      });
      if (!params.has("page")) params.set("page", "1");
      if (!params.has("limit")) params.set("limit", "8");
      const qs = params.toString();
      const res = await fetch(`/api/admin/purchases?${qs}`);
      if (res.ok) {
        const data = await res.json();
        setPurchases(data.purchases);
        setTotal(data.total);
      }
    } catch {
      toast.error("Failed to load purchases");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    const qs = params.toString();
    router.push(`/admin/purchases${qs ? `?${qs}` : ""}`);
  }

  function handleFilterChange(key: string, value: string) {
    updateParams({ [key]: value, page: "1" });
  }

  function handlePageChange(newPage: number) {
    updateParams({ page: String(newPage) });
  }

  function handleLimitChange(newLimit: number) {
    updateParams({ limit: String(newLimit), page: "1" });
  }

  async function handleAction(
    purchaseId: string,
    status: "approved" | "rejected"
  ) {
    setProcessingId({ id: purchaseId, action: status });
    try {
      const res = await fetch("/api/admin/purchases", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchaseId, status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setPurchases((prev) =>
        prev.map((p) => (p.id === purchaseId ? data.purchase : p))
      );
      toast.success(
        `Purchase ${status === "approved" ? "approved" : "rejected"}`
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setProcessingId(null);
    }
  }

  const [processingId, setProcessingId] = useState<{ id: string; action: "approved" | "rejected" } | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          Manage customer orders and approvals
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <PurchasesTable
            purchases={purchases}
            loading={loading}
            onAction={handleAction}
            processingId={processingId}
            filters={filters}
            onFilterChange={handleFilterChange}
            total={total}
            page={page}
            limit={limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function PurchasesPage() {
  return (
    <Suspense>
      <PurchasesContent />
    </Suspense>
  );
}
