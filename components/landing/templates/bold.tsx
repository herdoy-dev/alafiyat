import Image from "next/image";
import { ArrowDown, Check, Sparkles, Star } from "lucide-react";
import { YouTubeEmbed } from "@/components/landing/sections/youtube-embed";
import { LandingOrderForm } from "@/components/landing/sections/order-form";
import { LandingFaq } from "@/components/landing/sections/landing-faq";
import { Button } from "@/components/ui/button";
import type { TemplateProps } from "./types";

export function BoldTemplate({ landing, product }: TemplateProps) {
  const c = landing.content;

  return (
    <div className="bg-background text-foreground">
      {/* Pre-hero video */}
      {landing.videoUrl && (
        <section className="bg-black py-10 md:py-16">
          <div className="container mx-auto max-w-5xl px-4 md:px-8">
            <YouTubeEmbed url={landing.videoUrl} title={landing.title} />
          </div>
        </section>
      )}

      {/* Hero — black bg, oversized type */}
      <section className="relative overflow-hidden bg-black text-white">
        {/* gradient blob */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-primary/30 blur-3xl"
        />
        <div className="container relative mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-32">
          <div className="grid items-center gap-12 md:grid-cols-12">
            <div className="md:col-span-7">
              {c.hero.eyebrow && (
                <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs font-medium uppercase tracking-[0.2em]">
                  <Sparkles className="h-3 w-3" />
                  {c.hero.eyebrow}
                </p>
              )}
              <h1 className="text-5xl font-black leading-[0.9] tracking-tight md:text-8xl">
                {c.hero.headline || product.name}
              </h1>
              {c.hero.subheadline && (
                <p className="mt-6 max-w-xl text-lg text-white/75 md:text-xl">
                  {c.hero.subheadline}
                </p>
              )}
              <div className="mt-8 flex flex-wrap items-baseline gap-5">
                <p className="bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-5xl font-black tabular-nums text-transparent md:text-6xl">
                  ৳{product.price.toLocaleString()}
                </p>
                {c.hero.badge && (
                  <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-black">
                    {c.hero.badge}
                  </span>
                )}
              </div>
              <Button
                asChild
                size="lg"
                className="mt-8 rounded-full bg-white text-base font-bold text-black hover:bg-white/90"
              >
                <a href="#order-form">
                  {c.hero.ctaLabel || "Order now"}
                  <ArrowDown className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
            <div className="md:col-span-5">
              <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/15 bg-white/5">
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
          </div>
        </div>
      </section>

      {/* Trust badges strip */}
      {c.trustBadges.length > 0 && (
        <section className="border-y border-border/60 bg-primary/5 py-5">
          <div className="container mx-auto max-w-6xl px-4 md:px-8">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium">
              {c.trustBadges.map((b, i) => (
                <span key={i} className="inline-flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  {b}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      {c.benefits.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto max-w-6xl px-4 md:px-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {c.benefits.map((b, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/[0.08] via-background to-background p-7 ring-1 ring-border/60"
                >
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl transition-opacity group-hover:opacity-100" />
                  <div className="relative">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                      <Check className="h-6 w-6" />
                    </span>
                    <h3 className="mt-5 text-xl font-bold">{b.title}</h3>
                    {b.body && (
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {b.body}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Highlights — alternating */}
      {c.highlights.length > 0 && (
        <section className="bg-muted/40 py-16 md:py-24">
          <div className="container mx-auto max-w-6xl space-y-16 px-4 md:px-8 md:space-y-24">
            {c.highlights.map((h, i) => (
              <div
                key={i}
                className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                {h.image && (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
                    <Image
                      src={h.image}
                      alt={h.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-4xl font-black leading-tight tracking-tight md:text-5xl">
                    {h.title}
                  </h3>
                  {h.body && (
                    <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
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
        <section className="py-16 md:py-24">
          <div className="container mx-auto max-w-6xl px-4 md:px-8">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {c.gallery.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-2xl"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover transition-transform hover:scale-105"
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
        <section className="bg-black py-20 text-white md:py-28">
          <div className="container mx-auto max-w-6xl px-4 md:px-8">
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.3em] text-white/60">
              Customer love
            </p>
            <h2 className="mb-12 text-center text-4xl font-black md:text-6xl">
              People are talking
            </h2>
            <div className="grid gap-5 md:grid-cols-3">
              {c.testimonials.map((t, i) => (
                <figure
                  key={i}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-7"
                >
                  {t.rating && (
                    <div className="mb-3 flex gap-0.5 text-yellow-400">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  )}
                  <blockquote className="text-base leading-relaxed">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-5 text-sm">
                    <span className="font-bold">{t.name}</span>
                    {t.location && (
                      <span className="text-white/50"> · {t.location}</span>
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
        <section className="py-16 md:py-24">
          <div className="container mx-auto max-w-3xl px-4 md:px-8">
            <h2 className="mb-8 text-center text-4xl font-black tracking-tight md:text-5xl">
              FAQ
            </h2>
            <LandingFaq items={c.faq} />
          </div>
        </section>
      )}

      {/* Final CTA + Order form */}
      <section
        id="order"
        className="bg-gradient-to-b from-primary/[0.08] via-background to-background"
      >
        <div className="container mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
          <div className="grid items-start gap-12 md:grid-cols-2">
            <div>
              {c.finalCta.headline && (
                <h2 className="text-5xl font-black leading-[0.95] tracking-tight md:text-6xl">
                  {c.finalCta.headline}
                </h2>
              )}
              {c.finalCta.subheadline && (
                <p className="mt-5 text-lg text-muted-foreground">
                  {c.finalCta.subheadline}
                </p>
              )}
            </div>
            <div>
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
