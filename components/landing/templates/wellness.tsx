import Image from "next/image";
import { Droplets, Check, Star, Heart } from "lucide-react";
import { YouTubeEmbed } from "@/components/landing/sections/youtube-embed";
import { LandingOrderForm } from "@/components/landing/sections/order-form";
import { LandingFaq } from "@/components/landing/sections/landing-faq";
import { Button } from "@/components/ui/button";
import type { TemplateProps } from "./types";

// WELLNESS — Clean whites, pale mint, clinical credibility with warmth.
// For detox teas, wellness blends, health-focused products.

export function WellnessTemplate({ landing, product }: TemplateProps) {
  const c = landing.content;

  return (
    <div className="overflow-x-hidden bg-white text-[#1a2e2a]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#e8f4f0] to-white">
        <div className="container relative mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-20 lg:py-28">
          <div className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
            <div className="md:col-span-7 md:order-1 order-2 text-center md:text-left">
              {c.hero.eyebrow && (
                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#4ea896]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#2d7a68] md:text-xs">
                  <Droplets className="h-3 w-3" />
                  {c.hero.eyebrow}
                </div>
              )}
              <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                {c.hero.headline || product.name}
              </h1>
              {c.hero.subheadline && (
                <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-[#4a5e5a] md:mx-0 md:mt-6 md:text-lg lg:text-xl">
                  {c.hero.subheadline}
                </p>
              )}
              <div className="mt-6 flex flex-wrap items-baseline justify-center gap-3 md:mt-8 md:justify-start md:gap-4">
                <p className="text-3xl font-bold tabular-nums text-[#2d7a68] md:text-4xl lg:text-5xl">
                  ৳{product.price.toLocaleString()}
                </p>
                {c.hero.badge && (
                  <span className="rounded-full bg-[#4ea896]/10 px-3 py-1 text-xs font-bold text-[#2d7a68]">
                    {c.hero.badge}
                  </span>
                )}
              </div>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3 md:mt-9 md:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-[#2d7a68] px-8 text-white shadow-lg shadow-[#2d7a68]/25 hover:bg-[#1f5a4c]"
                >
                  <a href="#order-form">{c.hero.ctaLabel || "Order now"}</a>
                </Button>
              </div>
              {c.trustBadges.length > 0 && (
                <div className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-[#4a5e5a] md:mt-8 md:justify-start">
                  {c.trustBadges.map((b, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-[#4ea896]" />
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="md:col-span-5 md:order-2 order-1">
              <div className="relative mx-auto max-w-xs md:max-w-none">
                <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#e8f4f0] shadow-2xl">
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
                {/* Floating badge */}
                <div className="absolute -right-2 -top-2 rounded-2xl bg-white px-4 py-3 shadow-xl md:-right-4 md:-top-4 md:px-5 md:py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4ea896]/10 text-[#2d7a68] md:h-10 md:w-10">
                      <Heart className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#4a5e5a] md:text-[11px]">
                        Trusted by
                      </p>
                      <p className="text-xs font-bold text-[#1a2e2a] md:text-sm">
                        10,000+
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video */}
      {landing.videoUrl && (
        <section className="border-t border-[#e8f4f0] bg-white">
          <div className="container mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-20">
            <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2d7a68] md:text-xs">
              — Watch the science —
            </p>
            <YouTubeEmbed url={landing.videoUrl} title={landing.title} />
          </div>
        </section>
      )}

      {/* Benefits */}
      {c.benefits.length > 0 && (
        <section className="border-t border-[#e8f4f0]">
          <div className="container mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-24">
            <div className="mb-10 text-center md:mb-14">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2d7a68] md:text-xs">
                — How it works —
              </p>
              <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
                Benefits you&apos;ll feel
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {c.benefits.map((b, i) => (
                <div
                  key={i}
                  className="rounded-3xl border-2 border-[#e8f4f0] bg-white p-6 transition-all hover:border-[#4ea896]/40 hover:shadow-lg md:p-8"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4ea896]/10 text-[#2d7a68]">
                    <span className="text-xl font-bold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold md:text-xl">{b.title}</h3>
                  {b.body && (
                    <p className="mt-2 text-sm leading-relaxed text-[#4a5e5a]">
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
        <section className="border-t border-[#e8f4f0] bg-[#e8f4f0]/40">
          <div className="container mx-auto max-w-6xl space-y-14 px-4 py-14 md:space-y-24 md:px-8 md:py-24">
            {c.highlights.map((h, i) => (
              <div
                key={i}
                className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                <div>
                  {h.image && (
                    <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-white shadow-xl">
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
                <div className="text-center md:text-left">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2d7a68] md:text-xs">
                    — Step {String(i + 1).padStart(2, "0")} —
                  </p>
                  <h3 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
                    {h.title}
                  </h3>
                  {h.body && (
                    <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[#4a5e5a] md:mx-0 md:mt-5 md:text-lg">
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
        <section className="border-t border-[#e8f4f0]">
          <div className="container mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
            <p className="mb-8 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2d7a68] md:text-xs">
              — Gallery —
            </p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
              {c.gallery.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-2xl bg-[#e8f4f0]"
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
        <section className="border-t border-[#e8f4f0] bg-[#2d7a68] text-white">
          <div className="container mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-24">
            <div className="mb-10 text-center md:mb-14">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a7d4c6] md:text-xs">
                — Real results —
              </p>
              <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
                What people say
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {c.testimonials.map((t, i) => (
                <figure
                  key={i}
                  className="rounded-3xl bg-white/10 p-6 backdrop-blur-sm md:p-7"
                >
                  {t.rating && (
                    <div className="mb-3 flex gap-0.5 text-[#d4a574]">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  )}
                  <blockquote className="text-base italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4 text-sm">
                    <span className="font-semibold">— {t.name}</span>
                    {t.location && (
                      <span className="text-[#a7d4c6]"> · {t.location}</span>
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
        <section className="border-t border-[#e8f4f0]">
          <div className="container mx-auto max-w-3xl px-4 py-14 md:px-8 md:py-24">
            <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2d7a68] md:text-xs">
              — Learn more —
            </p>
            <h2 className="mb-8 text-center text-3xl font-bold tracking-tight md:mb-10 md:text-5xl">
              Common questions
            </h2>
            <LandingFaq items={c.faq} />
          </div>
        </section>
      )}

      {/* Order */}
      <section
        id="order-form"
        className="border-t border-[#e8f4f0] bg-gradient-to-b from-white to-[#e8f4f0]/40"
      >
        <div className="container mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-24">
          <div className="grid items-start gap-10 md:grid-cols-2 md:gap-14">
            <div className="text-center md:text-left">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2d7a68] md:text-xs">
                — Start your journey —
              </p>
              {c.finalCta.headline && (
                <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                  {c.finalCta.headline}
                </h2>
              )}
              {c.finalCta.subheadline && (
                <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[#4a5e5a] md:mx-0 md:mt-6 md:text-lg">
                  {c.finalCta.subheadline}
                </p>
              )}
              <div className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-10">
                {[
                  "Natural ingredients",
                  "No artificial flavors",
                  "Cash on delivery",
                  "Free shipping",
                ].map((b, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-xl border border-[#e8f4f0] bg-white p-3 text-sm text-[#1a2e2a]"
                  >
                    <Check className="h-4 w-4 shrink-0 text-[#4ea896]" />
                    {b}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border-2 border-[#e8f4f0] bg-white p-6 shadow-xl md:p-8">
              {c.orderForm.title && (
                <h3 className="mb-2 text-xl font-bold tracking-tight md:text-2xl">
                  {c.orderForm.title}
                </h3>
              )}
              {c.orderForm.subtitle && (
                <p className="mb-5 text-sm text-[#4a5e5a]">
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
