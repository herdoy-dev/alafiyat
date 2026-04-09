"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  EMPTY_COURIER_CONFIG,
  type CourierConfig,
} from "@/lib/settings";

export default function CouriersSettingsPage() {
  const [courier, setCourier] =
    useState<CourierConfig>(EMPTY_COURIER_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<"steadfast" | "pathao" | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.courier) setCourier(data.courier);
        }
      } catch {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function patchCourier(
    section: "steadfast" | "pathao",
    keys: (keyof CourierConfig)[],
    successMessage: string
  ) {
    setSaving(section);
    try {
      const courierPayload: Partial<CourierConfig> = {};
      for (const key of keys) {
        courierPayload[key] = courier[key];
      }
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courier: courierPayload }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to save");
        return;
      }
      if (data.courier) setCourier(data.courier);
      toast.success(successMessage);
    } finally {
      setSaving(null);
    }
  }

  const steadfastConfigured =
    !!courier.courier_steadfast_api_key &&
    !!courier.courier_steadfast_api_secret;
  const pathaoConfigured =
    !!courier.courier_pathao_client_id &&
    !!courier.courier_pathao_client_secret &&
    !!courier.courier_pathao_store_id &&
    !!courier.courier_pathao_city_id &&
    !!courier.courier_pathao_zone_id;

  return (
    <div className="space-y-6">
      {/* Steadfast */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 font-display text-2xl tracking-tight">
                <Truck className="h-5 w-5 text-primary" />
                Steadfast
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Optional. Configure to enable &quot;Send to Courier →
                Steadfast&quot; on orders.
              </p>
            </div>
            {!loading && (
              <StatusPill active={steadfastConfigured} />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {loading ? (
            <SkeletonRows count={3} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="sf-base-url">Base URL</Label>
                <Input
                  id="sf-base-url"
                  placeholder="https://portal.packzy.com/api/v1"
                  value={courier.courier_steadfast_base_url}
                  onChange={(e) =>
                    setCourier({
                      ...courier,
                      courier_steadfast_base_url: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sf-api-key">API key</Label>
                <Input
                  id="sf-api-key"
                  type="password"
                  autoComplete="off"
                  value={courier.courier_steadfast_api_key}
                  onChange={(e) =>
                    setCourier({
                      ...courier,
                      courier_steadfast_api_key: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sf-api-secret">API secret</Label>
                <Input
                  id="sf-api-secret"
                  type="password"
                  autoComplete="off"
                  value={courier.courier_steadfast_api_secret}
                  onChange={(e) =>
                    setCourier({
                      ...courier,
                      courier_steadfast_api_secret: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}
          {!loading && (
            <div className="flex justify-end border-t border-border/60 pt-4">
              <Button
                onClick={() =>
                  patchCourier(
                    "steadfast",
                    [
                      "courier_steadfast_base_url",
                      "courier_steadfast_api_key",
                      "courier_steadfast_api_secret",
                    ],
                    "Steadfast settings saved"
                  )
                }
                disabled={saving !== null}
              >
                {saving === "steadfast" ? "Saving..." : "Save Steadfast"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pathao */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 font-display text-2xl tracking-tight">
                <Truck className="h-5 w-5 text-primary" />
                Pathao
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Optional. Configure to enable &quot;Send to Courier →
                Pathao&quot; on orders.
              </p>
            </div>
            {!loading && <StatusPill active={pathaoConfigured} />}
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {loading ? (
            <SkeletonRows count={6} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="px-base-url">Base URL</Label>
                <Input
                  id="px-base-url"
                  placeholder="https://api-hermes.pathao.com"
                  value={courier.courier_pathao_base_url}
                  onChange={(e) =>
                    setCourier({
                      ...courier,
                      courier_pathao_base_url: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="px-client-id">Client ID</Label>
                <Input
                  id="px-client-id"
                  autoComplete="off"
                  value={courier.courier_pathao_client_id}
                  onChange={(e) =>
                    setCourier({
                      ...courier,
                      courier_pathao_client_id: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="px-client-secret">Client secret</Label>
                <Input
                  id="px-client-secret"
                  type="password"
                  autoComplete="off"
                  value={courier.courier_pathao_client_secret}
                  onChange={(e) =>
                    setCourier({
                      ...courier,
                      courier_pathao_client_secret: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="px-username">Username</Label>
                <Input
                  id="px-username"
                  autoComplete="off"
                  value={courier.courier_pathao_username}
                  onChange={(e) =>
                    setCourier({
                      ...courier,
                      courier_pathao_username: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="px-password">Password</Label>
                <Input
                  id="px-password"
                  type="password"
                  autoComplete="off"
                  value={courier.courier_pathao_password}
                  onChange={(e) =>
                    setCourier({
                      ...courier,
                      courier_pathao_password: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="px-store">Store ID</Label>
                <Input
                  id="px-store"
                  value={courier.courier_pathao_store_id}
                  onChange={(e) =>
                    setCourier({
                      ...courier,
                      courier_pathao_store_id: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="px-city">City ID</Label>
                <Input
                  id="px-city"
                  value={courier.courier_pathao_city_id}
                  onChange={(e) =>
                    setCourier({
                      ...courier,
                      courier_pathao_city_id: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="px-zone">Zone ID</Label>
                <Input
                  id="px-zone"
                  value={courier.courier_pathao_zone_id}
                  onChange={(e) =>
                    setCourier({
                      ...courier,
                      courier_pathao_zone_id: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="px-area">Area ID (optional)</Label>
                <Input
                  id="px-area"
                  value={courier.courier_pathao_area_id}
                  onChange={(e) =>
                    setCourier({
                      ...courier,
                      courier_pathao_area_id: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}
          {!loading && (
            <div className="flex justify-end border-t border-border/60 pt-4">
              <Button
                onClick={() =>
                  patchCourier(
                    "pathao",
                    [
                      "courier_pathao_base_url",
                      "courier_pathao_client_id",
                      "courier_pathao_client_secret",
                      "courier_pathao_username",
                      "courier_pathao_password",
                      "courier_pathao_store_id",
                      "courier_pathao_city_id",
                      "courier_pathao_zone_id",
                      "courier_pathao_area_id",
                    ],
                    "Pathao settings saved"
                  )
                }
                disabled={saving !== null}
              >
                {saving === "pathao" ? "Saving..." : "Save Pathao"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatusPill({ active }: { active: boolean }) {
  return (
    <span
      className={
        active
          ? "shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-primary"
          : "shrink-0 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
      }
    >
      {active ? "Configured" : "Not configured"}
    </span>
  );
}

function SkeletonRows({ count }: { count: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}
