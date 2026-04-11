"use client";

import Link from "next/link";
import { useCustomerAuth } from "@/components/providers/customer-auth-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingBag,
  MapPin,
  LogOut,
  ChevronRight,
  User,
} from "lucide-react";

export default function AccountPage() {
  const { customer, loading, logout } = useCustomerAuth();

  if (loading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16">
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="container mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-display text-3xl tracking-tight">
          Please sign in
        </h1>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/account/login">Sign in</Link>
        </Button>
      </div>
    );
  }

  const links = [
    {
      label: "My Orders",
      href: "/account/orders",
      icon: ShoppingBag,
      description: "View order history and track shipments",
    },
    {
      label: "Saved Addresses",
      href: "/account/addresses",
      icon: MapPin,
      description: "Manage your delivery addresses",
    },
  ];

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 md:py-16">
      <header className="mb-10">
        <p className="font-display text-sm italic text-muted-foreground">
          Welcome back
        </p>
        <h1 className="mt-1 font-display text-4xl tracking-tight md:text-5xl">
          My <em className="font-display italic">account</em>
        </h1>
      </header>

      {/* Profile card */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-xs mb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <User className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-xl tracking-tight">
              {customer.fullName}
            </h2>
            <p className="text-sm text-muted-foreground">{customer.phone}</p>
            {customer.email && (
              <p className="text-sm text-muted-foreground">{customer.email}</p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <div className="space-y-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-xs transition-colors hover:border-primary/30 hover:bg-primary/5"
          >
            <link.icon className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-display text-base tracking-tight">
                {link.label}
              </p>
              <p className="text-sm text-muted-foreground">
                {link.description}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
      </div>

      <Button
        variant="ghost"
        className="mt-8 text-muted-foreground hover:text-destructive"
        onClick={logout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign out
      </Button>
    </div>
  );
}
