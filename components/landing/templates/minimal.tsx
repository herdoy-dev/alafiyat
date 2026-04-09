import Image from "next/image";
import { Star } from "lucide-react";
import { YouTubeEmbed } from "@/components/landing/sections/youtube-embed";
import { LandingOrderForm } from "@/components/landing/sections/order-form";
import { LandingFaq } from "@/components/landing/sections/landing-faq";
import { Button } from "@/components/ui/button";
import type { TemplateProps } from "./types";

export function MinimalTemplate({ landing, product }: TemplateProps) {
  const c = landing.content;

  return (
    <div className="overflow-x-hidden bg-background text-foreground">
      {/* Pre-hero video */}
      {landing.videoUrl && (
        <section className="py-12 md:py-20">
          <div className="container mx-auto max-w-4xl px-4 md:px-8">
            <YouTubeEmbed
              url={landing.videoUrl}
              title={landing.title}
              className="relative aspect-video w-full overflow-hidden rounded-3xl bg-black"
            />
          </div>
        </section>
      )}

      {/* Hero — centered, sparse */}
      <section className="border-b border-border/30">
        <div className="container mx-auto max-w-3xl px-4 py-20 text-center md:px-8 md:py-32">
          {c.hero.eyebrow && (
            <p className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {c.hero.eyebrow}
            </p>
          )}
          <h1 className="text-4xl font-light leading-[1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {c.hero.headline || product.name}
          </h1>
          {c.hero.subheadline && (
            <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {c.hero.subheadline}
            </p>
          )}
          <p className="mt-10 text-3xl font-light tabular-nums">
            ৳{product.price.toLocaleString()}
          </p>
          {c.hero.badge && (
            <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
              {c.hero.badge}
            </p>
          )}
          <Button
            asChild
            size="lg"
            variant="outline"
            className="mt-10 rounded-full border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background"
          >
            <a href="#order-form">{c.hero.ctaLabel || "Order"}</a>
          </Button>
        </div>

        {/* Single huge image */}
        <div className="container mx-auto max-w-5xl px-4 pb-20 md:px-8 md:pb-32">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-muted">
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

      {/* Benefits — minimal grid */}
      {c.benefits.length > 0 && (
        <section className="border-b border-border/30">
          <div className="container mx-auto max-w-5xl px-4 py-20 md:px-8 md:py-32">
            <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-3 md:gap-16">
              {c.benefits.map((b, i) => (
                <div key={i}>
                  <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="text-xl font-medium">{b.title}</h3>
                  {b.body && (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
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
        <section className="border-b border-border/30">
          <div className="container mx-auto max-w-5xl space-y-24 px-4 py-20 md:px-8 md:py-32 md:space-y-32">
            {c.highlights.map((h, i) => (
              <div key={i} className="space-y-6 text-center">
                {h.image && (
                  <div className="relative mx-auto aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-3xl bg-muted">
                    <Image
                      src={h.image}
                      alt={h.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <h3 className="text-2xl font-light tracking-tight sm:text-3xl md:text-4xl">
                  {h.title}
                </h3>
                {h.body && (
                  <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground">
                    {h.body}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gallery */}
      {c.gallery.length > 0 && (
        <section className="border-b border-border/30">
          <div className="container mx-auto max-w-5xl px-4 py-20 md:px-8 md:py-32">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              {c.gallery.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-2xl bg-muted"
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

      {/* Testimonials — single column quotes */}
      {c.testimonials.length > 0 && (
        <section className="border-b border-border/30">
          <div className="container mx-auto max-w-3xl space-y-12 px-4 py-20 md:px-8 md:py-32">
            {c.testimonials.map((t, i) => (
              <figure key={i} className="text-center">
                {t.rating && (
                  <div className="mb-4 flex justify-center gap-0.5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                )}
                <blockquote className="text-xl font-light leading-relaxed sm:text-2xl md:text-3xl">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 text-sm uppercase tracking-widest text-muted-foreground">
                  {t.name}
                  {t.location && ` · ${t.location}`}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {c.faq.length > 0 && (
        <section className="border-b border-border/30">
          <div className="container mx-auto max-w-2xl px-4 py-20 md:px-8 md:py-32">
            <h2 className="mb-10 text-center text-3xl font-light tracking-tight sm:text-4xl md:text-5xl">
              Questions
            </h2>
            <LandingFaq items={c.faq} />
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section id="order">
        <div className="container mx-auto max-w-2xl px-4 py-20 text-center md:px-8 md:py-32">
          {c.finalCta.headline && (
            <h2 className="text-3xl font-light leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              {c.finalCta.headline}
            </h2>
          )}
          {c.finalCta.subheadline && (
            <p className="mx-auto mt-5 max-w-lg text-base text-muted-foreground">
              {c.finalCta.subheadline}
            </p>
          )}

          <div className="mt-12">
            <LandingOrderForm
              product={product}
              ctaLabel={c.finalCta.ctaLabel || "Place order"}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
