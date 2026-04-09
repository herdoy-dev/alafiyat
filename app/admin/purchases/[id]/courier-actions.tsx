"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, ChevronDown, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Provider = "pathao" | "steadfast";

export function CourierActions({ purchaseId }: { purchaseId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState<Provider | null>(null);

  async function send(provider: Provider) {
    setPending(provider);
    try {
      const res = await fetch(
        `/api/admin/purchases/${purchaseId}/courier`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to send to courier");
        return;
      }
      toast.success(
        `Sent to ${provider === "pathao" ? "Pathao" : "Steadfast"}`
      );
      router.refresh();
    } catch {
      toast.error("Failed to send to courier");
    } finally {
      setPending(null);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" loading={pending !== null}>
          <Truck className="h-4 w-4" />
          Send to Courier
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Choose courier</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={pending !== null}
          onClick={() => send("pathao")}
        >
          Pathao
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={pending !== null}
          onClick={() => send("steadfast")}
        >
          Steadfast
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CourierRefreshButton({
  purchaseId,
}: {
  purchaseId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/purchases/${purchaseId}/courier`,
        { method: "GET" }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to refresh status");
        return;
      }
      toast.success(`Status: ${data.purchase.courierStatus}`);
      router.refresh();
    } catch {
      toast.error("Failed to refresh status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      loading={loading}
      onClick={refresh}
    >
      <RefreshCw className="h-3.5 w-3.5" />
      Refresh status
    </Button>
  );
}
