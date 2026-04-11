import Image from "next/image";
import { ShieldCheck, Star, ArrowRight } from "lucide-react";
import { YouTubeEmbed } from "@/components/landing/sections/youtube-embed";
import { LandingOrderForm } from "@/components/landing/sections/order-form";
import { LandingFaq } from "@/components/landing/sections/landing-faq";
import { Button } from "@/components/ui/button";
import type { TemplateProps } from "./types";

// EDITORIAL — Magazine-style spread with big numbers, serif accents,
// and asymmetric grid. Think New York Times feature article.

export function EditorialTemplate({ landing, product }: TemplateProps) {
  const c = landing.content;

  return (
    <div
      className="overflow-x-hidden bg-[#faf8f3] text-[#1a1a1a]"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      {/* Masthead */}
      <div className="border-b-2 border-[#1a1a1a]">
        <div className="container mx-auto max-w-7xl px-4 py-3 md:px-8">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em]">
              Al Amirat × The Feature
            </p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#666]">
              Vol. 01 · Exclusive
            </p>
          </div>
        </div>
      </div>

      {/* Hero — asymmetric magazine layout */}
      <section className="border-b-2 border-[#1a1a1a]">
        <div className="container mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <div className="grid gap-8 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-7">
              {c.hero.eyebrow && (
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#8b0000]">
                  — {c.hero.eyebrow}
                </p>
              )}
              <h1 className="text-5xl font-black leading-[0.95] tracking-tight md:text-7xl lg:text-[96px]">
                {c.hero.headline || product.name}
              </h1>
              <div className="mt-8 border-t border-b border-[#1a1a1a]/30 py-4">
                <p className="max-w-xl text-lg italic leading-relaxed text-[#444] md:text-xl">
                  {c.hero.subheadline || "A product worth paying attention to."}
                </p>
              </div>
              <div className="mt-8 flex flex-wrap items-end gap-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#666]">
                    Price
                  </p>
                  <p className="mt-1 text-4xl font-black tabular-nums md:text-5xl">
                    ৳{product.price.toLocaleString()}
                  </p>
                </div>
                <Button
                  asChild
                  size="lg"
                  className="h-auto rounded-none border-2 border-[#1a1a1a] bg-[#1a1a1a] px-8 py-4 text-base font-bold uppercase tracking-wider text-[#faf8f3] hover:bg-[#8b0000]"
                >
                  <a href="#order-form">
                    {c.hero.ctaLabel || "Order now"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="relative aspect-[3/4] overflow-hidden border-2 border-[#1a1a1a] bg-[#e8e4d8]">
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
              <p className="mt-3 text-xs italic text-[#666]">
                Fig. 01 — {product.name}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Video */}
      {landing.videoUrl && (
        <section className="border-b-2 border-[#1a1a1a] bg-[#1a1a1a] text-[#faf8f3]">
          <div className="container mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-20">
            <p className="mb-4 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af7a]">
              Watch the feature
            </p>
            <YouTubeEmbed url={landing.videoUrl} title={landing.title} />
          </div>
        </section>
      )}

      {/* Benefits — giant numbered list */}
      {c.benefits.length > 0 && (
        <section className="border-b-2 border-[#1a1a1a]">
          <div className="container mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
            <p className="mb-10 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-[#8b0000]">
              — Why it matters
            </p>
            <div className="space-y-16 md:space-y-20">
              {c.benefits.map((b, i) => (
                <div
                  key={i}
                  className="grid items-start gap-6 border-b border-[#1a1a1a]/20 pb-12 md:grid-cols-12 md:gap-10"
                >
                  <div className="md:col-span-2">
                    <p
                      className="text-6xl font-black leading-none tabular-nums md:text-8xl"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </p>
                  </div>
                  <div className="md:col-span-10">
                    <h3 className="text-2xl font-black uppercase tracking-tight md:text-4xl">
                      {b.title}
                    </h3>
                    {b.body && (
                      <p className="mt-3 max-w-2xl text-lg italic leading-relaxed text-[#444] md:text-xl">
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

      {/* Highlights — pull quotes */}
      {c.highlights.length > 0 && (
        <section className="border-b-2 border-[#1a1a1a] bg-[#e8e4d8]">
          <div className="container mx-auto max-w-7xl space-y-20 px-4 py-20 md:px-8 md:py-28 md:space-y-28">
            {c.highlights.map((h, i) => (
              <div
                key={i}
                className={`grid items-center gap-8 md:grid-cols-12 md:gap-14 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                <div className="md:col-span-5">
                  {h.image && (
                    <div className="relative aspect-[4/5] overflow-hidden border-2 border-[#1a1a1a]">
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
                <div className="md:col-span-7">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#8b0000]">
                    — Chapter {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="text-3xl font-black leading-tight tracking-tight md:text-5xl lg:text-6xl">
                    {h.title}
                  </h3>
                  {h.body && (
                    <p
                      className="mt-6 border-l-4 border-[#8b0000] pl-6 text-lg italic leading-relaxed text-[#333] md:text-2xl"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      &ldquo;{h.body}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gallery — tiled grid with caption */}
      {c.gallery.length > 0 && (
        <section className="border-b-2 border-[#1a1a1a]">
          <div className="container mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-24">
            <p className="mb-8 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-[#8b0000]">
              — Plates
            </p>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
              {c.gallery.map((src, i) => (
                <figure key={i}>
                  <div className="relative aspect-[3/4] overflow-hidden border-2 border-[#1a1a1a] bg-[#e8e4d8]">
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <figcaption className="mt-2 text-xs italic text-[#666]">
                    Plate {String(i + 1).padStart(2, "0")}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials — letter-to-editor style */}
      {c.testimonials.length > 0 && (
        <section className="border-b-2 border-[#1a1a1a] bg-[#1a1a1a] text-[#faf8f3]">
          <div className="container mx-auto max-w-4xl px-4 py-20 md:px-8 md:py-28">
            <p className="mb-10 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af7a]">
              — Letters from readers
            </p>
            <div className="space-y-12">
              {c.testimonials.map((t, i) => (
                <figure
                  key={i}
                  className="border-b border-[#faf8f3]/20 pb-12 last:border-0"
                >
                  {t.rating && (
                    <div className="mb-4 flex gap-0.5 text-[#d4af7a]">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  )}
                  <blockquote
                    className="text-2xl italic leading-relaxed md:text-3xl"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 text-sm uppercase tracking-wider">
                    — <span className="font-bold">{t.name}</span>
                    {t.location && (
                      <span className="text-[#d4af7a]"> · {t.location}</span>
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
        <section className="border-b-2 border-[#1a1a1a] bg-[#e8e4d8]">
          <div className="container mx-auto max-w-3xl px-4 py-20 md:px-8 md:py-28">
            <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-[#8b0000]">
              — Footnotes
            </p>
            <h2 className="mb-10 text-center text-4xl font-black tracking-tight md:text-6xl">
              Q & A
            </h2>
            <LandingFaq items={c.faq} />
          </div>
        </section>
      )}

      {/* Order */}
      <section id="order-form" className="bg-[#faf8f3]">
        <div className="container mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
          <div className="grid items-start gap-10 md:grid-cols-2 md:gap-16">
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#8b0000]">
                — The conclusion
              </p>
              {c.finalCta.headline && (
                <h2 className="text-4xl font-black leading-[0.95] tracking-tight md:text-6xl">
                  {c.finalCta.headline}
                </h2>
              )}
              {c.finalCta.subheadline && (
                <p className="mt-6 text-lg italic leading-relaxed text-[#444] md:text-xl">
                  {c.finalCta.subheadline}
                </p>
              )}
              {c.trustBadges.length > 0 && (
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {c.trustBadges.map((b, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 border-b border-[#1a1a1a]/30 py-2 text-sm uppercase tracking-wider"
                    >
                      <ShieldCheck className="h-4 w-4 text-[#8b0000]" />
                      {b}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="border-2 border-[#1a1a1a] bg-[#faf8f3] p-6 md:p-8">
              {c.orderForm.title && (
                <h3 className="mb-2 text-2xl font-black uppercase tracking-tight">
                  {c.orderForm.title}
                </h3>
              )}
              {c.orderForm.subtitle && (
                <p className="mb-5 text-sm italic text-[#666]">
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
