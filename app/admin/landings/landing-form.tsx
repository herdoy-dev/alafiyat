"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ExternalLink, Plus, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  EMPTY_LANDING_CONTENT,
  LANDING_TEMPLATES,
  TEMPLATE_META,
  type LandingContent,
  type LandingTemplate,
} from "@/schemas/landing";
import {
  DeviceToggle,
  LandingPreview,
  type DeviceMode,
} from "./landing-preview";
import type {
  LandingProductLite,
  LandingViewModel,
} from "@/components/landing/templates/types";

type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  thumbnail: string;
  price: number;
  stock: number;
  images: string[];
};

export type LandingFormValues = {
  title: string;
  slug: string;
  productId: string;
  template: LandingTemplate;
  status: "draft" | "published";
  videoUrl: string;
  content: LandingContent;
};

const DEFAULT_VALUES: LandingFormValues = {
  title: "",
  slug: "",
  productId: "",
  template: "classic",
  status: "draft",
  videoUrl: "",
  content: EMPTY_LANDING_CONTENT,
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function LandingForm({
  mode,
  landingId,
  initialValues,
}: {
  mode: "create" | "edit";
  landingId?: string;
  initialValues?: LandingFormValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState<LandingFormValues>(
    initialValues ?? DEFAULT_VALUES
  );
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [device, setDevice] = useState<DeviceMode>("desktop");

  const selectedProduct = useMemo<LandingProductLite | null>(() => {
    const p = products.find((x) => x.id === values.productId);
    if (!p) return null;
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      stock: p.stock,
      thumbnail: p.thumbnail,
      images: p.images || [],
    };
  }, [products, values.productId]);

  const previewLanding: LandingViewModel = {
    id: landingId ?? "preview",
    slug: values.slug,
    title: values.title,
    template: values.template,
    videoUrl: values.videoUrl || null,
    content: values.content,
  };

  useEffect(() => {
    fetch("/api/admin/products?limit=50")
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setLoadingProducts(false));
  }, []);

  function patch<K extends keyof LandingFormValues>(
    key: K,
    value: LandingFormValues[K]
  ) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function patchContent(updater: (c: LandingContent) => LandingContent) {
    setValues((v) => ({ ...v, content: updater(v.content) }));
  }

  async function save(redirectAfter: boolean) {
    if (!values.title || !values.slug || !values.productId) {
      toast.error("Title, slug, and product are required");
      return;
    }
    if (!values.content.hero.headline) {
      toast.error("Hero headline is required");
      return;
    }

    setSaving(true);
    try {
      const url =
        mode === "create"
          ? "/api/admin/landings"
          : `/api/admin/landings/${landingId}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to save");
        return;
      }
      toast.success(mode === "create" ? "Landing created" : "Saved");
      if (mode === "create") {
        router.push(`/admin/landings/${data.landing.id}/edit`);
      } else if (redirectAfter) {
        router.push("/admin/landings");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex h-[calc(100dvh-9rem)] flex-col overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm md:h-[calc(100dvh-7rem)]">
      {/* Top bar */}
      <header className="flex items-center gap-2 border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur-md md:px-6">
        <Button variant="ghost" size="icon" asChild className="-ml-2">
          <Link href="/admin/landings">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] italic text-muted-foreground">
            {mode === "create" ? "Create" : "Edit"} landing
          </p>
          <h1 className="truncate text-base font-semibold leading-tight md:text-lg">
            {values.title || "Untitled landing"}
          </h1>
        </div>
        <div className="hidden md:block">
          <DeviceToggle value={device} onChange={setDevice} />
        </div>
        {mode === "edit" && values.status === "published" && values.slug && (
          <Button asChild variant="outline" size="sm" className="hidden md:inline-flex">
            <a href={`/l/${values.slug}`} target="_blank" rel="noreferrer">
              <ExternalLink className="mr-1 h-3.5 w-3.5" />
              Open
            </a>
          </Button>
        )}
        <Button
          onClick={() => save(true)}
          disabled={saving}
          size="sm"
          className="rounded-full"
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </header>

      {/* Mobile device toggle */}
      <div className="flex justify-center border-b border-border/60 bg-background/60 px-4 py-2 md:hidden">
        <DeviceToggle value={device} onChange={setDevice} />
      </div>

      {/* Body — preview left, form right */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Preview */}
        <div className="min-h-[60vh] flex-1 lg:min-h-0">
          <LandingPreview
            device={device}
            template={values.template}
            landing={previewLanding}
            product={selectedProduct}
          />
        </div>

        {/* Form panel */}
        <aside className="flex w-full shrink-0 flex-col border-t border-border/60 bg-background lg:w-[420px] lg:border-l lg:border-t-0">
          <div className="flex-1 space-y-5 overflow-y-auto p-5">

      {/* Basics */}
      <Card>
        <CardHeader>
          <CardTitle>Basics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="lf-title">Internal title</Label>
            <Input
              id="lf-title"
              value={values.title}
              onChange={(e) => {
                patch("title", e.target.value);
                if (!slugTouched) patch("slug", slugify(e.target.value));
              }}
              placeholder="Eid bundle promo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lf-slug">URL slug</Label>
            <div className="flex items-center gap-2 rounded-md border border-input bg-transparent pl-3 text-sm">
              <span className="text-muted-foreground">/l/</span>
              <Input
                id="lf-slug"
                value={values.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  patch("slug", slugify(e.target.value));
                }}
                className="border-0 shadow-none focus-visible:ring-0"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={values.status}
              onValueChange={(v) => patch("status", v as "draft" | "published")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Product</Label>
            <Select
              value={values.productId}
              onValueChange={(v) => patch("productId", v)}
              disabled={loadingProducts}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingProducts ? "Loading..." : "Select a product"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} — ৳{p.price.toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Template picker */}
      <Card>
        <CardHeader>
          <CardTitle>Template</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LANDING_TEMPLATES.map((id) => {
              const meta = TEMPLATE_META[id];
              const active = values.template === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => patch("template", id)}
                  className={cn(
                    "rounded-2xl border p-5 text-left transition-all",
                    active
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border/60 hover:border-foreground/30"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <p className="text-base font-semibold tracking-tight">
                      {meta.name}
                    </p>
                    {active && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary-foreground">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {meta.description}
                  </p>
                  <p className="mt-2 text-xs italic text-muted-foreground">
                    Best for: {meta.tone}
                  </p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pre-hero video */}
      <Card>
        <CardHeader>
          <CardTitle>Pre-hero video</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="lf-video">YouTube URL</Label>
          <Input
            id="lf-video"
            placeholder="https://youtu.be/..."
            value={values.videoUrl}
            onChange={(e) => patch("videoUrl", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Optional. Renders above the hero on the public page. Accepts any
            standard YouTube URL.
          </p>
        </CardContent>
      </Card>

      {/* Hero */}
      <Card>
        <CardHeader>
          <CardTitle>Hero</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Eyebrow</Label>
            <Input
              value={values.content.hero.eyebrow}
              onChange={(e) =>
                patchContent((c) => ({
                  ...c,
                  hero: { ...c.hero, eyebrow: e.target.value },
                }))
              }
              placeholder="New arrival"
            />
          </div>
          <div className="space-y-2">
            <Label>Badge</Label>
            <Input
              value={values.content.hero.badge}
              onChange={(e) =>
                patchContent((c) => ({
                  ...c,
                  hero: { ...c.hero, badge: e.target.value },
                }))
              }
              placeholder="Limited stock"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Headline *</Label>
            <Input
              value={values.content.hero.headline}
              onChange={(e) =>
                patchContent((c) => ({
                  ...c,
                  hero: { ...c.hero, headline: e.target.value },
                }))
              }
              placeholder="The story of your product"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Sub-headline</Label>
            <Input
              value={values.content.hero.subheadline}
              onChange={(e) =>
                patchContent((c) => ({
                  ...c,
                  hero: { ...c.hero, subheadline: e.target.value },
                }))
              }
              placeholder="One line that sells the dream"
            />
          </div>
          <div className="space-y-2">
            <Label>Hero CTA label</Label>
            <Input
              value={values.content.hero.ctaLabel}
              onChange={(e) =>
                patchContent((c) => ({
                  ...c,
                  hero: { ...c.hero, ctaLabel: e.target.value },
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Benefits repeater */}
      <Repeater
        title="Benefits"
        items={values.content.benefits}
        onChange={(items) =>
          patchContent((c) => ({ ...c, benefits: items }))
        }
        empty={{ icon: "", title: "", body: "" }}
        renderItem={(item, update) => (
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5 md:col-span-2">
              <Label>Title</Label>
              <Input
                value={item.title}
                onChange={(e) => update({ ...item, title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>Body</Label>
              <Input
                value={item.body}
                onChange={(e) => update({ ...item, body: e.target.value })}
              />
            </div>
          </div>
        )}
      />

      {/* Highlights repeater */}
      <Repeater
        title="Highlights (alternating image/text)"
        items={values.content.highlights}
        onChange={(items) =>
          patchContent((c) => ({ ...c, highlights: items }))
        }
        empty={{ title: "", body: "", image: "" }}
        renderItem={(item, update) => (
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                value={item.title}
                onChange={(e) => update({ ...item, title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Image URL</Label>
              <Input
                value={item.image}
                onChange={(e) => update({ ...item, image: e.target.value })}
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>Body</Label>
              <Input
                value={item.body}
                onChange={(e) => update({ ...item, body: e.target.value })}
              />
            </div>
          </div>
        )}
      />

      {/* Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>Gallery (image URLs)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {values.content.gallery.map((src, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                {src && (
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
              <Input
                value={src}
                onChange={(e) =>
                  patchContent((c) => ({
                    ...c,
                    gallery: c.gallery.map((g, j) =>
                      j === i ? e.target.value : g
                    ),
                  }))
                }
                placeholder="https://..."
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10"
                onClick={() =>
                  patchContent((c) => ({
                    ...c,
                    gallery: c.gallery.filter((_, j) => j !== i),
                  }))
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              patchContent((c) => ({ ...c, gallery: [...c.gallery, ""] }))
            }
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add image
          </Button>
        </CardContent>
      </Card>

      {/* Testimonials repeater */}
      <Repeater
        title="Testimonials"
        items={values.content.testimonials}
        onChange={(items) =>
          patchContent((c) => ({ ...c, testimonials: items }))
        }
        empty={{ name: "", location: "", quote: "", rating: 5 }}
        renderItem={(item, update) => (
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input
                value={item.name}
                onChange={(e) => update({ ...item, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input
                value={item.location ?? ""}
                onChange={(e) => update({ ...item, location: e.target.value })}
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>Quote</Label>
              <Input
                value={item.quote}
                onChange={(e) => update({ ...item, quote: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Rating (1–5)</Label>
              <Input
                type="number"
                min={1}
                max={5}
                value={item.rating ?? 5}
                onChange={(e) =>
                  update({
                    ...item,
                    rating: Math.max(
                      1,
                      Math.min(5, Number(e.target.value) || 5)
                    ),
                  })
                }
              />
            </div>
          </div>
        )}
      />

      {/* FAQ repeater */}
      <Repeater
        title="FAQ"
        items={values.content.faq}
        onChange={(items) => patchContent((c) => ({ ...c, faq: items }))}
        empty={{ q: "", a: "" }}
        renderItem={(item, update) => (
          <div className="grid gap-3">
            <div className="space-y-1.5">
              <Label>Question</Label>
              <Input
                value={item.q}
                onChange={(e) => update({ ...item, q: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Answer</Label>
              <Input
                value={item.a}
                onChange={(e) => update({ ...item, a: e.target.value })}
              />
            </div>
          </div>
        )}
      />

      {/* Trust badges */}
      <Card>
        <CardHeader>
          <CardTitle>Trust badges</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {values.content.trustBadges.map((b, i) => (
            <div key={i} className="flex items-center gap-3">
              <Input
                value={b}
                onChange={(e) =>
                  patchContent((c) => ({
                    ...c,
                    trustBadges: c.trustBadges.map((x, j) =>
                      j === i ? e.target.value : x
                    ),
                  }))
                }
                placeholder="e.g. Cash on delivery"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10"
                onClick={() =>
                  patchContent((c) => ({
                    ...c,
                    trustBadges: c.trustBadges.filter((_, j) => j !== i),
                  }))
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              patchContent((c) => ({
                ...c,
                trustBadges: [...c.trustBadges, ""],
              }))
            }
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add badge
          </Button>
        </CardContent>
      </Card>

      {/* Final CTA */}
      <Card>
        <CardHeader>
          <CardTitle>Final CTA + order form copy</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label>Final CTA headline</Label>
            <Input
              value={values.content.finalCta.headline}
              onChange={(e) =>
                patchContent((c) => ({
                  ...c,
                  finalCta: { ...c.finalCta, headline: e.target.value },
                }))
              }
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Final CTA sub-headline</Label>
            <Input
              value={values.content.finalCta.subheadline}
              onChange={(e) =>
                patchContent((c) => ({
                  ...c,
                  finalCta: { ...c.finalCta, subheadline: e.target.value },
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Final CTA button label</Label>
            <Input
              value={values.content.finalCta.ctaLabel}
              onChange={(e) =>
                patchContent((c) => ({
                  ...c,
                  finalCta: { ...c.finalCta, ctaLabel: e.target.value },
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Order form title</Label>
            <Input
              value={values.content.orderForm.title}
              onChange={(e) =>
                patchContent((c) => ({
                  ...c,
                  orderForm: { ...c.orderForm, title: e.target.value },
                }))
              }
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Order form subtitle</Label>
            <Input
              value={values.content.orderForm.subtitle}
              onChange={(e) =>
                patchContent((c) => ({
                  ...c,
                  orderForm: { ...c.orderForm, subtitle: e.target.value },
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

          </div>
        </aside>
      </div>
    </div>
  );
}

function Repeater<T>({
  title,
  items,
  onChange,
  empty,
  renderItem,
}: {
  title: string;
  items: T[];
  onChange: (items: T[]) => void;
  empty: T;
  renderItem: (item: T, update: (next: T) => void) => React.ReactNode;
}) {
  function update(idx: number, next: T) {
    onChange(items.map((it, i) => (i === idx ? next : it)));
  }
  function remove(idx: number) {
    onChange(items.filter((_, i) => i !== idx));
  }
  function add() {
    onChange([...items, empty]);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No items yet. Add one below.
          </p>
        )}
        {items.map((item, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/60 bg-muted/30 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Item {i + 1}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:bg-destructive/10"
                onClick={() => remove(i)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            {renderItem(item, (next) => update(i, next))}
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add
        </Button>
      </CardContent>
    </Card>
  );
}
