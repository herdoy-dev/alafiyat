import Image from "next/image";
import { Flower2, Star, Sparkles } from "lucide-react";
import { YouTubeEmbed } from "@/components/landing/sections/youtube-embed";
import { LandingOrderForm } from "@/components/landing/sections/order-form";
import { LandingFaq } from "@/components/landing/sections/landing-faq";
import { Button } from "@/components/ui/button";
import type { TemplateProps } from "./types";

// GARDEN — Watercolor soft pastels, botanical feel, floral accents.
// For flower teas, fruit infusions, delicate blends.

export function GardenTemplate({ landing, product }: TemplateProps) {
  const c = landing.content;

  return (
    <div className="overflow-x-hidden bg-[#fdf6f0] text-[#3a3228]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Watercolor blobs */}
        <div className="pointer-events-none absolute -left-20 -top-10 h-48 w-48 rounded-full bg-[#f5c6c6]/40 blur-3xl md:h-80 md:w-80" />
        <div className="pointer-events-none absolute -right-20 top-40 h-48 w-48 rounded-full bg-[#f5d9a8]/40 blur-3xl md:h-72 md:w-72" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-[#d4c1e5]/40 blur-3xl md:h-64 md:w-64" />

        <div className="container relative mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-20 lg:py-28">
          <div className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
            <div className="md:col-span-6 md:order-1 order-2 text-center md:text-left">
              {c.hero.eyebrow && (
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-[#a85858] shadow-sm backdrop-blur-sm md:text-xs">
                  <Flower2 className="h-3 w-3" />
                  {c.hero.eyebrow}
                </div>
              )}
              <h1
                className="text-4xl font-light leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {c.hero.headline || product.name}
              </h1>
              {c.hero.subheadline && (
                <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[#6b5948] md:mx-0 md:mt-6 md:text-lg">
                  {c.hero.subheadline}
                </p>
              )}
              <div className="mt-6 flex flex-wrap items-baseline justify-center gap-3 md:mt-8 md:justify-start md:gap-4">
                <p
                  className="text-3xl font-light tabular-nums md:text-4xl lg:text-5xl"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  ৳{product.price.toLocaleString()}
                </p>
                {c.hero.badge && (
                  <span className="rounded-full bg-[#f5c6c6]/60 px-3 py-1 text-xs font-medium text-[#a85858]">
                    {c.hero.badge}
                  </span>
                )}
              </div>
              <Button
                asChild
                size="lg"
                className="mt-6 rounded-full bg-[#a85858] px-8 text-white shadow-lg shadow-[#a85858]/20 hover:bg-[#8f4747] md:mt-8"
              >
                <a href="#order-form">{c.hero.ctaLabel || "Order now"}</a>
              </Button>
            </div>
            <div className="md:col-span-6 md:order-2 order-1">
              <div className="relative mx-auto max-w-sm md:max-w-none">
                <div
                  className="relative aspect-square overflow-hidden bg-white shadow-xl"
                  style={{
                    borderRadius:
                      "65% 35% 50% 50% / 50% 60% 40% 50%",
                  }}
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
                {/* Floating petals */}
                <div className="pointer-events-none absolute -left-3 top-10 animate-pulse">
                  <Sparkles className="h-5 w-5 text-[#f5c6c6] md:h-6 md:w-6" />
                </div>
                <div className="pointer-events-none absolute -right-2 bottom-14 animate-pulse [animation-delay:500ms]">
                  <Sparkles className="h-4 w-4 text-[#f5d9a8] md:h-5 md:w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video */}
      {landing.videoUrl && (
        <section className="bg-white/50">
          <div className="container mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-20">
            <p className="mb-4 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-[#a85858] md:text-xs">
              — In the garden —
            </p>
            <YouTubeEmbed url={landing.videoUrl} title={landing.title} />
          </div>
        </section>
      )}

      {/* Benefits */}
      {c.benefits.length > 0 && (
        <section>
          <div className="container mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-24">
            <div className="mb-10 text-center md:mb-14">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#a85858] md:text-xs">
                — Petal by petal —
              </p>
              <h2
                className="text-3xl font-light tracking-tight md:text-5xl"
                style={{ fontFamily: "Georgia, serif" }}
              >
                A gentler way
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {c.benefits.map((b, i) => {
                const colors = ["#f5c6c6", "#f5d9a8", "#d4c1e5", "#b8d4b8"];
                const bg = colors[i % colors.length];
                return (
                  <div
                    key={i}
                    className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-md md:p-8"
                  >
                    <div
                      className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-30 blur-2xl"
                      style={{ backgroundColor: bg }}
                    />
                    <div className="relative">
                      <div
                        className="mb-4 flex h-12 w-12 items-center justify-center rounded-full text-white"
                        style={{ backgroundColor: bg }}
                      >
                        <Flower2 className="h-5 w-5" />
                      </div>
                      <h3
                        className="text-xl font-semibold md:text-2xl"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        {b.title}
                      </h3>
                      {b.body && (
                        <p className="mt-3 text-sm leading-relaxed text-[#6b5948]">
                          {b.body}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Highlights */}
      {c.highlights.length > 0 && (
        <section className="relative overflow-hidden bg-white/50">
          <div className="pointer-events-none absolute -top-20 left-1/2 h-48 w-48 rounded-full bg-[#d4c1e5]/30 blur-3xl md:h-80 md:w-80" />
          <div className="container relative mx-auto max-w-6xl space-y-16 px-4 py-14 md:space-y-28 md:px-8 md:py-24">
            {c.highlights.map((h, i) => (
              <div
                key={i}
                className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                <div>
                  {h.image && (
                    <div
                      className="relative aspect-[4/5] overflow-hidden bg-white shadow-xl"
                      style={{
                        borderRadius:
                          i % 2 === 0
                            ? "55% 45% 45% 55% / 55% 50% 50% 45%"
                            : "45% 55% 55% 45% / 45% 50% 50% 55%",
                      }}
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
                </div>
                <div className="text-center md:text-left">
                  <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#a85858] md:text-xs">
                    — Chapter {String(i + 1).padStart(2, "0")} —
                  </p>
                  <h3
                    className="text-3xl font-light leading-tight tracking-tight md:text-4xl lg:text-5xl"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {h.title}
                  </h3>
                  {h.body && (
                    <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[#6b5948] md:mx-0 md:mt-6 md:text-lg">
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
        <section>
          <div className="container mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
            <p className="mb-8 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-[#a85858] md:text-xs">
              — Glimpses —
            </p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
              {c.gallery.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden bg-white shadow-md"
                  style={{
                    borderRadius:
                      i % 4 === 0
                        ? "60% 40% 45% 55%"
                        : i % 4 === 1
                          ? "40% 60% 55% 45%"
                          : i % 4 === 2
                            ? "50% 50% 60% 40%"
                            : "45% 55% 40% 60%",
                  }}
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
        <section className="bg-[#f5c6c6]/30">
          <div className="container mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-24">
            <div className="mb-10 text-center md:mb-14">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#a85858] md:text-xs">
                — Sweet words —
              </p>
              <h2
                className="text-3xl font-light tracking-tight md:text-5xl"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Kind reviews
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {c.testimonials.map((t, i) => (
                <figure
                  key={i}
                  className="rounded-3xl bg-white p-6 shadow-md md:p-7"
                >
                  {t.rating && (
                    <div className="mb-3 flex gap-0.5 text-[#d4a574]">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  )}
                  <blockquote
                    className="text-base italic leading-relaxed text-[#3a3228]"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4 text-sm">
                    <span className="font-semibold">— {t.name}</span>
                    {t.location && (
                      <span className="text-[#a85858]"> · {t.location}</span>
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
            <p className="mb-3 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-[#a85858] md:text-xs">
              — You ask —
            </p>
            <h2
              className="mb-8 text-center text-3xl font-light tracking-tight md:mb-10 md:text-5xl"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Common questions
            </h2>
            <LandingFaq items={c.faq} />
          </div>
        </section>
      )}

      {/* Order */}
      <section
        id="order-form"
        className="relative overflow-hidden bg-white/50"
      >
        <div className="pointer-events-none absolute -right-20 top-20 h-48 w-48 rounded-full bg-[#f5d9a8]/30 blur-3xl md:h-80 md:w-80" />
        <div className="container relative mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-24">
          <div className="grid items-start gap-10 md:grid-cols-2 md:gap-14">
            <div className="text-center md:text-left">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#a85858] md:text-xs">
                — The moment —
              </p>
              {c.finalCta.headline && (
                <h2
                  className="text-3xl font-light leading-tight tracking-tight md:text-5xl lg:text-6xl"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {c.finalCta.headline}
                </h2>
              )}
              {c.finalCta.subheadline && (
                <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[#6b5948] md:mx-0 md:mt-6 md:text-lg">
                  {c.finalCta.subheadline}
                </p>
              )}
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-xl md:p-8">
              {c.orderForm.title && (
                <h3
                  className="mb-2 text-xl font-semibold tracking-tight md:text-2xl"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {c.orderForm.title}
                </h3>
              )}
              {c.orderForm.subtitle && (
                <p className="mb-5 text-sm text-[#6b5948]">
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
