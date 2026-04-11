"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type Category = { slug: string; name: string };

export function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "newest";
  const currentCategory = searchParams.get("category") || "";
  const currentSearch = searchParams.get("search") || "";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";

  const hasFilters = currentCategory || currentSearch || currentMinPrice || currentMaxPrice || currentSort !== "newest";

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  function clearAll() {
    router.push("/products");
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Sort */}
      <Select
        value={currentSort}
        onValueChange={(v) => updateParams({ sort: v === "newest" ? null : v })}
      >
        <SelectTrigger className="w-[160px] rounded-full text-sm">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="price_asc">Price: Low → High</SelectItem>
          <SelectItem value="price_desc">Price: High → Low</SelectItem>
        </SelectContent>
      </Select>

      {/* Category */}
      <Select
        value={currentCategory || "all"}
        onValueChange={(v) =>
          updateParams({ category: v === "all" ? null : v })
        }
      >
        <SelectTrigger className="w-[160px] rounded-full text-sm">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.slug} value={c.slug}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Price Range */}
      <div className="flex items-center gap-1.5">
        <Input
          type="number"
          placeholder="Min ৳"
          className="w-[90px] rounded-full text-sm"
          defaultValue={currentMinPrice}
          onBlur={(e) => updateParams({ minPrice: e.target.value || null })}
          onKeyDown={(e) => {
            if (e.key === "Enter")
              updateParams({
                minPrice: (e.target as HTMLInputElement).value || null,
              });
          }}
        />
        <span className="text-muted-foreground text-xs">—</span>
        <Input
          type="number"
          placeholder="Max ৳"
          className="w-[90px] rounded-full text-sm"
          defaultValue={currentMaxPrice}
          onBlur={(e) => updateParams({ maxPrice: e.target.value || null })}
          onKeyDown={(e) => {
            if (e.key === "Enter")
              updateParams({
                maxPrice: (e.target as HTMLInputElement).value || null,
              });
          }}
        />
      </div>

      {/* Clear all */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className="rounded-full text-xs"
        >
          <X className="mr-1 h-3 w-3" />
          Clear all
        </Button>
      )}
    </div>
  );
}
