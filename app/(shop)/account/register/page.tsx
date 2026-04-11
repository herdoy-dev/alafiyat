"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCustomerAuth } from "@/components/providers/customer-auth-provider";
import { ArrowRight } from "lucide-react";

export default function CustomerRegisterPage() {
  const router = useRouter();
  const { refresh } = useCustomerAuth();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/customer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Registration failed");
        return;
      }
      await refresh();
      toast.success("Account created!");
      router.push("/account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-16 md:py-24">
      <header className="mb-8 text-center">
        <p className="font-display text-sm italic text-muted-foreground">
          Join Al Amirat
        </p>
        <h1 className="mt-1 font-display text-4xl tracking-tight">
          Create <em className="font-display italic">account</em>
        </h1>
      </header>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border/60 bg-card p-6 shadow-xs md:p-8 space-y-5"
      >
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            required
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="01XXXXXXXXX"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email (optional)</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password (min 6 characters)</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <Button type="submit" className="w-full rounded-full" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
          {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/account/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
