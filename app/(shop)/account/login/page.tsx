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

export default function CustomerLoginPage() {
  const router = useRouter();
  const { refresh } = useCustomerAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/customer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Login failed");
        return;
      }
      await refresh();
      toast.success("Welcome back!");
      router.push("/account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-16 md:py-24">
      <header className="mb-8 text-center">
        <p className="font-display text-sm italic text-muted-foreground">
          Welcome back
        </p>
        <h1 className="mt-1 font-display text-4xl tracking-tight">
          Sign <em className="font-display italic">in</em>
        </h1>
      </header>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border/60 bg-card p-6 shadow-xs md:p-8 space-y-5"
      >
        <div className="space-y-2">
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="01XXXXXXXXX"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full rounded-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
          {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/account/register" className="text-primary hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
