import Image from "next/image";
import { Check, Star, ArrowRight, ShieldCheck } from "lucide-react";
import { YouTubeEmbed } from "@/components/landing/sections/youtube-embed";
import { LandingOrderForm } from "@/components/landing/sections/order-form";
import { LandingFaq } from "@/components/landing/sections/landing-faq";
import { Button } from "@/components/ui/button";
import type { TemplateProps } from "./types";

// SPLIT — Split-screen dramatic hero with full-bleed imagery.
// Modern fashion/apparel vibe with sharp edges and clean typography.

export function SplitTemplate({ landing, product }: TemplateProps) {
  const c = landing.content;

  return (
    <div className="overflow-x-hidden bg-white text-black">
      {/* Split hero — full viewport */}
      <section className="relative">
        <div className="grid min-h-[90vh] md:grid-cols-2">
          {/* Left — content */}
          <div className="flex flex-col justify-center bg-black px-6 py-16 text-white md:px-14 lg:px-20">
            {c.hero.eyebrow && (
              <div className="mb-6 flex items-center gap-3">
                <div className="h-px w-10 bg-white/40" />
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/60">
                  {c.hero.eyebrow}
                </p>
              </div>
            )}
            <h1 className="text-5xl font-light leading-[0.9] tracking-tight md:text-7xl lg:text-8xl">
              {c.hero.headline || product.name}
            </h1>
            {c.hero.subheadline && (
              <p className="mt-8 max-w-md text-base leading-relaxed text-white/70 md:text-lg">
                {c.hero.subheadline}
              </p>
            )}
            <div className="mt-10 flex items-end gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">
                  From
                </p>
                <p className="mt-1 text-4xl font-light tabular-nums md:text-5xl">
                  ৳{product.price.toLocaleString()}
                </p>
              </div>
              {c.hero.badge && (
                <span className="mb-2 border border-white/30 px-3 py-1 text-xs uppercase tracking-wider text-white/80">
                  {c.hero.badge}
                </span>
              )}
            </div>
            <Button
              asChild
              size="lg"
              className="mt-10 h-auto w-fit rounded-none border border-white bg-white px-10 py-5 text-sm font-medium uppercase tracking-[0.2em] text-black hover:bg-black hover:text-white"
            >
              <a href="#order-form">
                {c.hero.ctaLabel || "Order now"}
                <ArrowRight className="ml-3 h-4 w-4" />
              </a>
            </Button>
            {c.trustBadges.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/60">
                {c.trustBadges.map((b, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {b}
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* Right — image */}
          <div className="relative min-h-[60vh] bg-neutral-100 md:min-h-0">
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
      </section>

      {/* Video */}
      {landing.videoUrl && (
        <section className="bg-white">
          <div className="container mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
            <div className="mb-6 flex items-center justify-center gap-3">
              <div className="h-px w-10 bg-black/30" />
              <p className="text-xs uppercase tracking-[0.3em] text-black/60">
                The film
              </p>
              <div className="h-px w-10 bg-black/30" />
            </div>
            <YouTubeEmbed url={landing.videoUrl} title={landing.title} />
          </div>
        </section>
      )}

      {/* Benefits */}
      {c.benefits.length > 0 && (
        <section className="border-y border-black/10">
          <div className="container mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-32">
            <div className="mb-16 flex items-end justify-between">
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.3em] text-black/60">
                  01 — Features
                </p>
                <h2 className="text-4xl font-light leading-tight tracking-tight md:text-6xl">
                  The details
                </h2>
              </div>
            </div>
            <div className="grid gap-x-12 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
              {c.benefits.map((b, i) => (
                <div key={i} className="border-t border-black pt-6">
                  <p className="text-xs tabular-nums text-black/50">
                    — {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-2xl font-light tracking-tight">
                    {b.title}
                  </h3>
                  {b.body && (
                    <p className="mt-3 text-sm leading-relaxed text-black/60">
                      {b.body}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Highlights — full-bleed alternating */}
      {c.highlights.length > 0 && (
        <section>
          {c.highlights.map((h, i) => (
            <div
              key={i}
              className="grid min-h-[70vh] md:grid-cols-2"
              style={{
                direction: i % 2 === 1 ? "rtl" : "ltr",
              }}
            >
              <div
                className="relative min-h-[50vh] md:min-h-0"
                style={{ direction: "ltr" }}
              >
                {h.image && (
                  <Image
                    src={h.image}
                    alt={h.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
              <div
                className="flex flex-col justify-center bg-neutral-50 px-6 py-16 md:px-14 lg:px-20"
                style={{ direction: "ltr" }}
              >
                <p className="mb-4 text-xs uppercase tracking-[0.3em] text-black/50">
                  {String(i + 1).padStart(2, "0")} — Chapter
                </p>
                <h3 className="text-4xl font-light leading-[0.95] tracking-tight md:text-6xl">
                  {h.title}
                </h3>
                {h.body && (
                  <p className="mt-6 max-w-md text-base leading-relaxed text-black/60 md:text-lg">
                    {h.body}
                  </p>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Gallery — full-bleed grid */}
      {c.gallery.length > 0 && (
        <section className="border-t border-black/10">
          <div className="container mx-auto max-w-7xl px-0 py-20 md:py-28">
            <div className="mb-12 px-6 md:px-10">
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-black/60">
                02 — Gallery
              </p>
              <h2 className="text-4xl font-light leading-tight tracking-tight md:text-6xl">
                The collection
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-[1px] bg-black/10 md:grid-cols-3">
              {c.gallery.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/5] overflow-hidden bg-neutral-100"
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
        <section className="bg-black text-white">
          <div className="container mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-32">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/50">
              03 — Voices
            </p>
            <h2 className="mb-16 text-4xl font-light leading-tight tracking-tight md:text-6xl">
              What people say
            </h2>
            <div className="grid gap-12 md:grid-cols-3">
              {c.testimonials.map((t, i) => (
                <figure
                  key={i}
                  className="border-t border-white/30 pt-8"
                >
                  {t.rating && (
                    <div className="mb-4 flex gap-0.5 text-white">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </div>
                  )}
                  <blockquote className="text-lg font-light leading-relaxed md:text-xl">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 text-sm">
                    <span className="font-medium">{t.name}</span>
                    {t.location && (
                      <span className="text-white/50"> / {t.location}</span>
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
        <section className="border-t border-black/10">
          <div className="container mx-auto max-w-3xl px-6 py-20 md:px-10 md:py-28">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-black/60">
              04 — FAQ
            </p>
            <h2 className="mb-10 text-4xl font-light leading-tight tracking-tight md:text-6xl">
              Questions
            </h2>
            <LandingFaq items={c.faq} />
          </div>
        </section>
      )}

      {/* Order — split */}
      <section id="order-form" className="border-t border-black/10">
        <div className="grid md:grid-cols-2">
          <div className="flex flex-col justify-center bg-black px-6 py-16 text-white md:px-14 lg:px-20 lg:py-24">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/50">
              05 — Order
            </p>
            {c.finalCta.headline && (
              <h2 className="text-4xl font-light leading-[0.95] tracking-tight md:text-5xl lg:text-6xl">
                {c.finalCta.headline}
              </h2>
            )}
            {c.finalCta.subheadline && (
              <p className="mt-6 max-w-md text-base leading-relaxed text-white/70 md:text-lg">
                {c.finalCta.subheadline}
              </p>
            )}
            <div className="mt-10 flex items-center gap-5 border-t border-white/20 pt-8">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-neutral-900">
                {product.thumbnail && (
                  <Image
                    src={product.thumbnail}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
              <div>
                <p className="font-light">{product.name}</p>
                <p className="text-sm tabular-nums text-white/60">
                  ৳{product.price.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-neutral-50 px-6 py-16 md:px-14 lg:px-20 lg:py-24">
            {c.orderForm.title && (
              <h3 className="text-2xl font-light tracking-tight">
                {c.orderForm.title}
              </h3>
            )}
            {c.orderForm.subtitle && (
              <p className="mb-6 mt-2 text-sm text-black/60">
                {c.orderForm.subtitle}
              </p>
            )}
            <div className="mt-5">
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
