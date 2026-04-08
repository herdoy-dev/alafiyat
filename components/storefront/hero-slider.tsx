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
import { Badge } from "@/components/ui/badge";
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

function excerpt(html: string, max = 140) {
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
    <section className="relative border-b bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-16">
        <Carousel
          setApi={setApi}
          opts={{ loop: true, align: "start" }}
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
          className="relative"
        >
          <CarouselContent>
            {products.map((product, index) => (
              <CarouselItem key={product.id}>
                <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
                  {/* Copy */}
                  <div className="order-2 space-y-5 md:order-1">
                    {product.category && (
                      <Badge
                        variant="secondary"
                        className="uppercase tracking-wide"
                      >
                        {product.category.name}
                      </Badge>
                    )}
                    <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl">
                      {product.name}
                    </h1>
                    <p className="text-base text-muted-foreground md:text-lg">
                      {excerpt(product.description)}
                    </p>
                    <p className="text-2xl font-bold text-primary md:text-3xl">
                      ৳{product.price.toLocaleString()}
                    </p>
                    <Button size="lg" asChild>
                      <Link href={`/products/${product.slug}`}>
                        Shop now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  {/* Image */}
                  <div className="order-1 md:order-2">
                    <Link
                      href={`/products/${product.slug}`}
                      className="group relative block aspect-square overflow-hidden rounded-2xl border bg-muted shadow-lg"
                    >
                      {product.thumbnail && (
                        <Image
                          src={product.thumbnail}
                          alt={product.name}
                          fill
                          priority={index === 0}
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                      )}
                    </Link>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {products.length > 1 && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>

        {/* Dots */}
        {count > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => api?.scrollTo(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === current
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
