"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, Megaphone, Truck, Bell, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  {
    label: "Storefront",
    href: "/admin/settings/storefront",
    icon: Store,
    description: "Hero slider & social links",
  },
  {
    label: "Marketing",
    href: "/admin/settings/marketing",
    icon: Megaphone,
    description: "Pixels, analytics & tags",
  },
  {
    label: "Banner",
    href: "/admin/settings/banner",
    icon: Bell,
    description: "Announcement bar",
  },
  {
    label: "Couriers",
    href: "/admin/settings/couriers",
    icon: Truck,
    description: "Steadfast & Pathao credentials",
  },
  {
    label: "Site",
    href: "/admin/settings/site",
    icon: Globe,
    description: "Domain & SEO",
  },
];

export function SettingsTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Settings sections"
      className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0"
    >
      <ul className="flex min-w-max gap-2 md:min-w-0">
        {tabs.map((tab) => {
          const active = pathname.startsWith(tab.href);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={cn(
                  "group flex flex-col gap-0.5 rounded-xl border px-4 py-3 transition-all",
                  "min-w-[180px] md:min-w-0",
                  active
                    ? "border-primary/30 bg-primary/5 shadow-xs"
                    : "border-border/70 bg-card hover:border-border hover:bg-muted/50"
                )}
              >
                <span className="flex items-center gap-2">
                  <tab.icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      active
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "font-display text-base tracking-tight",
                      active ? "text-foreground" : "text-foreground/80"
                    )}
                  >
                    {tab.label}
                  </span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {tab.description}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
