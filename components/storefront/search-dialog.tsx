"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, Loader2 } from "lucide-react";

type SearchResult = {
  id: string;
  name: string;
  slug: string;
  price: number;
  thumbnail: string;
};

export function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(q)}&limit=6`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.products || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (!open) onClose(); // toggle - parent handles open state
      }
      if (e.key === "Escape" && open) onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  }

  function handleSelect(slug: string) {
    router.push(`/products/${slug}`);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg mx-4 rounded-2xl border border-border/60 bg-card shadow-2xl">
        <form onSubmit={handleSubmit} className="flex items-center gap-3 px-4 py-3 border-b border-border/60">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </form>

        {results.length > 0 && (
          <div className="max-h-[300px] overflow-y-auto p-2">
            {results.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelect(p.slug)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-muted/50"
              >
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {p.thumbnail && (
                    <Image
                      src={p.thumbnail}
                      alt={p.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                </div>
                <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                  ৳{p.price.toLocaleString()}
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={handleSubmit}
              className="mt-1 w-full rounded-xl px-3 py-2 text-center text-sm text-primary hover:bg-primary/5"
            >
              View all results for &quot;{query}&quot;
            </button>
          </div>
        )}

        {query.length >= 2 && results.length === 0 && !loading && (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No products found for &quot;{query}&quot;
          </div>
        )}

        <div className="border-t border-border/60 px-4 py-2 text-xs text-muted-foreground">
          <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">↵</kbd>{" "}
          to search &middot;{" "}
          <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">ESC</kbd>{" "}
          to close
        </div>
      </div>
    </div>
  );
}
