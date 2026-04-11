"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";
import {
  LayoutDashboard,
  LayoutTemplate,
  ShoppingCart,
  Package,
  Tag,
  Users,
  UserRound,
  MessageSquareWarning,
  Settings,
  LogOut,
  BarChart3,
  Ticket,
  Star,
  ScrollText,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Catalog",
    items: [
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Categories", href: "/admin/categories", icon: Tag },
      { label: "Landings", href: "/admin/landings", icon: LayoutTemplate },
    ],
  },
  {
    label: "Sales",
    items: [
      { label: "Orders", href: "/admin/purchases", icon: ShoppingCart },
      { label: "Customers", href: "/admin/customers", icon: UserRound },
      { label: "Coupons", href: "/admin/coupons", icon: Ticket },
      { label: "Reviews", href: "/admin/reviews", icon: Star },
    ],
  },
  {
    label: "People",
    items: [
      { label: "Admins", href: "/admin/users", icon: Users },
      {
        label: "Complaints",
        href: "/admin/complaints",
        icon: MessageSquareWarning,
      },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings", href: "/admin/settings", icon: Settings },
      { label: "Activity", href: "/admin/activity", icon: ScrollText },
    ],
  },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuthContext();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-sidebar-border px-5">
        <Image
          src="/logo.png"
          alt="Al Amirat"
          width={120}
          height={32}
          className="h-7 w-auto"
        />
        <span className="ml-auto rounded-full border border-sidebar-border bg-sidebar-accent/30 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-sidebar-foreground/60">
          Admin
        </span>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-1">
            <p className="px-3 pb-1 font-display text-[11px] italic tracking-wide text-sidebar-foreground/40">
              {group.label}
            </p>
            {group.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/40 hover:text-sidebar-accent-foreground"
                  )}
                >
                  {/* Active rail */}
                  <span
                    className={cn(
                      "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary transition-opacity",
                      active ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <item.icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      active
                        ? "text-primary"
                        : "text-sidebar-foreground/50 group-hover:text-sidebar-accent-foreground"
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User card */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
          <Avatar className="h-9 w-9 ring-2 ring-sidebar-accent/30">
            <AvatarFallback className="bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold leading-tight">
              {user?.name}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/60">
              {user?.email}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-sidebar-foreground/60 hover:bg-destructive/10 hover:text-destructive"
            onClick={logout}
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
