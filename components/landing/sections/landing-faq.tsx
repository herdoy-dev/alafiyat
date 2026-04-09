"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { q: string; a: string };

export function LandingFaq({
  items,
  theme = "light",
}: {
  items: Item[];
  theme?: "light" | "dark";
}) {
  const [open, setOpen] = useState<number | null>(0);
  const isDark = theme === "dark";

  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        "divide-y rounded-2xl border",
        isDark
          ? "divide-white/10 border-white/15 bg-white/[0.03]"
          : "divide-border/60 border-border/60 bg-card"
      )}
    >
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left"
            >
              <span className="font-semibold">{item.q}</span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </button>
            {isOpen && (
              <div
                className={cn(
                  "px-5 pb-5 text-sm leading-relaxed",
                  isDark ? "text-white/70" : "text-muted-foreground"
                )}
              >
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
