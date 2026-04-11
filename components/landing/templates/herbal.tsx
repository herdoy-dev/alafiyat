import Image from "next/image";
import { Leaf, Star, ShieldCheck } from "lucide-react";
import { YouTubeEmbed } from "@/components/landing/sections/youtube-embed";
import { LandingOrderForm } from "@/components/landing/sections/order-form";
import { LandingFaq } from "@/components/landing/sections/landing-faq";
import { Button } from "@/components/ui/button";
import type { TemplateProps } from "./types";

// HERBAL — Sage green and cream, botanical gentle curves.
// For herbal teas, infusions, wellness blends.

export function HerbalTemplate({ landing, product }: TemplateProps) {
  const c = landing.content;

  return (
    <div className="overflow-x-hidden bg-[#f7f4ed] text-[#2d3a2b]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-20 -top-10 h-48 w-48 rounded-full bg-[#c8d5b9]/40 blur-3xl md:h-80 md:w-80" />
        <div className="pointer-events-none absolute bottom-0 -left-20 h-40 w-40 rounded-full bg-[#d4b896]/30 blur-3xl md:h-64 md:w-64" />

        <div className="container relative mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-20 lg:py-28">
          <div className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
            <div className="md:col-span-6 md:order-1 order-2 text-center md:text-left">
              {c.hero.eyebrow && (
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#8ba888]/15 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-[#4a6b47] md:text-xs">
                  <Leaf className="h-3 w-3" />
                  {c.hero.eyebrow}
                </div>
              )}
              <h1 className="text-3xl font-light leading-[1.05] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                {c.hero.headline || product.name}
              </h1>
              {c.hero.subheadline && (
                <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[#5a6b5a] md:mx-0 md:mt-6 md:text-lg">
                  {c.hero.subheadline}
                </p>
              )}
              <div className="mt-6 flex flex-wrap items-baseline justify-center gap-3 md:mt-8 md:justify-start md:gap-4">
                <p className="text-3xl font-light tabular-nums md:text-4xl lg:text-5xl">
                  ৳{product.price.toLocaleString()}
                </p>
                {c.hero.badge && (
                  <span className="rounded-full bg-[#d4b896]/25 px-3 py-1 text-xs font-medium text-[#8b5e2b]">
                    {c.hero.badge}
                  </span>
                )}
              </div>
              <Button
                asChild
                size="lg"
                className="mt-6 rounded-full bg-[#4a6b47] px-8 text-white shadow-lg shadow-[#4a6b47]/20 hover:bg-[#3a5538] md:mt-8"
              >
                <a href="#order-form">{c.hero.ctaLabel || "Order now"}</a>
              </Button>
              {c.trustBadges.length > 0 && (
                <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-[#5a6b5a] md:justify-start">
                  {c.trustBadges.map((b, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#8ba888]" />
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="md:col-span-6 md:order-2 order-1">
              <div className="relative mx-auto max-w-sm md:max-w-none">
                <div
                  className="relative aspect-square overflow-hidden bg-[#e8e0cd] shadow-xl"
                  style={{
                    borderRadius: "62% 38% 55% 45% / 55% 45% 55% 45%",
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
                <div className="pointer-events-none absolute -right-2 -top-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#8ba888] text-white shadow-md md:h-14 md:w-14">
                  <Leaf className="h-5 w-5 md:h-6 md:w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video */}
      {landing.videoUrl && (
        <section className="bg-[#e8e0cd]/30">
          <div className="container mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-20">
            <p className="mb-4 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-[#4a6b47] md:text-xs">
              Watch our story
            </p>
            <YouTubeEmbed url={landing.videoUrl} title={landing.title} />
          </div>
        </section>
      )}

      {/* Benefits */}
      {c.benefits.length > 0 && (
        <section>
          <div className="container mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-24">
            <div className="mb-10 text-center md:mb-14">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#4a6b47] md:text-xs">
                — Naturally good —
              </p>
              <h2 className="text-3xl font-light tracking-tight md:text-5xl">
                Every cup, a gift
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {c.benefits.map((b, i) => (
                <div
                  key={i}
                  className="group overflow-hidden bg-white p-6 shadow-sm transition-shadow hover:shadow-lg md:p-8"
                  style={{
                    borderRadius: "32% 68% 48% 52% / 48% 52% 68% 32%",
                  }}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#c8d5b9]/50 text-[#4a6b47] transition-transform group-hover:scale-110">
                    <Leaf className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#2d3a2b] md:text-xl">
                    {b.title}
                  </h3>
                  {b.body && (
                    <p className="mt-2 text-sm leading-relaxed text-[#5a6b5a]">
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
        <section className="relative overflow-hidden bg-[#e8e0cd]/30">
          <div className="pointer-events-none absolute right-0 top-0 h-60 w-60 rounded-full bg-[#8ba888]/10 blur-3xl md:h-96 md:w-96" />
          <div className="container relative mx-auto max-w-6xl space-y-14 px-4 py-14 md:space-y-24 md:px-8 md:py-24">
            {c.highlights.map((h, i) => (
              <div
                key={i}
                className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                <div>
                  {h.image && (
                    <div
                      className="relative aspect-square overflow-hidden shadow-xl"
                      style={{
                        borderRadius:
                          i % 2 === 0
                            ? "58% 42% 52% 48% / 50% 58% 42% 50%"
                            : "42% 58% 48% 52% / 58% 42% 58% 42%",
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
                <div className="text-center md:text-left">
                  <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#4a6b47] md:text-xs">
                    — Part {String(i + 1).padStart(2, "0")} —
                  </p>
                  <h3 className="text-2xl font-light leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
                    {h.title}
                  </h3>
                  {h.body && (
                    <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[#5a6b5a] md:mx-0 md:mt-6 md:text-lg">
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
          <div className="container mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
            <p className="mb-8 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-[#4a6b47] md:text-xs">
              — Moments —
            </p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
              {c.gallery.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden bg-[#e8e0cd] shadow-md"
                  style={{
                    borderRadius:
                      i % 3 === 0
                        ? "48% 52% 52% 48% / 52% 48% 52% 48%"
                        : i % 3 === 1
                          ? "52% 48% 48% 52% / 48% 52% 48% 52%"
                          : "55% 45% 52% 48% / 50% 52% 48% 50%",
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
        <section className="bg-[#4a6b47] text-white">
          <div className="container mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-24">
            <div className="mb-10 text-center md:mb-14">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#c8d5b9] md:text-xs">
                — Steeped in love —
              </p>
              <h2 className="text-3xl font-light tracking-tight md:text-5xl">
                From our tea drinkers
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {c.testimonials.map((t, i) => (
                <figure
                  key={i}
                  className="rounded-3xl bg-white/5 p-6 backdrop-blur-sm md:p-7"
                >
                  {t.rating && (
                    <div className="mb-3 flex gap-0.5 text-[#d4b896]">
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
                      <span className="text-[#c8d5b9]"> · {t.location}</span>
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
        <section className="bg-[#e8e0cd]/30">
          <div className="container mx-auto max-w-3xl px-4 py-14 md:px-8 md:py-24">
            <p className="mb-3 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-[#4a6b47] md:text-xs">
              — Good to know —
            </p>
            <h2 className="mb-8 text-center text-3xl font-light tracking-tight md:mb-10 md:text-5xl">
              Questions &amp; answers
            </h2>
            <LandingFaq items={c.faq} />
          </div>
        </section>
      )}

      {/* Order */}
      <section id="order-form" className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-[#c8d5b9]/30 blur-3xl md:h-80 md:w-80" />
        <div className="container relative mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-24">
          <div className="grid items-start gap-10 md:grid-cols-2 md:gap-14">
            <div className="text-center md:text-left">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#4a6b47] md:text-xs">
                — Ready to steep —
              </p>
              {c.finalCta.headline && (
                <h2 className="text-3xl font-light leading-tight tracking-tight md:text-5xl lg:text-6xl">
                  {c.finalCta.headline}
                </h2>
              )}
              {c.finalCta.subheadline && (
                <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[#5a6b5a] md:mx-0 md:mt-6 md:text-lg">
                  {c.finalCta.subheadline}
                </p>
              )}
            </div>
            <div
              className="bg-white p-6 shadow-xl md:p-8"
              style={{ borderRadius: "24px 36px 24px 36px" }}
            >
              {c.orderForm.title && (
                <h3 className="mb-2 text-xl font-semibold tracking-tight md:text-2xl">
                  {c.orderForm.title}
                </h3>
              )}
              {c.orderForm.subtitle && (
                <p className="mb-5 text-sm text-[#5a6b5a]">
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
