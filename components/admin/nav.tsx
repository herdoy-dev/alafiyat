"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AdminSidebar } from "./sidebar";
import { Menu } from "lucide-react";

const TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/products/new": "New product",
  "/admin/categories": "Categories",
  "/admin/purchases": "Orders",
  "/admin/customers": "Customers",
  "/admin/users": "Admins",
  "/admin/complaints": "Complaints",
  "/admin/settings": "Settings",
  "/admin/settings/storefront": "Storefront",
  "/admin/settings/marketing": "Marketing",
  "/admin/settings/couriers": "Couriers",
};

function deriveTitle(pathname: string) {
  if (TITLES[pathname]) return TITLES[pathname];
  const seg = pathname.split("/").filter(Boolean);
  // /admin/products/[id]/edit, /admin/purchases/[id], etc.
  if (seg.length >= 3 && seg[0] === "admin") {
    const base = `/${seg[0]}/${seg[1]}`;
    return TITLES[base] || "Admin";
  }
  return "Admin";
}

export function AdminNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const title = deriveTitle(pathname);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
        <div className="flex h-16 items-center gap-3 px-4 md:px-8">
          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="-ml-2 h-9 w-9 md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Mobile brand */}
          <div className="flex items-center gap-2 md:hidden">
            <Image
              src="/logo.png"
              alt="Al Amirat"
              width={100}
              height={28}
              className="h-6 w-auto"
            />
          </div>

          {/* Page title — desktop only */}
          <div className="hidden md:flex md:flex-col">
            <p className="font-display text-[11px] italic text-muted-foreground">
              Admin
            </p>
            <h2 className="-mt-0.5 font-display text-2xl leading-none tracking-tight">
              {title}
            </h2>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right cluster */}
          <ThemeToggle />
        </div>

        {/* Mobile sub-title bar */}
        <div className="border-t border-border/50 bg-muted/30 px-4 py-2 md:hidden">
          <p className="font-display text-[10px] italic text-muted-foreground">
            Admin
          </p>
          <h2 className="-mt-0.5 font-display text-lg leading-none tracking-tight">
            {title}
          </h2>
        </div>
      </header>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-72 p-0"
          showCloseButton={false}
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <AdminSidebar onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
