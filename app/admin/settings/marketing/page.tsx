"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Megaphone } from "lucide-react";
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
  EMPTY_MARKETING,
  type MarketingConfig,
} from "@/lib/settings";

export default function MarketingSettingsPage() {
  const [marketing, setMarketing] =
    useState<MarketingConfig>(EMPTY_MARKETING);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.marketing) setMarketing(data.marketing);
        }
      } catch {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marketing }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to save");
        return;
      }
      if (data.marketing) setMarketing(data.marketing);
      toast.success("Marketing settings saved");
    } finally {
      setSaving(false);
    }
  }

  const isActive = !!marketing.marketing_facebook_pixel_id;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 font-display text-2xl tracking-tight">
              <Megaphone className="h-5 w-5 text-primary" />
              Facebook Pixel
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Connect Meta (Facebook / Instagram) ad tracking. The Pixel
              loads on every storefront page and a PageView event fires
              automatically once a Pixel ID is saved.
            </p>
          </div>
          {!loading && (
            <span
              className={
                isActive
                  ? "shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-primary"
                  : "shrink-0 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
              }
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {loading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <div className="space-y-2">
            <Label htmlFor="fb-pixel-id">Facebook Pixel ID</Label>
            <Input
              id="fb-pixel-id"
              placeholder="e.g. 1234567890123456"
              inputMode="numeric"
              value={marketing.marketing_facebook_pixel_id}
              onChange={(e) =>
                setMarketing({
                  ...marketing,
                  marketing_facebook_pixel_id: e.target.value,
                })
              }
            />
            <p className="text-xs text-muted-foreground">
              Find this in Meta Events Manager → Data sources → your pixel.
              Leave blank to disable tracking entirely.
            </p>
          </div>
        )}
        {!loading && (
          <div className="flex justify-end border-t border-border/60 pt-4">
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
