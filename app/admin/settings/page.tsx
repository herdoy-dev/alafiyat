"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Music2,
  MessageCircle,
  ArrowUp,
  ArrowDown,
  X,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  EMPTY_SOCIAL,
  EMPTY_COURIER_CONFIG,
  EMPTY_MARKETING,
  HERO_MAX,
  SOCIAL_KEYS,
  SOCIAL_LABELS,
  type SocialKey,
  type SocialLinks,
  type CourierConfig,
  type MarketingConfig,
} from "@/lib/settings";

const ICONS: Record<SocialKey, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
  tiktok: Music2,
  whatsapp: MessageCircle,
};

const PLACEHOLDERS: Record<SocialKey, string> = {
  facebook: "https://facebook.com/yourpage",
  instagram: "https://instagram.com/yourhandle",
  twitter: "https://twitter.com/yourhandle",
  youtube: "https://youtube.com/@yourchannel",
  linkedin: "https://linkedin.com/company/yourcompany",
  tiktok: "https://tiktok.com/@yourhandle",
  whatsapp: "https://wa.me/8801XXXXXXXXX",
};

type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  thumbnail: string;
  price: number;
};

export default function AdminSettingsPage() {
  const [social, setSocial] = useState<SocialLinks>(EMPTY_SOCIAL);
  const [heroIds, setHeroIds] = useState<string[]>([]);
  const [courier, setCourier] =
    useState<CourierConfig>(EMPTY_COURIER_CONFIG);
  const [marketing, setMarketing] =
    useState<MarketingConfig>(EMPTY_MARKETING);
  const [allProducts, setAllProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSection, setSavingSection] = useState<
    "marketing" | "steadfast" | "pathao" | null
  >(null);

  useEffect(() => {
    async function load() {
      try {
        const [settingsRes, productsRes] = await Promise.all([
          fetch("/api/admin/settings"),
          fetch("/api/admin/products?limit=50"),
        ]);
        if (settingsRes.ok) {
          const data = await settingsRes.json();
          setSocial(data.social);
          setHeroIds(data.heroProductIds ?? []);
          if (data.courier) setCourier(data.courier);
          if (data.marketing) setMarketing(data.marketing);
        }
        if (productsRes.ok) {
          const data = await productsRes.json();
          setAllProducts(data.products);
        }
      } catch {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          social,
          heroProductIds: heroIds,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to save");
        return;
      }
      setSocial(data.social);
      setHeroIds(data.heroProductIds ?? []);
      toast.success("Settings saved");
    } finally {
      setSaving(false);
    }
  }

  async function patchSettings(
    body: Record<string, unknown>,
    successMessage: string
  ) {
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Failed to save");
      return null;
    }
    toast.success(successMessage);
    return data;
  }

  async function saveMarketing() {
    setSavingSection("marketing");
    try {
      const data = await patchSettings(
        { marketing },
        "Marketing settings saved"
      );
      if (data?.marketing) setMarketing(data.marketing);
    } finally {
      setSavingSection(null);
    }
  }

  async function saveSteadfast() {
    setSavingSection("steadfast");
    try {
      const data = await patchSettings(
        {
          courier: {
            courier_steadfast_base_url: courier.courier_steadfast_base_url,
            courier_steadfast_api_key: courier.courier_steadfast_api_key,
            courier_steadfast_api_secret:
              courier.courier_steadfast_api_secret,
          },
        },
        "Steadfast settings saved"
      );
      if (data?.courier) setCourier(data.courier);
    } finally {
      setSavingSection(null);
    }
  }

  async function savePathao() {
    setSavingSection("pathao");
    try {
      const data = await patchSettings(
        {
          courier: {
            courier_pathao_base_url: courier.courier_pathao_base_url,
            courier_pathao_client_id: courier.courier_pathao_client_id,
            courier_pathao_client_secret:
              courier.courier_pathao_client_secret,
            courier_pathao_username: courier.courier_pathao_username,
            courier_pathao_password: courier.courier_pathao_password,
            courier_pathao_store_id: courier.courier_pathao_store_id,
            courier_pathao_city_id: courier.courier_pathao_city_id,
            courier_pathao_zone_id: courier.courier_pathao_zone_id,
            courier_pathao_area_id: courier.courier_pathao_area_id,
          },
        },
        "Pathao settings saved"
      );
      if (data?.courier) setCourier(data.courier);
    } finally {
      setSavingSection(null);
    }
  }

  function addHero(id: string) {
    if (heroIds.includes(id)) return;
    if (heroIds.length >= HERO_MAX) {
      toast.error(`Maximum ${HERO_MAX} hero products`);
      return;
    }
    setHeroIds([...heroIds, id]);
  }

  function removeHero(id: string) {
    setHeroIds(heroIds.filter((x) => x !== id));
  }

  function moveHero(index: number, direction: -1 | 1) {
    const next = [...heroIds];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setHeroIds(next);
  }

  const productMap = new Map(allProducts.map((p) => [p.id, p]));
  const selectedProducts = heroIds
    .map((id) => productMap.get(id))
    .filter((p): p is AdminProduct => p !== undefined);
  const availableProducts = allProducts.filter(
    (p) => !heroIds.includes(p.id)
  );

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Site-wide settings shown across the storefront
          </p>
        </div>
        <Button type="submit" disabled={saving || loading}>
          {saving ? "Saving..." : "Save hero & social"}
        </Button>
      </div>

      {/* Hero products */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Slider Products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Pick up to {HERO_MAX} products to feature in the home page hero
            slider. Order matters — drag-free reorder with the arrows. Leave
            empty to fall back to the latest 6 products automatically.
          </p>

          {loading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Selected */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">
                  Selected ({selectedProducts.length}/{HERO_MAX})
                </h3>
                {selectedProducts.length === 0 ? (
                  <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                    No products selected.
                  </div>
                ) : (
                  <ol className="space-y-2">
                    {selectedProducts.map((p, i) => (
                      <li
                        key={p.id}
                        className="flex items-center gap-3 rounded-md border bg-muted/30 p-2"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                          {i + 1}
                        </span>
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-muted">
                          {p.thumbnail && (
                            <Image
                              src={p.thumbnail}
                              alt={p.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {p.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ৳{p.price}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            disabled={i === 0}
                            onClick={() => moveHero(i, -1)}
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            disabled={i === selectedProducts.length - 1}
                            onClick={() => moveHero(i, 1)}
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            onClick={() => removeHero(p.id)}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              {/* Available */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Available products</h3>
                {availableProducts.length === 0 ? (
                  <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                    No more products to add.
                  </div>
                ) : (
                  <div className="max-h-80 space-y-2 overflow-y-auto rounded-md border p-2">
                    {availableProducts.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-3 rounded-md p-2 hover:bg-muted/50"
                      >
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-muted">
                          {p.thumbnail && (
                            <Image
                              src={p.thumbnail}
                              alt={p.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {p.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ৳{p.price}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0"
                          disabled={heroIds.length >= HERO_MAX}
                          onClick={() => addHero(p.id)}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Marketing */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Marketing</CardTitle>
            {!loading && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  marketing.marketing_facebook_pixel_id
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {marketing.marketing_facebook_pixel_id
                  ? "Pixel active"
                  : "Pixel inactive"}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Connect Meta (Facebook / Instagram) ad tracking. Once a Pixel ID
            is saved, the Facebook Pixel script loads on every storefront
            page and a PageView event fires automatically.
          </p>
          {loading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <div className="space-y-1">
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
                Find this in Meta Events Manager → Data sources → your
                pixel. Leave blank to disable tracking.
              </p>
            </div>
          )}
          {!loading && (
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={saveMarketing}
                disabled={savingSection !== null}
              >
                {savingSection === "marketing"
                  ? "Saving..."
                  : "Save marketing"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Steadfast */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Steadfast Courier</CardTitle>
            {!loading && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  courier.courier_steadfast_api_key &&
                  courier.courier_steadfast_api_secret
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {courier.courier_steadfast_api_key &&
                courier.courier_steadfast_api_secret
                  ? "Configured"
                  : "Not configured"}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Optional. Fill these in to enable &quot;Send to Courier →
            Steadfast&quot; on orders. Leave blank if you only use Pathao.
          </p>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1 sm:col-span-2">
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
              <div className="space-y-1">
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
              <div className="space-y-1">
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
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={saveSteadfast}
                disabled={savingSection !== null}
              >
                {savingSection === "steadfast"
                  ? "Saving..."
                  : "Save Steadfast"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pathao */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pathao Courier</CardTitle>
            {!loading && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  courier.courier_pathao_client_id &&
                  courier.courier_pathao_client_secret &&
                  courier.courier_pathao_store_id &&
                  courier.courier_pathao_city_id &&
                  courier.courier_pathao_zone_id
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {courier.courier_pathao_client_id &&
                courier.courier_pathao_client_secret &&
                courier.courier_pathao_store_id &&
                courier.courier_pathao_city_id &&
                courier.courier_pathao_zone_id
                  ? "Configured"
                  : "Not configured"}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Optional. Fill these in to enable &quot;Send to Courier →
            Pathao&quot; on orders. Leave blank if you only use Steadfast.
          </p>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1 sm:col-span-2">
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
              <div className="space-y-1">
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
              <div className="space-y-1">
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
              <div className="space-y-1">
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
              <div className="space-y-1">
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
              <div className="space-y-1">
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
              <div className="space-y-1">
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
              <div className="space-y-1">
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
              <div className="space-y-1">
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
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={savePathao}
                disabled={savingSection !== null}
              >
                {savingSection === "pathao" ? "Saving..." : "Save Pathao"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social */}
      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Leave a field empty to hide that icon from the footer.
          </p>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {SOCIAL_KEYS.map((key) => {
                const Icon = ICONS[key];
                return (
                  <div key={key} className="grid gap-2">
                    <Label
                      htmlFor={key}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {SOCIAL_LABELS[key]}
                    </Label>
                    <Input
                      id={key}
                      type="url"
                      placeholder={PLACEHOLDERS[key]}
                      value={social[key]}
                      onChange={(e) =>
                        setSocial({ ...social, [key]: e.target.value })
                      }
                    />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </form>
  );
}
