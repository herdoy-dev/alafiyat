"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Status = "approved" | "rejected" | "pending";

export function OrderActions({ purchaseId }: { purchaseId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState<Status | null>(null);

  async function handle(status: Status) {
    setPending(status);
    try {
      const res = await fetch("/api/admin/purchases", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchaseId, status }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to update");
        return;
      }
      toast.success(
        status === "approved"
          ? "Order approved"
          : status === "rejected"
            ? "Order rejected"
            : "Order reopened"
      );
      router.refresh();
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="success"
        loading={pending === "approved"}
        disabled={pending !== null}
        onClick={() => handle("approved")}
      >
        Approve order
      </Button>
      <Button
        variant="destructive"
        loading={pending === "rejected"}
        disabled={pending !== null}
        onClick={() => handle("rejected")}
      >
        Reject order
      </Button>
    </div>
  );
}

