import Image from "next/image";
import { Star, ArrowUpRight, Asterisk } from "lucide-react";
import { YouTubeEmbed } from "@/components/landing/sections/youtube-embed";
import { LandingOrderForm } from "@/components/landing/sections/order-form";
import { LandingFaq } from "@/components/landing/sections/landing-faq";
import { Button } from "@/components/ui/button";
import type { TemplateProps } from "./types";

// URBAN — Modern streetwear vibe with concrete gray, orange accents,
// rotated text, numbered sections, brutalist typography.

export function UrbanTemplate({ landing, product }: TemplateProps) {
  const c = landing.content;

  return (
    <div className="overflow-x-hidden bg-[#0f0f10] text-[#f5f5f5]">
      {/* Scroll ticker */}
      <div className="overflow-hidden border-b border-[#f5f5f5]/10 bg-[#ff5722] py-2">
        <div className="flex gap-10 whitespace-nowrap text-xs font-black uppercase tracking-[0.2em] text-black">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="flex items-center gap-10">
              <Asterisk className="h-3 w-3" />
              FRESH DROP
              <Asterisk className="h-3 w-3" />
              LIMITED RUN
              <Asterisk className="h-3 w-3" />
              NOW AVAILABLE
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section className="relative border-b border-[#f5f5f5]/10">
        {/* Huge background text */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <p className="select-none text-[18vw] font-black leading-none tracking-tighter text-[#f5f5f5]/[0.03]">
            DROP
          </p>
        </div>

        <div className="container relative mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
          <div className="grid items-end gap-10 md:grid-cols-12 md:gap-14">
            <div className="md:col-span-7">
              <div className="mb-6 flex items-center gap-3">
                <span className="font-mono text-xs text-[#ff5722]">(001)</span>
                <div className="h-px flex-1 bg-[#f5f5f5]/20" />
                <span className="font-mono text-xs uppercase tracking-wider text-[#f5f5f5]/50">
                  {c.hero.eyebrow || "Volume 01"}
                </span>
              </div>
              <h1 className="text-6xl font-black uppercase leading-[0.85] tracking-tighter text-[#f5f5f5] md:text-8xl lg:text-[140px]">
                {(c.hero.headline || product.name).split(" ").map((word, i) => (
                  <span
                    key={i}
                    className={i % 2 === 1 ? "italic text-[#ff5722]" : ""}
                  >
                    {word}{" "}
                  </span>
                ))}
              </h1>
              {c.hero.subheadline && (
                <p className="mt-8 max-w-md text-base leading-relaxed text-[#f5f5f5]/70 md:text-lg">
                  {c.hero.subheadline}
                </p>
              )}
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <Button
                  asChild
                  size="lg"
                  className="h-auto rounded-none bg-[#ff5722] px-8 py-5 text-sm font-black uppercase tracking-[0.2em] text-black hover:bg-[#ff7043]"
                >
                  <a href="#order-form">
                    {c.hero.ctaLabel || "Order now"}
                    <ArrowUpRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <div className="flex items-center gap-4">
                  <div className="h-px w-10 bg-[#f5f5f5]/30" />
                  <p className="font-mono text-3xl font-black tabular-nums md:text-4xl">
                    ৳{product.price.toLocaleString()}
                  </p>
                  {c.hero.badge && (
                    <span className="border border-[#ff5722] px-2 py-0.5 font-mono text-xs uppercase text-[#ff5722]">
                      {c.hero.badge}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="relative">
                <div className="relative aspect-[3/4] overflow-hidden bg-[#1a1a1a]">
                  {product.thumbnail && (
                    <Image
                      src={product.thumbnail}
                      alt={product.name}
                      fill
                      priority
                      className="object-cover grayscale transition-all duration-700 hover:grayscale-0"
                      unoptimized
                    />
                  )}
                </div>
                {/* Tags */}
                <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[#f5f5f5]/50">
                  <span>SKU: {product.slug.toUpperCase()}</span>
                  <span>REF.001</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video */}
      {landing.videoUrl && (
        <section className="border-b border-[#f5f5f5]/10 bg-[#0a0a0a]">
          <div className="container mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-24">
            <div className="mb-6 flex items-center gap-3">
              <span className="font-mono text-xs text-[#ff5722]">(002)</span>
              <div className="h-px flex-1 bg-[#f5f5f5]/20" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#f5f5f5]/50">
                The film
              </span>
            </div>
            <YouTubeEmbed url={landing.videoUrl} title={landing.title} />
          </div>
        </section>
      )}

      {/* Benefits */}
      {c.benefits.length > 0 && (
        <section className="border-b border-[#f5f5f5]/10">
          <div className="container mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
            <div className="mb-12 flex items-center gap-3">
              <span className="font-mono text-xs text-[#ff5722]">(003)</span>
              <div className="h-px flex-1 bg-[#f5f5f5]/20" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#f5f5f5]/50">
                Features
              </span>
            </div>
            <div className="grid gap-px bg-[#f5f5f5]/10 md:grid-cols-3">
              {c.benefits.map((b, i) => (
                <div
                  key={i}
                  className="group relative bg-[#0f0f10] p-8 transition-colors hover:bg-[#1a1a1a]"
                >
                  <div className="mb-8 flex items-center justify-between">
                    <span className="font-mono text-xs text-[#ff5722]">
                      ({String(i + 1).padStart(3, "0")})
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-[#f5f5f5]/30 transition-all group-hover:rotate-45 group-hover:text-[#ff5722]" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight md:text-3xl">
                    {b.title}
                  </h3>
                  {b.body && (
                    <p className="mt-4 text-sm leading-relaxed text-[#f5f5f5]/60">
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
        <section className="border-b border-[#f5f5f5]/10">
          <div className="container mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
            <div className="mb-16 flex items-center gap-3">
              <span className="font-mono text-xs text-[#ff5722]">(004)</span>
              <div className="h-px flex-1 bg-[#f5f5f5]/20" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#f5f5f5]/50">
                Chapters
              </span>
            </div>
            <div className="space-y-24">
              {c.highlights.map((h, i) => (
                <div
                  key={i}
                  className="grid items-center gap-10 md:grid-cols-12 md:gap-14"
                >
                  <div className="md:col-span-5">
                    {h.image && (
                      <div className="relative aspect-[4/5] overflow-hidden bg-[#1a1a1a]">
                        <Image
                          src={h.image}
                          alt={h.title}
                          fill
                          className="object-cover grayscale"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-7">
                    <p className="mb-4 font-mono text-xs text-[#ff5722]">
                      /// CH.{String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="text-4xl font-black uppercase leading-[0.9] tracking-tighter md:text-6xl lg:text-7xl">
                      {h.title}
                    </h3>
                    {h.body && (
                      <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#f5f5f5]/70">
                        {h.body}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {c.gallery.length > 0 && (
        <section className="border-b border-[#f5f5f5]/10">
          <div className="container mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
            <div className="mb-12 flex items-center gap-3">
              <span className="font-mono text-xs text-[#ff5722]">(005)</span>
              <div className="h-px flex-1 bg-[#f5f5f5]/20" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#f5f5f5]/50">
                Lookbook
              </span>
            </div>
            <div className="grid grid-cols-2 gap-px bg-[#f5f5f5]/10 md:grid-cols-4">
              {c.gallery.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-[3/4] overflow-hidden bg-[#1a1a1a]"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover grayscale transition-all duration-500 hover:grayscale-0"
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
        <section className="border-b border-[#f5f5f5]/10 bg-[#ff5722] text-black">
          <div className="container mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
            <div className="mb-12 flex items-center gap-3">
              <span className="font-mono text-xs">(006)</span>
              <div className="h-px flex-1 bg-black/30" />
              <span className="font-mono text-xs uppercase tracking-wider">
                The voices
              </span>
            </div>
            <div className="grid gap-10 md:grid-cols-3">
              {c.testimonials.map((t, i) => (
                <figure
                  key={i}
                  className="border-t-2 border-black pt-6"
                >
                  {t.rating && (
                    <div className="mb-4 flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  )}
                  <blockquote className="text-xl font-black uppercase leading-tight tracking-tight md:text-2xl">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 font-mono text-xs uppercase tracking-wider">
                    /// {t.name}
                    {t.location && <span> — {t.location}</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {c.faq.length > 0 && (
        <section className="border-b border-[#f5f5f5]/10">
          <div className="container mx-auto max-w-3xl px-4 py-20 md:px-8 md:py-28">
            <div className="mb-10 flex items-center gap-3">
              <span className="font-mono text-xs text-[#ff5722]">(007)</span>
              <div className="h-px flex-1 bg-[#f5f5f5]/20" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#f5f5f5]/50">
                FAQ
              </span>
            </div>
            <LandingFaq items={c.faq} theme="dark" />
          </div>
        </section>
      )}

      {/* Order */}
      <section id="order-form" className="bg-[#0f0f10]">
        <div className="container mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
          <div className="mb-12 flex items-center gap-3">
            <span className="font-mono text-xs text-[#ff5722]">(008)</span>
            <div className="h-px flex-1 bg-[#f5f5f5]/20" />
            <span className="font-mono text-xs uppercase tracking-wider text-[#f5f5f5]/50">
              Cop it
            </span>
          </div>
          <div className="grid items-start gap-14 md:grid-cols-2">
            <div>
              {c.finalCta.headline && (
                <h2 className="text-5xl font-black uppercase leading-[0.85] tracking-tighter md:text-7xl">
                  {c.finalCta.headline}
                </h2>
              )}
              {c.finalCta.subheadline && (
                <p className="mt-6 max-w-md text-lg leading-relaxed text-[#f5f5f5]/70">
                  {c.finalCta.subheadline}
                </p>
              )}
              {c.trustBadges.length > 0 && (
                <div className="mt-10 space-y-2 font-mono text-xs">
                  {c.trustBadges.map((b, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 border-t border-[#f5f5f5]/10 pt-2 uppercase tracking-wider text-[#f5f5f5]/60"
                    >
                      <span className="text-[#ff5722]">+</span>
                      {b}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="border border-[#f5f5f5]/20 bg-[#1a1a1a] p-6 md:p-8">
              {c.orderForm.title && (
                <h3 className="mb-2 font-black uppercase tracking-tight text-2xl">
                  {c.orderForm.title}
                </h3>
              )}
              {c.orderForm.subtitle && (
                <p className="mb-5 font-mono text-xs uppercase tracking-wider text-[#f5f5f5]/50">
                  /// {c.orderForm.subtitle}
                </p>
              )}
              <LandingOrderForm
                product={product}
                ctaLabel={c.finalCta.ctaLabel || "Place order"}
                theme="dark"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
