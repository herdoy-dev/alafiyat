"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, MessageSquareWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ComplainPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to submit complaint");
        return;
      }
      toast.success("Complaint submitted");
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="container mx-auto max-w-xl px-4 py-16 md:px-8">
        <Card>
          <CardContent className="space-y-4 py-12 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-green-500" />
            <h1 className="text-2xl font-bold">Thank you</h1>
            <p className="text-muted-foreground">
              We&apos;ve received your complaint and our team will review it
              shortly. We&apos;ll reach out to you on the contact details you
              provided.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setForm({
                  fullName: "",
                  phone: "",
                  email: "",
                  message: "",
                });
                setSubmitted(false);
              }}
            >
              Submit another
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 md:px-8 md:py-16">
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-3">
          <MessageSquareWarning className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">
            Submit a Complaint
          </h1>
        </div>
        <p className="text-muted-foreground">
          Had a problem with an order or our service? Let us know and
          we&apos;ll get back to you as soon as possible.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your details</CardTitle>
          <CardDescription>
            All fields are required so we can follow up.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                required
                value={form.fullName}
                onChange={(e) =>
                  setForm({ ...form, fullName: e.target.value })
                }
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Complaint</Label>
              <textarea
                id="message"
                required
                minLength={10}
                rows={6}
                placeholder="Please describe your complaint in detail…"
                className="min-h-32 rounded-md border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
              />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Complaint"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
