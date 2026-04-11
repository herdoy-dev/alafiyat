import Image from "next/image";
import { Circle, Star } from "lucide-react";
import { YouTubeEmbed } from "@/components/landing/sections/youtube-embed";
import { LandingOrderForm } from "@/components/landing/sections/order-form";
import { LandingFaq } from "@/components/landing/sections/landing-faq";
import { Button } from "@/components/ui/button";
import type { TemplateProps } from "./types";

// MATCHA — Japanese-inspired minimalism with vibrant matcha green,
// circular elements, brush stroke accents, generous whitespace.
// For green tea, matcha, oolong.

export function MatchaTemplate({ landing, product }: TemplateProps) {
  const c = landing.content;

  return (
    <div
      className="overflow-x-hidden bg-[#f5f7f2] text-[#1f2a1d]"
      style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}
    >
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-20 right-10 h-40 w-40 rounded-full bg-[#7ba05b]/30 blur-2xl md:h-64 md:w-64" />

        <div className="container relative mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-20 lg:py-28">
          <div className="text-center">
            {/* Circular seal */}
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#7ba05b] bg-[#7ba05b]/10 text-[#4a6b27] md:mb-8 md:h-20 md:w-20">
              <Circle className="h-6 w-6 fill-current md:h-8 md:w-8" />
            </div>
            {c.hero.eyebrow && (
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.25em] text-[#7ba05b] md:text-xs">
                — {c.hero.eyebrow} —
              </p>
            )}
            <h1 className="mx-auto max-w-3xl text-4xl font-light leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
              {c.hero.headline || product.name}
            </h1>
            {c.hero.subheadline && (
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#5a6b55] md:mt-7 md:text-lg lg:text-xl">
                {c.hero.subheadline}
              </p>
            )}

            {/* Product image — large circle */}
            <div className="my-10 md:my-14">
              <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-full border-4 border-[#7ba05b]/20 bg-[#e8ede2] shadow-2xl md:max-w-md">
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
            </div>

            <div className="flex flex-wrap items-baseline justify-center gap-3 md:gap-4">
              <p className="text-3xl font-light tabular-nums md:text-5xl">
                ৳{product.price.toLocaleString()}
              </p>
              {c.hero.badge && (
                <span className="rounded-full border border-[#7ba05b] bg-[#7ba05b]/10 px-3 py-1 text-xs font-medium text-[#4a6b27]">
                  {c.hero.badge}
                </span>
              )}
            </div>
            <Button
              asChild
              size="lg"
              className="mt-7 rounded-full bg-[#4a6b27] px-10 text-white shadow-lg shadow-[#4a6b27]/25 hover:bg-[#3a5520] md:mt-9"
            >
              <a href="#order-form">{c.hero.ctaLabel || "Order now"}</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Video */}
      {landing.videoUrl && (
        <section className="bg-[#e8ede2]/40">
          <div className="container mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-20">
            <p className="mb-4 text-center text-[11px] font-medium uppercase tracking-[0.25em] text-[#7ba05b] md:text-xs">
              — The ceremony —
            </p>
            <YouTubeEmbed url={landing.videoUrl} title={landing.title} />
          </div>
        </section>
      )}

      {/* Benefits — circular cards */}
      {c.benefits.length > 0 && (
        <section>
          <div className="container mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-24">
            <div className="mb-10 text-center md:mb-16">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.25em] text-[#7ba05b] md:text-xs">
                — Benefits —
              </p>
              <h2 className="text-3xl font-light tracking-tight md:text-5xl">
                Why our green
              </h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {c.benefits.map((b, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center"
                >
                  <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#7ba05b]/30 bg-[#7ba05b]/5 text-[#4a6b27] md:h-24 md:w-24">
                    <span className="text-2xl font-light md:text-3xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-xl font-light tracking-tight md:text-2xl">
                    {b.title}
                  </h3>
                  {b.body && (
                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#5a6b55]">
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
        <section className="bg-[#e8ede2]/40">
          <div className="container mx-auto max-w-6xl space-y-16 px-4 py-14 md:space-y-28 md:px-8 md:py-24">
            {c.highlights.map((h, i) => (
              <div
                key={i}
                className={`grid items-center gap-8 md:grid-cols-2 md:gap-16 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                <div className="flex justify-center">
                  {h.image && (
                    <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-full border-4 border-white bg-[#e8ede2] shadow-xl md:max-w-md">
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
                  <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.25em] text-[#7ba05b] md:text-xs">
                    — Chapter {String(i + 1).padStart(2, "0")} —
                  </p>
                  <h3 className="text-2xl font-light leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
                    {h.title}
                  </h3>
                  {h.body && (
                    <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[#5a6b55] md:mx-0 md:mt-6 md:text-lg">
                      {h.body}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gallery — circular tiles */}
      {c.gallery.length > 0 && (
        <section>
          <div className="container mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
            <p className="mb-8 text-center text-[11px] font-medium uppercase tracking-[0.25em] text-[#7ba05b] md:text-xs">
              — Gallery —
            </p>
            <div className="grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-4 md:gap-8">
              {c.gallery.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-full border-4 border-white bg-[#e8ede2] shadow-md"
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
        <section className="bg-[#4a6b27] text-white">
          <div className="container mx-auto max-w-4xl px-4 py-14 md:px-8 md:py-24">
            <div className="mb-10 text-center md:mb-14">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.25em] text-[#c8d5b9] md:text-xs">
                — Kind words —
              </p>
              <h2 className="text-3xl font-light tracking-tight md:text-5xl">
                From our tea circle
              </h2>
            </div>
            <div className="space-y-10 md:space-y-14">
              {c.testimonials.map((t, i) => (
                <figure key={i} className="text-center">
                  {t.rating && (
                    <div className="mb-4 flex justify-center gap-0.5 text-[#d4b896]">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  )}
                  <blockquote className="mx-auto max-w-2xl text-lg font-light italic leading-relaxed md:text-2xl lg:text-3xl">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 text-sm md:text-base">
                    <span className="font-medium">— {t.name}</span>
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
        <section>
          <div className="container mx-auto max-w-3xl px-4 py-14 md:px-8 md:py-24">
            <div className="mb-8 text-center md:mb-12">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.25em] text-[#7ba05b] md:text-xs">
                — Common questions —
              </p>
              <h2 className="text-3xl font-light tracking-tight md:text-5xl">
                You asked
              </h2>
            </div>
            <LandingFaq items={c.faq} />
          </div>
        </section>
      )}

      {/* Order */}
      <section id="order-form" className="relative overflow-hidden bg-[#e8ede2]/40">
        <div className="pointer-events-none absolute -right-20 top-10 h-48 w-48 rounded-full bg-[#7ba05b]/20 blur-3xl md:h-80 md:w-80" />
        <div className="container relative mx-auto max-w-5xl px-4 py-14 md:px-8 md:py-24">
          <div className="grid items-start gap-10 md:grid-cols-2 md:gap-14">
            <div className="text-center md:text-left">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.25em] text-[#7ba05b] md:text-xs">
                — The final step —
              </p>
              {c.finalCta.headline && (
                <h2 className="text-3xl font-light leading-tight tracking-tight md:text-5xl lg:text-6xl">
                  {c.finalCta.headline}
                </h2>
              )}
              {c.finalCta.subheadline && (
                <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[#5a6b55] md:mx-0 md:mt-6 md:text-lg">
                  {c.finalCta.subheadline}
                </p>
              )}
              {c.trustBadges.length > 0 && (
                <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
                  {c.trustBadges.map((b, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-[#7ba05b]/30 bg-white px-3 py-1.5 text-xs font-medium text-[#4a6b27]"
                    >
                      ✓ {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-xl md:p-8">
              {c.orderForm.title && (
                <h3 className="mb-2 text-xl font-semibold tracking-tight md:text-2xl">
                  {c.orderForm.title}
                </h3>
              )}
              {c.orderForm.subtitle && (
                <p className="mb-5 text-sm text-[#5a6b55]">
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
