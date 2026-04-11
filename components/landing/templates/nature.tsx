import Image from "next/image";
import { Leaf, Star, Sprout } from "lucide-react";
import { YouTubeEmbed } from "@/components/landing/sections/youtube-embed";
import { LandingOrderForm } from "@/components/landing/sections/order-form";
import { LandingFaq } from "@/components/landing/sections/landing-faq";
import { Button } from "@/components/ui/button";
import type { TemplateProps } from "./types";

// NATURE — Earthy greens, cream backgrounds, organic rounded shapes,
// soft photography. For natural, organic, wellness, or home products.

export function NatureTemplate({ landing, product }: TemplateProps) {
  const c = landing.content;

  return (
    <div className="overflow-x-hidden bg-[#f5f1e8] text-[#2d3a2e]">
      {/* Hero — organic curves */}
      <section className="relative overflow-hidden">
        {/* Decorative leaf shapes */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#a7c4a0]/30 blur-2xl" />
        <div className="pointer-events-none absolute -left-20 top-40 h-48 w-48 rounded-full bg-[#d4a574]/20 blur-2xl" />

        <div className="container relative mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
          <div className="grid items-center gap-12 md:grid-cols-12 md:gap-14">
            <div className="md:col-span-6">
              {c.hero.eyebrow && (
                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#7a9471]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#4a6741]">
                  <Leaf className="h-3 w-3" />
                  {c.hero.eyebrow}
                </div>
              )}
              <h1 className="text-4xl font-light leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
                {c.hero.headline || product.name}
              </h1>
              {c.hero.subheadline && (
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#5a6b5c] md:text-xl">
                  {c.hero.subheadline}
                </p>
              )}
              <div className="mt-8 flex flex-wrap items-baseline gap-4">
                <p className="text-3xl font-light tabular-nums text-[#2d3a2e] md:text-4xl">
                  ৳{product.price.toLocaleString()}
                </p>
                {c.hero.badge && (
                  <span className="rounded-full bg-[#d4a574]/20 px-3 py-1 text-xs font-medium text-[#8b5a2b]">
                    {c.hero.badge}
                  </span>
                )}
              </div>
              <Button
                asChild
                size="lg"
                className="mt-8 rounded-full bg-[#4a6741] px-8 text-white shadow-lg shadow-[#4a6741]/20 hover:bg-[#3a5232]"
              >
                <a href="#order-form">{c.hero.ctaLabel || "Order now"}</a>
              </Button>
              {c.trustBadges.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#5a6b5c]">
                  {c.trustBadges.map((b, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5">
                      <Sprout className="h-3.5 w-3.5 text-[#7a9471]" />
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="md:col-span-6">
              <div className="relative">
                {/* Organic blob shape */}
                <div
                  className="relative overflow-hidden bg-[#e8e0cd] shadow-2xl"
                  style={{
                    borderRadius: "60% 40% 55% 45% / 55% 45% 60% 40%",
                    aspectRatio: "1",
                  }}
                >
                  {product.thumbnail && (
                    <Image
                      src={product.thumbnail}
                      alt={product.name}
                      fill
                      priority
                      className="object-cover"
                      unoptimized
                    />
                  )}
                </div>
                {/* Decorative leaf */}
                <div className="pointer-events-none absolute -right-4 -top-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#7a9471] text-white shadow-lg">
                  <Leaf className="h-7 w-7" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video */}
      {landing.videoUrl && (
        <section className="bg-[#e8e0cd]/40">
          <div className="container mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-20">
            <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#4a6741]">
              Watch our story
            </p>
            <YouTubeEmbed url={landing.videoUrl} title={landing.title} />
          </div>
        </section>
      )}

      {/* Benefits — organic cards */}
      {c.benefits.length > 0 && (
        <section>
          <div className="container mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
            <div className="mb-12 text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#4a6741]">
                — Rooted in quality —
              </p>
              <h2 className="text-3xl font-light tracking-tight md:text-5xl">
                Why you&apos;ll love it
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {c.benefits.map((b, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden bg-white p-8 shadow-sm transition-all hover:shadow-xl"
                  style={{ borderRadius: "30% 70% 50% 50% / 50% 50% 70% 30%" }}
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#a7c4a0]/30 text-[#4a6741] transition-transform group-hover:scale-110">
                    <Leaf className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2d3a2e]">
                    {b.title}
                  </h3>
                  {b.body && (
                    <p className="mt-3 text-sm leading-relaxed text-[#5a6b5c]">
                      {b.body}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Highlights */}
      {c.highlights.length > 0 && (
        <section className="relative overflow-hidden bg-[#e8e0cd]/40">
          <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-[#7a9471]/10 blur-3xl" />
          <div className="container relative mx-auto max-w-6xl space-y-20 px-4 py-20 md:px-8 md:py-28 md:space-y-28">
            {c.highlights.map((h, i) => (
              <div
                key={i}
                className={`grid items-center gap-12 md:grid-cols-2 md:gap-16 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                <div>
                  {h.image && (
                    <div
                      className="relative aspect-square overflow-hidden shadow-xl"
                      style={{
                        borderRadius:
                          i % 2 === 0
                            ? "55% 45% 60% 40% / 50% 60% 40% 50%"
                            : "40% 60% 45% 55% / 60% 40% 60% 40%",
                      }}
                    >
                      <Image
                        src={h.image}
                        alt={h.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                </div>
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#4a6741]">
                    Chapter {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="text-3xl font-light leading-tight tracking-tight md:text-4xl lg:text-5xl">
                    {h.title}
                  </h3>
                  {h.body && (
                    <p className="mt-5 text-lg leading-relaxed text-[#5a6b5c]">
                      {h.body}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gallery */}
      {c.gallery.length > 0 && (
        <section>
          <div className="container mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-24">
            <p className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#4a6741]">
              — Moments —
            </p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {c.gallery.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden bg-[#e8e0cd] shadow-md"
                  style={{
                    borderRadius:
                      i % 3 === 0
                        ? "45% 55% 50% 50% / 55% 45% 55% 45%"
                        : i % 3 === 1
                          ? "50% 50% 55% 45% / 45% 55% 45% 55%"
                          : "55% 45% 45% 55% / 50% 50% 55% 45%",
                  }}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {c.testimonials.length > 0 && (
        <section className="bg-[#4a6741] text-white">
          <div className="container mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#a7c4a0]">
              — Growing community —
            </p>
            <h2 className="mb-12 text-center text-3xl font-light tracking-tight md:text-5xl">
              From the garden
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {c.testimonials.map((t, i) => (
                <figure
                  key={i}
                  className="rounded-3xl bg-white/5 p-7 backdrop-blur-sm"
                >
                  {t.rating && (
                    <div className="mb-4 flex gap-0.5 text-[#d4a574]">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  )}
                  <blockquote className="flex-1 text-base italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 text-sm">
                    <span className="font-semibold">— {t.name}</span>
                    {t.location && (
                      <span className="text-[#a7c4a0]"> · {t.location}</span>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {c.faq.length > 0 && (
        <section className="bg-[#e8e0cd]/40">
          <div className="container mx-auto max-w-3xl px-4 py-20 md:px-8 md:py-28">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#4a6741]">
              — Good to know —
            </p>
            <h2 className="mb-10 text-center text-3xl font-light tracking-tight md:text-5xl">
              Questions &amp; answers
            </h2>
            <LandingFaq items={c.faq} />
          </div>
        </section>
      )}

      {/* Order */}
      <section id="order-form" className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-[#a7c4a0]/20 blur-2xl" />
        <div className="container relative mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
          <div className="grid items-start gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#4a6741]">
                — The last step —
              </p>
              {c.finalCta.headline && (
                <h2 className="text-4xl font-light leading-tight tracking-tight md:text-6xl">
                  {c.finalCta.headline}
                </h2>
              )}
              {c.finalCta.subheadline && (
                <p className="mt-5 text-lg leading-relaxed text-[#5a6b5c]">
                  {c.finalCta.subheadline}
                </p>
              )}
            </div>
            <div
              className="bg-white p-7 shadow-xl md:p-9"
              style={{ borderRadius: "20px 30px 20px 30px" }}
            >
              {c.orderForm.title && (
                <h3 className="mb-2 text-2xl font-semibold tracking-tight text-[#2d3a2e]">
                  {c.orderForm.title}
                </h3>
              )}
              {c.orderForm.subtitle && (
                <p className="mb-5 text-sm text-[#5a6b5c]">
                  {c.orderForm.subtitle}
                </p>
              )}
              <LandingOrderForm
                product={product}
                ctaLabel={c.finalCta.ctaLabel || "Place order"}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
