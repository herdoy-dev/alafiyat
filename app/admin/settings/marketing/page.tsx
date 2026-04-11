"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Save } from "lucide-react";

type PixelCard = {
  key: keyof MarketingConfig;
  title: string;
  description: string;
  placeholder: string;
  helpText: string;
};

const pixelCards: PixelCard[] = [
  {
    key: "marketing_facebook_pixel_id",
    title: "Facebook Pixel",
    description:
      "Connect Meta (Facebook / Instagram) ad tracking. Tracks PageView, ViewContent, AddToCart, InitiateCheckout, and Purchase events.",
    placeholder: "e.g. 1234567890123456",
    helpText: "Find this in Meta Events Manager → Data sources → your pixel.",
  },
  {
    key: "marketing_facebook_capi_token",
    title: "Facebook Conversions API",
    description:
      "Server-side event tracking that bypasses ad blockers. Sends Purchase, PageView, and ViewContent events directly to Facebook servers for better ad optimization and attribution.",
    placeholder: "e.g. EAAxxxxxxxxx...",
    helpText:
      "Generate a token in Meta Events Manager → Settings → Conversions API → Generate access token. Requires the Pixel ID above to be set.",
  },
  {
    key: "marketing_ga4_measurement_id",
    title: "Google Analytics 4",
    description:
      "Track traffic, user behavior, and conversions with GA4. Supports enhanced e-commerce events.",
    placeholder: "e.g. G-XXXXXXXXXX",
    helpText:
      "Find this in Google Analytics → Admin → Data Streams → your stream.",
  },
  {
    key: "marketing_tiktok_pixel_id",
    title: "TikTok Pixel",
    description:
      "Track TikTok ad conversions with ViewContent, AddToCart, InitiateCheckout, and CompletePayment events.",
    placeholder: "e.g. CXXXXXXXXXXXXXXXXX",
    helpText:
      "Find this in TikTok Ads Manager → Assets → Events → Web Events.",
  },
  {
    key: "marketing_gtm_container_id",
    title: "Google Tag Manager",
    description:
      "Single container for all your tags. If you use GTM, you may manage other pixels through it instead.",
    placeholder: "e.g. GTM-XXXXXXX",
    helpText:
      "Find this in Google Tag Manager → your container → Container ID.",
  },
];

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

  return (
    <div className="space-y-6">
      {pixelCards.map((card) => {
        const isActive = !!marketing[card.key];
        return (
          <Card key={card.key}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle className="font-display text-lg tracking-tight">
                    {card.title}
                  </CardTitle>
                  <CardDescription>{card.description}</CardDescription>
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
            <CardContent>
              {loading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <div className="space-y-2">
                  <Label htmlFor={card.key}>ID</Label>
                  <Input
                    id={card.key}
                    placeholder={card.placeholder}
                    value={marketing[card.key]}
                    onChange={(e) =>
                      setMarketing({
                        ...marketing,
                        [card.key]: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    {card.helpText} Leave blank to disable.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {!loading && (
        <div className="flex justify-end">
          <Button onClick={save} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save all changes"}
          </Button>
        </div>
      )}
    </div>
  );
}
