"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type HeroProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  thumbnail: string;
  category: { name: string; slug: string } | null;
};

function excerpt(html: string, max = 160) {
  const text = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

export function HeroSlider({ products }: { products: HeroProduct[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (products.length === 0) return null;

  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-primary/[0.04] via-background to-background">
      {/* Decorative grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(from_var(--foreground)_l_c_h_/_0.04)_1px,transparent_1px),linear-gradient(to_bottom,oklch(from_var(--foreground)_l_c_h_/_0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
      />

      <div className="container relative mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-20">
        <Carousel
          setApi={setApi}
          opts={{ loop: true, align: "start" }}
          plugins={[
            Autoplay({
              delay: 5500,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
          className="relative"
        >
          <CarouselContent>
            {products.map((product, index) => (
              <CarouselItem key={product.id}>
                <div className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
                  {/* Copy */}
                  <div className="order-2 space-y-5 md:order-1 md:col-span-6">
                    {product.category && (
                      <p className="font-display text-sm italic text-muted-foreground">
                        Featured in{" "}
                        <Link
                          href={`/products?category=${product.category.slug}`}
                          className="text-foreground underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary"
                        >
                          {product.category.name}
                        </Link>
                      </p>
                    )}
                    <h1 className="font-display text-4xl leading-[0.95] tracking-tight sm:text-5xl md:text-6xl">
                      {product.name}
                    </h1>
                    <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
                      {excerpt(product.description)}
                    </p>
                    <div className="flex flex-wrap items-baseline gap-4 pt-2">
                      <p className="font-display text-3xl tracking-tight tabular-nums md:text-4xl">
                        ৳{product.price.toLocaleString()}
                      </p>
                      <Button size="lg" asChild className="group rounded-full">
                        <Link href={`/products/${product.slug}`}>
                          Shop now
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="order-1 md:order-2 md:col-span-6">
                    <Link
                      href={`/products/${product.slug}`}
                      className="group relative block aspect-square overflow-hidden rounded-3xl border border-border/60 bg-muted shadow-xl"
                    >
                      {product.thumbnail && (
                        <Image
                          src={product.thumbnail}
                          alt={product.name}
                          fill
                          priority={index === 0}
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          unoptimized
                        />
                      )}
                      {/* Index marker */}
                      <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 backdrop-blur-sm">
                        <span className="font-display text-xs italic text-muted-foreground">
                          {String(index + 1).padStart(2, "0")} /{" "}
                          {String(products.length).padStart(2, "0")}
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {products.length > 1 && (
            <div className="mt-6 hidden md:block">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          )}
        </Carousel>

        {/* Dots */}
        {count > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2 md:mt-10">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => api?.scrollTo(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === current
                    ? "w-10 bg-primary"
                    : "w-2 bg-foreground/15 hover:bg-foreground/30"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
