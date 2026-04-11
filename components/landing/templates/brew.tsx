import Image from "next/image";
import { Coffee, Star, Flame } from "lucide-react";
import { YouTubeEmbed } from "@/components/landing/sections/youtube-embed";
import { LandingOrderForm } from "@/components/landing/sections/order-form";
import { LandingFaq } from "@/components/landing/sections/landing-faq";
import { Button } from "@/components/ui/button";
import type { TemplateProps } from "./types";

// BREW — Warm coffee browns and caramels, cozy cafe vibes.
// For coffee, chai, masala tea, warm beverages.

export function BrewTemplate({ landing, product }: TemplateProps) {
  const c = landing.content;

  return (
    <div className="overflow-x-hidden bg-[#fdf8f3] text-[#2a1810]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#8b5a2b]/15">
        <div className="pointer-events-none absolute -right-20 -top-10 h-48 w-48 rounded-full bg-[#c4925f]/30 blur-3xl md:h-72 md:w-72" />

        <div className="container relative mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-20 lg:py-28">
          <div className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
            <div className="md:col-span-7 md:order-1 order-2 text-center md:text-left">
              {c.hero.eyebrow && (
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#8b5a2b]/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#6b3d1a] md:text-xs">
                  <Coffee className="h-3 w-3" />
                  {c.hero.eyebrow}
                </div>
              )}
              <h1
                className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {c.hero.headline || product.name}
              </h1>
              {c.hero.subheadline && (
                <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[#6b5243] md:mx-0 md:mt-6 md:text-lg">
                  {c.hero.subheadline}
                </p>
              )}
              <div className="mt-6 flex flex-wrap items-baseline justify-center gap-3 md:mt-8 md:justify-start md:gap-4">
                <p
                  className="text-3xl font-bold tabular-nums md:text-4xl lg:text-5xl"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  ৳{product.price.toLocaleString()}
                </p>
                {c.hero.badge && (
                  <span className="rounded-full bg-[#c4925f]/20 px-3 py-1 text-xs font-semibold text-[#6b3d1a]">
                    {c.hero.badge}
                  </span>
                )}
              </div>
              <Button
                asChild
                size="lg"
                className="mt-6 rounded-full bg-[#6b3d1a] px-8 text-[#fdf8f3] shadow-lg shadow-[#6b3d1a]/25 hover:bg-[#4a2a12] md:mt-8"
              >
                <a href="#order-form">{c.hero.ctaLabel || "Order now"}</a>
              </Button>
            </div>
            <div className="md:col-span-5 md:order-2 order-1">
              <div className="relative mx-auto max-w-xs md:max-w-none">
                <div className="relative aspect-square overflow-hidden rounded-3xl border-4 border-[#8b5a2b]/20 bg-[#ece0d1] shadow-2xl">
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
                <div className="pointer-events-none absolute -right-3 -top-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#6b3d1a] text-[#fdf8f3] shadow-lg md:h-16 md:w-16">
                  <Flame className="h-6 w-6 md:h-7 md:w-7" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video */}
      {landing.videoUrl && (
        <section className="border-b border-[#8b5a2b]/15 bg-[#ece0d1]/40">
          <div className="container mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-20">
            <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6b3d1a] md:text-xs">
              — Watch the brew —
            </p>
            <YouTubeEmbed url={landing.videoUrl} title={landing.title} />
          </div>
        </section>
      )}

      {/* Benefits */}
      {c.benefits.length > 0 && (
        <section className="border-b border-[#8b5a2b]/15">
          <div className="container mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-24">
            <div className="mb-10 text-center md:mb-14">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6b3d1a] md:text-xs">
                — Why it hits —
              </p>
              <h2
                className="text-3xl font-bold tracking-tight md:text-5xl"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Every sip, a story
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {c.benefits.map((b, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-[#8b5a2b]/20 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg md:p-8"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#c4925f]/20 text-[#6b3d1a]">
                    <Coffee className="h-5 w-5" />
                  </div>
                  <h3
                    className="text-xl font-bold md:text-2xl"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {b.title}
                  </h3>
                  {b.body && (
                    <p className="mt-3 text-sm leading-relaxed text-[#6b5243]">
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
        <section className="border-b border-[#8b5a2b]/15 bg-[#ece0d1]/30">
          <div className="container mx-auto max-w-6xl space-y-16 px-4 py-14 md:space-y-28 md:px-8 md:py-24">
            {c.highlights.map((h, i) => (
              <div
                key={i}
                className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                <div>
                  {h.image && (
                    <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border-4 border-white bg-[#ece0d1] shadow-xl">
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
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6b3d1a] md:text-xs">
                    — Part {String(i + 1).padStart(2, "0")} —
                  </p>
                  <h3
                    className="text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {h.title}
                  </h3>
                  {h.body && (
                    <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[#6b5243] md:mx-0 md:mt-5 md:text-lg">
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
        <section className="border-b border-[#8b5a2b]/15">
          <div className="container mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
            <p className="mb-8 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6b3d1a] md:text-xs">
              — Moments in a cup —
            </p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
              {c.gallery.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-2xl border-2 border-[#8b5a2b]/20 bg-[#ece0d1]"
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
        <section className="border-b border-[#8b5a2b]/15 bg-[#2a1810] text-[#fdf8f3]">
          <div className="container mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-24">
            <div className="mb-10 text-center md:mb-14">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c4925f] md:text-xs">
                — From the cafe —
              </p>
              <h2
                className="text-3xl font-bold tracking-tight md:text-5xl"
                style={{ fontFamily: "Georgia, serif" }}
              >
                What they&apos;re saying
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {c.testimonials.map((t, i) => (
                <figure
                  key={i}
                  className="rounded-2xl border border-[#c4925f]/20 bg-white/5 p-6 backdrop-blur-sm md:p-7"
                >
                  {t.rating && (
                    <div className="mb-3 flex gap-0.5 text-[#c4925f]">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  )}
                  <blockquote
                    className="text-base italic leading-relaxed"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4 text-sm">
                    <span className="font-semibold">— {t.name}</span>
                    {t.location && (
                      <span className="text-[#c4925f]"> · {t.location}</span>
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
        <section className="border-b border-[#8b5a2b]/15 bg-[#ece0d1]/30">
          <div className="container mx-auto max-w-3xl px-4 py-14 md:px-8 md:py-24">
            <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6b3d1a] md:text-xs">
              — Curious minds —
            </p>
            <h2
              className="mb-8 text-center text-3xl font-bold tracking-tight md:mb-10 md:text-5xl"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Common questions
            </h2>
            <LandingFaq items={c.faq} />
          </div>
        </section>
      )}

      {/* Order */}
      <section id="order-form">
        <div className="container mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-24">
          <div className="grid items-start gap-10 md:grid-cols-2 md:gap-14">
            <div className="text-center md:text-left">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6b3d1a] md:text-xs">
                — Time to brew —
              </p>
              {c.finalCta.headline && (
                <h2
                  className="text-3xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {c.finalCta.headline}
                </h2>
              )}
              {c.finalCta.subheadline && (
                <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[#6b5243] md:mx-0 md:mt-6 md:text-lg">
                  {c.finalCta.subheadline}
                </p>
              )}
              {c.trustBadges.length > 0 && (
                <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
                  {c.trustBadges.map((b, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#8b5a2b]/30 bg-white px-3 py-1.5 text-xs font-semibold text-[#6b3d1a]"
                    >
                      <Coffee className="h-3 w-3" />
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="rounded-3xl border border-[#8b5a2b]/20 bg-white p-6 shadow-xl md:p-8">
              {c.orderForm.title && (
                <h3
                  className="mb-2 text-xl font-bold tracking-tight md:text-2xl"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {c.orderForm.title}
                </h3>
              )}
              {c.orderForm.subtitle && (
                <p className="mb-5 text-sm text-[#6b5243]">
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
