"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Star, Check, X, Trash2 } from "lucide-react";

type Review = {
  id: string;
  rating: number;
  comment: string;
  customerName: string;
  customerPhone: string;
  status: string;
  createdAt: string;
  product: { name: string; slug: string };
};

const STATUS_TABS = ["all", "pending", "approved", "rejected"] as const;

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<string>("pending");

  const fetchReviews = useCallback(async () => {
    try {
      const url = tab === "all" ? "/api/admin/reviews" : `/api/admin/reviews?status=${tab}`;
      const res = await fetch(url);
      if (res.ok) setReviews(await res.json());
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    setLoading(true);
    fetchReviews();
  }, [fetchReviews]);

  async function updateStatus(id: string, status: string) {
    try {
      await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      toast.success(`Review ${status}`);
      fetchReviews();
    } catch {
      toast.error("Failed to update");
    }
  }

  async function deleteReview(id: string) {
    if (!confirm("Delete this review?")) return;
    try {
      await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      toast.success("Review deleted");
      fetchReviews();
    } catch {
      toast.error("Failed to delete");
    }
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-1">
        <p className="font-display text-sm italic text-muted-foreground">
          Customer feedback
        </p>
        <h1 className="font-display text-4xl leading-[1.05] tracking-tight md:text-5xl">
          Review <em className="font-display italic">moderation</em>
        </h1>
      </header>

      <div className="flex gap-2">
        {STATUS_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              tab === t
                ? "bg-primary text-primary-foreground"
                : "border border-border/70 bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground py-12 text-center">
              No reviews found
            </p>
          ) : (
            <div className="divide-y divide-border/50">
              {reviews.map((r) => (
                <div key={r.id} className="flex gap-4 p-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{r.customerName}</span>
                      <span className="text-xs text-muted-foreground">
                        {r.customerPhone}
                      </span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">
                        {r.product.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < r.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground/20"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {r.comment}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-start gap-1 shrink-0">
                    {r.status !== "approved" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-green-600 hover:bg-green-50"
                        onClick={() => updateStatus(r.id, "approved")}
                        title="Approve"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    {r.status !== "rejected" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-orange-600 hover:bg-orange-50"
                        onClick={() => updateStatus(r.id, "rejected")}
                        title="Reject"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => deleteReview(r.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
