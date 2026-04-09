import Image from "next/image";
import { Check, ShieldCheck, Star } from "lucide-react";
import { YouTubeEmbed } from "@/components/landing/sections/youtube-embed";
import { LandingOrderForm } from "@/components/landing/sections/order-form";
import { LandingFaq } from "@/components/landing/sections/landing-faq";
import { Button } from "@/components/ui/button";
import type { TemplateProps } from "./types";

export function ClassicTemplate({ landing, product }: TemplateProps) {
  const c = landing.content;

  return (
    <div className="overflow-x-hidden bg-background text-foreground">
      {/* Pre-hero video */}
      {landing.videoUrl && (
        <section className="border-b border-border/60 bg-muted/30">
          <div className="container mx-auto max-w-5xl px-4 py-10 md:px-8 md:py-16">
            <p className="mb-4 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Watch the story
            </p>
            <YouTubeEmbed url={landing.videoUrl} title={landing.title} />
          </div>
        </section>
      )}

      {/* Hero */}
      <section className="border-b border-border/60">
        <div className="container mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
            <div className="md:col-span-6">
              {c.hero.eyebrow && (
                <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {c.hero.eyebrow}
                </p>
              )}
              <h1 className="text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                {c.hero.headline || product.name}
              </h1>
              {c.hero.subheadline && (
                <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
                  {c.hero.subheadline}
                </p>
              )}
              <div className="mt-7 flex flex-wrap items-baseline gap-4">
                <p className="text-2xl font-semibold tabular-nums sm:text-3xl md:text-4xl">
                  ৳{product.price.toLocaleString()}
                </p>
                {c.hero.badge && (
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {c.hero.badge}
                  </span>
                )}
              </div>
              <Button asChild size="lg" className="mt-7 rounded-full">
                <a href="#order-form">{c.hero.ctaLabel || "Order now"}</a>
              </Button>
              {c.trustBadges.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                  {c.trustBadges.map((b, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="md:col-span-6">
              <div className="relative aspect-square overflow-hidden rounded-3xl border border-border/60 bg-muted shadow-xl">
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

      {/* Benefits */}
      {c.benefits.length > 0 && (
        <section className="border-b border-border/60">
          <div className="container mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {c.benefits.map((b, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border/60 bg-card p-6"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{b.title}</h3>
                  {b.body && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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
        <section className="border-b border-border/60">
          <div className="container mx-auto max-w-6xl space-y-16 px-4 py-14 md:px-8 md:py-20 md:space-y-24">
            {c.highlights.map((h, i) => (
              <div
                key={i}
                className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                <div>
                  {h.image && (
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/60 bg-muted">
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
                  <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
                    {h.title}
                  </h3>
                  {h.body && (
                    <p className="mt-4 leading-relaxed text-muted-foreground">
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
        <section className="border-b border-border/60 bg-muted/30">
          <div className="container mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
            <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Gallery
            </p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
              {c.gallery.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-2xl border border-border/60 bg-muted"
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
        <section className="border-b border-border/60">
          <div className="container mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
            <div className="grid gap-5 md:grid-cols-3">
              {c.testimonials.map((t, i) => (
                <figure
                  key={i}
                  className="flex flex-col rounded-2xl border border-border/60 bg-card p-6"
                >
                  {t.rating && (
                    <div className="mb-3 flex gap-0.5 text-primary">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star
                          key={j}
                          className="h-4 w-4 fill-current"
                        />
                      ))}
                    </div>
                  )}
                  <blockquote className="flex-1 text-base leading-relaxed">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-4 text-sm">
                    <span className="font-semibold">{t.name}</span>
                    {t.location && (
                      <span className="text-muted-foreground"> · {t.location}</span>
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
        <section className="border-b border-border/60 bg-muted/30">
          <div className="container mx-auto max-w-3xl px-4 py-14 md:px-8 md:py-20">
            <p className="mb-3 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Common questions
            </p>
            <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
              You asked, we answered
            </h2>
            <LandingFaq items={c.faq} />
          </div>
        </section>
      )}

      {/* Final CTA + Order form */}
      <section id="order" className="bg-background">
        <div className="container mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
          <div className="grid items-start gap-10 md:grid-cols-2 md:gap-14">
            <div>
              {c.finalCta.headline && (
                <h2 className="text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl">
                  {c.finalCta.headline}
                </h2>
              )}
              {c.finalCta.subheadline && (
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  {c.finalCta.subheadline}
                </p>
              )}
              <div className="mt-8 rounded-2xl border border-border/60 bg-muted/40 p-5">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
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
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-muted-foreground tabular-nums">
                      ৳{product.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              {c.orderForm.title && (
                <h3 className="mb-2 text-2xl font-semibold tracking-tight">
                  {c.orderForm.title}
                </h3>
              )}
              {c.orderForm.subtitle && (
                <p className="mb-5 text-sm text-muted-foreground">
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
