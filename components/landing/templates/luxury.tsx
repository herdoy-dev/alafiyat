import Image from "next/image";
import { Star } from "lucide-react";
import { YouTubeEmbed } from "@/components/landing/sections/youtube-embed";
import { LandingOrderForm } from "@/components/landing/sections/order-form";
import { LandingFaq } from "@/components/landing/sections/landing-faq";
import { Button } from "@/components/ui/button";
import type { TemplateProps } from "./types";

const GOLD = "#D4AF7A";

export function LuxuryTemplate({ landing, product }: TemplateProps) {
  const c = landing.content;

  return (
    <div className="bg-[#0a0a0c] text-white">
      {/* Pre-hero video */}
      {landing.videoUrl && (
        <section className="border-b border-white/10 py-12 md:py-20">
          <div className="container mx-auto max-w-5xl px-4 md:px-8">
            <p
              className="mb-5 text-center text-[10px] font-medium uppercase tracking-[0.4em]"
              style={{ color: GOLD }}
            >
              The film
            </p>
            <YouTubeEmbed url={landing.videoUrl} title={landing.title} />
          </div>
        </section>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,122,0.12),transparent_60%)]"
        />
        <div className="container relative mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-32">
          <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-6">
              {c.hero.eyebrow && (
                <p
                  className="mb-4 text-[11px] font-medium uppercase tracking-[0.4em]"
                  style={{ color: GOLD }}
                >
                  {c.hero.eyebrow}
                </p>
              )}
              <h1 className="text-5xl font-light italic leading-[1.05] tracking-tight md:text-7xl">
                {c.hero.headline || product.name}
              </h1>
              {c.hero.subheadline && (
                <p className="mt-6 max-w-md text-base leading-relaxed text-white/65 md:text-lg">
                  {c.hero.subheadline}
                </p>
              )}
              <div className="mt-8 flex flex-wrap items-baseline gap-5">
                <p className="text-3xl font-light tabular-nums md:text-4xl">
                  ৳{product.price.toLocaleString()}
                </p>
                {c.hero.badge && (
                  <span
                    className="rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-widest"
                    style={{ borderColor: GOLD, color: GOLD }}
                  >
                    {c.hero.badge}
                  </span>
                )}
              </div>
              <Button
                asChild
                size="lg"
                className="mt-8 rounded-none border bg-transparent px-8 text-sm font-medium uppercase tracking-[0.2em] hover:bg-white hover:text-black"
                style={{ borderColor: GOLD }}
              >
                <a href="#order-form">{c.hero.ctaLabel || "Reserve yours"}</a>
              </Button>
            </div>
            <div className="md:col-span-6">
              <div
                className="relative aspect-[4/5] overflow-hidden rounded-sm border bg-white/[0.03]"
                style={{ borderColor: "rgba(212,175,122,0.3)" }}
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
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      {c.trustBadges.length > 0 && (
        <section className="border-b border-white/10 py-6">
          <div className="container mx-auto max-w-6xl px-4 md:px-8">
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-[11px] font-medium uppercase tracking-[0.25em] text-white/55">
              {c.trustBadges.map((b, i) => (
                <span key={i}>{b}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      {c.benefits.length > 0 && (
        <section className="border-b border-white/10 py-20 md:py-28">
          <div className="container mx-auto max-w-5xl px-4 md:px-8">
            <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-3 md:gap-16">
              {c.benefits.map((b, i) => (
                <div key={i}>
                  <p
                    className="text-[10px] font-medium uppercase tracking-[0.3em]"
                    style={{ color: GOLD }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-xl font-light italic">{b.title}</h3>
                  {b.body && (
                    <p className="mt-3 text-sm leading-relaxed text-white/60">
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
        <section className="border-b border-white/10 py-20 md:py-28">
          <div className="container mx-auto max-w-6xl space-y-20 px-4 md:px-8 md:space-y-28">
            {c.highlights.map((h, i) => (
              <div
                key={i}
                className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                {h.image && (
                  <div
                    className="relative aspect-[4/5] overflow-hidden rounded-sm border"
                    style={{ borderColor: "rgba(212,175,122,0.3)" }}
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
                <div>
                  <p
                    className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em]"
                    style={{ color: GOLD }}
                  >
                    Chapter {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="text-3xl font-light italic leading-tight md:text-4xl">
                    {h.title}
                  </h3>
                  {h.body && (
                    <p className="mt-5 leading-relaxed text-white/65">
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
        <section className="border-b border-white/10 py-20 md:py-28">
          <div className="container mx-auto max-w-6xl px-4 md:px-8">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              {c.gallery.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-[3/4] overflow-hidden rounded-sm border"
                  style={{ borderColor: "rgba(212,175,122,0.2)" }}
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
        <section className="border-b border-white/10 py-20 md:py-28">
          <div className="container mx-auto max-w-3xl space-y-14 px-4 md:px-8">
            {c.testimonials.map((t, i) => (
              <figure key={i} className="text-center">
                {t.rating && (
                  <div
                    className="mb-4 flex justify-center gap-1"
                    style={{ color: GOLD }}
                  >
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                )}
                <blockquote className="text-2xl font-light italic leading-relaxed md:text-3xl">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 text-[11px] uppercase tracking-[0.3em] text-white/55">
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
        <section className="border-b border-white/10 py-20 md:py-28">
          <div className="container mx-auto max-w-2xl px-4 md:px-8">
            <p
              className="mb-3 text-center text-[11px] font-medium uppercase tracking-[0.4em]"
              style={{ color: GOLD }}
            >
              Enquiries
            </p>
            <h2 className="mb-10 text-center text-4xl font-light italic md:text-5xl">
              Should you wonder
            </h2>
            <LandingFaq items={c.faq} theme="dark" />
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section id="order" className="py-24 md:py-32">
        <div className="container mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid items-start gap-14 md:grid-cols-2">
            <div>
              {c.finalCta.headline && (
                <h2 className="text-4xl font-light italic leading-[1.05] md:text-6xl">
                  {c.finalCta.headline}
                </h2>
              )}
              {c.finalCta.subheadline && (
                <p className="mt-6 text-lg leading-relaxed text-white/65">
                  {c.finalCta.subheadline}
                </p>
              )}
              <div
                className="mt-8 flex items-center gap-5 border-t border-white/10 pt-6"
              >
                <div
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm border"
                  style={{ borderColor: "rgba(212,175,122,0.3)" }}
                >
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
                  <p className="font-light italic">{product.name}</p>
                  <p
                    className="text-sm tabular-nums"
                    style={{ color: GOLD }}
                  >
                    ৳{product.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <LandingOrderForm
                product={product}
                ctaLabel={c.finalCta.ctaLabel || "Reserve yours"}
                theme="dark"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
