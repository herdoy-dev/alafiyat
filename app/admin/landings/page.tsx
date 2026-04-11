"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ExternalLink,
  Eye,
  Pencil,
  Plus,
  Trash2,
  LayoutTemplate,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TEMPLATE_META } from "@/schemas/landing";

type Landing = {
  id: string;
  slug: string;
  title: string;
  template: string;
  status: string;
  views: number;
  createdAt: string;
  product: {
    id: string;
    name: string;
    thumbnail: string;
    price: number;
  };
};

export default function AdminLandingsPage() {
  const [landings, setLandings] = useState<Landing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/landings");
      if (res.ok) {
        const data = await res.json();
        setLandings(data.landings);
      }
    } catch {
      toast.error("Failed to load landings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this landing? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/landings/${id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Failed to delete");
        return;
      }
      toast.success("Landing deleted");
      setLandings((prev) => prev.filter((l) => l.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm italic text-muted-foreground">
            Marketing pages
          </p>
          <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
            Landings
          </h1>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/admin/landings/new">
            <Plus className="mr-1 h-4 w-4" />
            New landing
          </Link>
        </Button>
      </header>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[520px] w-full rounded-2xl" />
          ))}
        </div>
      ) : landings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 bg-card/40 p-12 text-center">
          <LayoutTemplate className="mx-auto h-10 w-10 text-muted-foreground/60" />
          <p className="mt-5 text-lg font-medium">No landings yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Build your first product landing page in under a minute.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link href="/admin/landings/new">
              <Plus className="mr-1 h-4 w-4" />
              Create landing
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {landings.map((landing) => {
            const meta =
              TEMPLATE_META[landing.template as keyof typeof TEMPLATE_META];
            return (
              <div
                key={landing.id}
                className="group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Full-height live landing preview via iframe, scaled down */}
                <div
                  className="relative w-full overflow-hidden bg-muted"
                  style={{ height: "1600px" }}
                >
                  <div
                    className="pointer-events-none absolute left-0 top-0"
                    style={{
                      width: "1280px",
                      height: "4000px",
                      transform: "scale(0.4)",
                      transformOrigin: "top left",
                    }}
                  >
                    <iframe
                      src={`/l/${landing.slug}`}
                      title={`${landing.title} preview`}
                      className="h-full w-full border-0 bg-background"
                      loading="lazy"
                      sandbox="allow-same-origin allow-scripts"
                    />
                  </div>

                  {/* Badges overlay */}
                  <div className="absolute left-4 top-4 z-10 flex gap-2">
                    <Badge
                      variant={
                        landing.status === "published"
                          ? "success"
                          : "secondary"
                      }
                      className="shadow-sm"
                    >
                      {landing.status}
                    </Badge>
                    {meta && (
                      <Badge
                        variant="outline"
                        className="bg-background/95 shadow-sm backdrop-blur-sm"
                      >
                        {meta.name}
                      </Badge>
                    )}
                  </div>
                  <div className="absolute right-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-background/95 px-3 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur-sm">
                    <Eye className="h-3 w-3" />
                    {landing.views.toLocaleString()}
                  </div>
                </div>

                {/* Footer */}
                <div className="space-y-4 border-t border-border/60 p-5">
                  <div>
                    <p className="line-clamp-1 font-display text-lg font-semibold tracking-tight">
                      {landing.title}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                      /l/{landing.slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="line-clamp-1">
                      {landing.product.name}
                    </span>
                    <span>·</span>
                    <span className="tabular-nums">
                      ৳{landing.product.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="flex-1"
                    >
                      <Link href={`/admin/landings/${landing.id}/edit`}>
                        <Pencil className="mr-1 h-3.5 w-3.5" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      title="Open public page"
                    >
                      <a
                        href={`/l/${landing.slug}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink className="mr-1 h-3.5 w-3.5" />
                        View
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(landing.id)}
                      disabled={deletingId === landing.id}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
