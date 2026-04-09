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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  EMPTY_SOCIAL,
  HERO_MAX,
  SOCIAL_KEYS,
  SOCIAL_LABELS,
  type SocialKey,
  type SocialLinks,
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

export default function StorefrontSettingsPage() {
  const [social, setSocial] = useState<SocialLinks>(EMPTY_SOCIAL);
  const [heroIds, setHeroIds] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<"hero" | "social" | null>(null);

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

  async function patchSection(
    section: "hero" | "social",
    body: Record<string, unknown>,
    successMessage: string
  ) {
    setSaving(section);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to save");
        return;
      }
      if (data.social) setSocial(data.social);
      if (Array.isArray(data.heroProductIds)) setHeroIds(data.heroProductIds);
      toast.success(successMessage);
    } finally {
      setSaving(null);
    }
  }

  function saveHero() {
    patchSection("hero", { heroProductIds: heroIds }, "Hero slider saved");
  }

  function saveSocial() {
    patchSection("social", { social }, "Social links saved");
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
    <div className="space-y-6">
      {/* Hero slider */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-2xl tracking-tight">
            Hero slider products
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Pick up to {HERO_MAX} products to feature in the home page hero.
            Order matters — use the arrows to reorder. Leave empty to fall
            back to the latest 6 products automatically.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          {loading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Selected */}
              <div className="space-y-2">
                <h3 className="font-display text-xs italic uppercase tracking-[0.18em] text-muted-foreground">
                  Selected · {selectedProducts.length}/{HERO_MAX}
                </h3>
                {selectedProducts.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border/70 p-8 text-center text-sm text-muted-foreground">
                    No products selected.
                  </div>
                ) : (
                  <ol className="space-y-2">
                    {selectedProducts.map((p, i) => (
                      <li
                        key={p.id}
                        className="flex items-center gap-3 rounded-xl border border-border/70 bg-card p-2 shadow-xs"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary font-display text-sm text-primary-foreground">
                          {i + 1}
                        </span>
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
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
                          <p className="text-xs text-muted-foreground tabular-nums">
                            ৳{p.price}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-0.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={i === 0}
                            onClick={() => moveHero(i, -1)}
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={i === selectedProducts.length - 1}
                            onClick={() => moveHero(i, 1)}
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
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
                <h3 className="font-display text-xs italic uppercase tracking-[0.18em] text-muted-foreground">
                  Available products
                </h3>
                {availableProducts.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border/70 p-8 text-center text-sm text-muted-foreground">
                    No more products to add.
                  </div>
                ) : (
                  <div className="max-h-[28rem] space-y-2 overflow-y-auto rounded-xl border border-border/70 bg-card p-2">
                    {availableProducts.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
                      >
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
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
                          <p className="text-xs text-muted-foreground tabular-nums">
                            ৳{p.price}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
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
          {!loading && (
            <div className="flex justify-end border-t border-border/60 pt-4">
              <Button onClick={saveHero} disabled={saving !== null}>
                {saving === "hero" ? "Saving..." : "Save hero slider"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social links */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-2xl tracking-tight">
            Social links
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Leave a field empty to hide that icon from the storefront footer.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {SOCIAL_KEYS.map((key) => {
                const Icon = ICONS[key];
                return (
                  <div key={key} className="space-y-2">
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
          {!loading && (
            <div className="flex justify-end border-t border-border/60 pt-4">
              <Button onClick={saveSocial} disabled={saving !== null}>
                {saving === "social" ? "Saving..." : "Save social links"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
