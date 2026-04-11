"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, Search, Heart } from "lucide-react";
import { useCart } from "@/lib/stores/cart";
import { useWishlist } from "@/lib/stores/wishlist";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SearchDialog } from "./search-dialog";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Shop", href: "/products" },
  { label: "FAQ", href: "/faq" },
  { label: "Complaints", href: "/complain" },
];

export function StorefrontNav() {
  const items = useCart((s) => s.items);
  const wishlistCount = useWishlist((s) => s.count);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  // Auto-close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Ctrl+K to open search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const cartCount = mounted
    ? items.reduce((sum, i) => sum + i.quantity, 0)
    : 0;
  const wCount = mounted ? wishlistCount() : 0;

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md supports-backdrop-filter:bg-background/65">
        <div className="container mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 md:px-8">
          {/* Mobile menu */}
          <Button
            variant="ghost"
            size="icon"
            className="-ml-2 h-10 w-10 md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <Image
              src="/logo.png"
              alt="Al Amirat"
              width={140}
              height={40}
              priority
              className="h-8 w-auto md:h-9"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="ml-8 hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative font-display text-base tracking-tight transition-colors",
                  isActive(link.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute -bottom-1.5 left-0 right-0 h-px bg-primary" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex-1" />

          {/* Right cluster */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
            >
              <Search className="h-[18px] w-[18px]" />
            </Button>

            <ThemeToggle />

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="relative h-10 w-10"
            >
              <Link href="/wishlist" aria-label="View wishlist">
                <Heart className="h-[18px] w-[18px]" />
                {wCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-0.5 -right-0.5 h-5 min-w-5 rounded-full px-1 text-[10px] font-semibold tabular-nums"
                  >
                    {wCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="relative h-10 w-10"
            >
              <Link href="/cart" aria-label="View cart">
                <ShoppingBag className="h-[18px] w-[18px]" />
                {cartCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-0.5 -right-0.5 h-5 min-w-5 rounded-full px-1 text-[10px] font-semibold tabular-nums"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Search overlay */}
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-72 p-0"
          showCloseButton={false}
        >
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center border-b border-border/60 px-6">
              <Image
                src="/logo.png"
                alt="Al Amirat"
                width={140}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <nav className="flex-1 space-y-1 p-4">
              <p className="mb-2 px-3 font-display text-[11px] italic tracking-wide text-muted-foreground">
                Browse
              </p>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 font-display text-lg tracking-tight transition-colors",
                    isActive(link.href)
                      ? "bg-primary/5 text-primary"
                      : "text-foreground/80 hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/wishlist"
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2.5 font-display text-lg tracking-tight transition-colors",
                  isActive("/wishlist")
                    ? "bg-primary/5 text-primary"
                    : "text-foreground/80 hover:bg-muted"
                )}
              >
                <span>Wishlist</span>
                {wCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="rounded-full px-2 text-[10px] tabular-nums"
                  >
                    {wCount}
                  </Badge>
                )}
              </Link>
              <Link
                href="/cart"
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2.5 font-display text-lg tracking-tight transition-colors",
                  isActive("/cart")
                    ? "bg-primary/5 text-primary"
                    : "text-foreground/80 hover:bg-muted"
                )}
              >
                <span>Cart</span>
                {cartCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="rounded-full px-2 text-[10px] tabular-nums"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Link>
            </nav>
            <div className="border-t border-border/60 p-6">
              <p className="font-display text-xs italic text-muted-foreground">
                Curated quality goods, delivered to your door.
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
