"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { StarRating } from "./star-rating";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Review = {
  id: string;
  rating: number;
  comment: string;
  customerName: string;
  createdAt: string;
};

export function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avg, setAvg] = useState(0);
  const [total, setTotal] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    rating: 5,
    comment: "",
  });

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
        setAvg(data.averageRating);
        setTotal(data.total);
      }
    } catch {}
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, productId }),
      });
      if (res.ok) {
        toast.success("Review submitted! It will appear after approval.");
        setShowForm(false);
        setForm({ customerName: "", customerPhone: "", rating: 5, comment: "" });
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to submit review");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-16 border-t border-border/60 pt-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-xs italic uppercase tracking-[0.2em] text-muted-foreground">
            Customer feedback
          </p>
          <h2 className="mt-1 font-display text-2xl tracking-tight md:text-3xl">
            Reviews
            {total > 0 && (
              <span className="ml-3 text-lg text-muted-foreground">
                {avg} / 5 ({total})
              </span>
            )}
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Write a review"}
        </Button>
      </div>

      {/* Review form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border border-border/60 bg-card p-5 space-y-4"
        >
          <div className="space-y-2">
            <Label>Rating</Label>
            <StarRating
              value={form.rating}
              onChange={(r) => setForm({ ...form, rating: r })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="reviewName">Your name</Label>
              <Input
                id="reviewName"
                required
                value={form.customerName}
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reviewPhone">Phone</Label>
              <Input
                id="reviewPhone"
                required
                value={form.customerPhone}
                onChange={(e) =>
                  setForm({ ...form, customerPhone: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reviewComment">Your review</Label>
            <textarea
              id="reviewComment"
              required
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
            />
          </div>
          <Button type="submit" disabled={submitting} className="rounded-full">
            {submitting ? "Submitting..." : "Submit review"}
          </Button>
        </form>
      )}

      {/* Review list */}
      <div className="mt-6 space-y-4">
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-border/50 bg-card/50 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StarRating value={review.rating} readonly size="sm" />
                  <span className="text-sm font-medium">
                    {review.customerName}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {review.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
