"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  image: string;
};

export function CategorySlider({ categories }: { categories: CategoryItem[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="container mx-auto max-w-6xl px-4 py-12 md:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Shop by Category
          </h2>
          <p className="text-sm text-muted-foreground">
            Browse our curated collections
          </p>
        </div>
      </div>

      <Carousel
        opts={{ align: "start", loop: categories.length > 5 }}
        className="px-2"
      >
        <CarouselContent>
          {categories.map((category) => (
            <CarouselItem
              key={category.id}
              className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
            >
              <Link
                href={`/products?category=${category.slug}`}
                className="group block"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted shadow-sm transition-shadow group-hover:shadow-md">
                  {category.image && (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="text-base font-semibold text-white drop-shadow-sm md:text-lg">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        {categories.length > 1 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
    </section>
  );
}
