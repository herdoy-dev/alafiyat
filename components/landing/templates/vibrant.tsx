import Image from "next/image";
import { Heart, Sparkles, Star, Zap } from "lucide-react";
import { YouTubeEmbed } from "@/components/landing/sections/youtube-embed";
import { LandingOrderForm } from "@/components/landing/sections/order-form";
import { LandingFaq } from "@/components/landing/sections/landing-faq";
import { Button } from "@/components/ui/button";
import type { TemplateProps } from "./types";

const VIBRANT_BG = "bg-[#fff8ec]";

export function VibrantTemplate({ landing, product }: TemplateProps) {
  const c = landing.content;

  return (
    <div className={`${VIBRANT_BG} text-foreground`}>
      {/* Pre-hero video */}
      {landing.videoUrl && (
        <section className="py-10 md:py-16">
          <div className="container mx-auto max-w-4xl px-4 md:px-8">
            <div className="rounded-3xl border-4 border-foreground bg-white p-3 shadow-[8px_8px_0_0_currentColor]">
              <YouTubeEmbed
                url={landing.videoUrl}
                title={landing.title}
                className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black"
              />
            </div>
          </div>
        </section>
      )}

      {/* Hero — playful */}
      <section className="relative overflow-hidden py-16 md:py-24">
        {/* decorative blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-10 top-10 h-32 w-32 rounded-full bg-pink-300/60 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-10 right-10 h-40 w-40 rounded-full bg-amber-300/60 blur-2xl"
        />
        <div className="container relative mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid items-center gap-12 md:grid-cols-12">
            <div className="md:col-span-6">
              {c.hero.eyebrow && (
                <p className="mb-3 inline-flex items-center gap-2 rounded-full border-2 border-foreground bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-[3px_3px_0_0_currentColor]">
                  <Sparkles className="h-3 w-3" />
                  {c.hero.eyebrow}
                </p>
              )}
              <h1 className="text-5xl font-black leading-[0.9] tracking-tight md:text-7xl">
                {c.hero.headline || product.name}
              </h1>
              {c.hero.subheadline && (
                <p className="mt-5 max-w-md text-lg text-foreground/70 md:text-xl">
                  {c.hero.subheadline}
                </p>
              )}
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <p className="rounded-2xl border-4 border-foreground bg-yellow-300 px-5 py-2 text-3xl font-black tabular-nums shadow-[5px_5px_0_0_currentColor]">
                  ৳{product.price.toLocaleString()}
                </p>
                {c.hero.badge && (
                  <span className="rounded-full border-2 border-foreground bg-pink-300 px-3 py-1 text-xs font-bold uppercase">
                    {c.hero.badge}
                  </span>
                )}
              </div>
              <Button
                asChild
                size="lg"
                className="mt-7 rounded-full border-4 border-foreground bg-foreground text-base font-bold text-background shadow-[5px_5px_0_0_currentColor] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0_0_currentColor]"
              >
                <a href="#order-form">
                  {c.hero.ctaLabel || "Order now"} →
                </a>
              </Button>
            </div>
            <div className="md:col-span-6">
              <div className="relative -rotate-2 transform">
                <div className="relative aspect-square overflow-hidden rounded-3xl border-4 border-foreground bg-white shadow-[10px_10px_0_0_currentColor]">
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
        </div>
      </section>

      {/* Trust badges */}
      {c.trustBadges.length > 0 && (
        <section className="bg-foreground py-5 text-background">
          <div className="container mx-auto max-w-6xl px-4 md:px-8">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm font-bold uppercase tracking-wider">
              {c.trustBadges.map((b, i) => (
                <span key={i} className="inline-flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5" />
                  {b}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits — colorful cards */}
      {c.benefits.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto max-w-6xl px-4 md:px-8">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {c.benefits.map((b, i) => {
                const colors = [
                  "bg-pink-200",
                  "bg-amber-200",
                  "bg-emerald-200",
                  "bg-sky-200",
                  "bg-violet-200",
                  "bg-rose-200",
                ];
                const bg = colors[i % colors.length];
                return (
                  <div
                    key={i}
                    className={`rounded-3xl border-4 border-foreground ${bg} p-7 shadow-[6px_6px_0_0_currentColor]`}
                  >
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-foreground bg-white">
                      <Heart className="h-6 w-6" />
                    </span>
                    <h3 className="mt-4 text-2xl font-black">{b.title}</h3>
                    {b.body && (
                      <p className="mt-2 text-sm leading-relaxed">{b.body}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Highlights */}
      {c.highlights.length > 0 && (
        <section className="bg-pink-100 py-16 md:py-24">
          <div className="container mx-auto max-w-6xl space-y-16 px-4 md:px-8 md:space-y-24">
            {c.highlights.map((h, i) => (
              <div
                key={i}
                className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                {h.image && (
                  <div className="relative aspect-square overflow-hidden rounded-3xl border-4 border-foreground shadow-[8px_8px_0_0_currentColor]">
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
                  <h3 className="text-4xl font-black leading-tight md:text-5xl">
                    {h.title}
                  </h3>
                  {h.body && (
                    <p className="mt-5 text-lg leading-relaxed text-foreground/80">
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
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {c.gallery.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-3xl border-4 border-foreground shadow-[5px_5px_0_0_currentColor]"
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
        <section className="bg-amber-100 py-20 md:py-28">
          <div className="container mx-auto max-w-6xl px-4 md:px-8">
            <h2 className="mb-12 text-center text-5xl font-black tracking-tight md:text-6xl">
              People love it ❤️
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {c.testimonials.map((t, i) => (
                <figure
                  key={i}
                  className="rounded-3xl border-4 border-foreground bg-white p-7 shadow-[6px_6px_0_0_currentColor]"
                >
                  {t.rating && (
                    <div className="mb-3 flex gap-0.5 text-amber-500">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                  )}
                  <blockquote className="text-base leading-relaxed">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-5 text-sm font-bold">
                    {t.name}
                    {t.location && (
                      <span className="text-foreground/60"> · {t.location}</span>
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
            <h2 className="mb-8 text-center text-5xl font-black md:text-6xl">
              Questions?
            </h2>
            <LandingFaq items={c.faq} />
          </div>
        </section>
      )}

      {/* Order */}
      <section id="order" className="bg-emerald-200 py-20 md:py-28">
        <div className="container mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid items-start gap-12 md:grid-cols-2">
            <div>
              {c.finalCta.headline && (
                <h2 className="text-5xl font-black leading-[0.95] md:text-7xl">
                  {c.finalCta.headline}
                </h2>
              )}
              {c.finalCta.subheadline && (
                <p className="mt-5 text-xl">{c.finalCta.subheadline}</p>
              )}
            </div>
            <div className="rounded-3xl border-4 border-foreground bg-white p-2 shadow-[8px_8px_0_0_currentColor]">
              <LandingOrderForm
                product={product}
                ctaLabel={c.finalCta.ctaLabel || "Order now"}
                className="rounded-2xl border-0 shadow-none"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
