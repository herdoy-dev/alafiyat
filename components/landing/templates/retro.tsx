import Image from "next/image";
import { Star, Sparkles, Zap } from "lucide-react";
import { YouTubeEmbed } from "@/components/landing/sections/youtube-embed";
import { LandingOrderForm } from "@/components/landing/sections/order-form";
import { LandingFaq } from "@/components/landing/sections/landing-faq";
import { Button } from "@/components/ui/button";
import type { TemplateProps } from "./types";

// RETRO — 80s/90s nostalgia with neon colors, checker patterns,
// thick borders, drop shadows. For fun youth-oriented products.

export function RetroTemplate({ landing, product }: TemplateProps) {
  const c = landing.content;

  return (
    <div className="overflow-x-hidden bg-[#ffe5b4] text-[#1a1a1a]">
      <style>{`
        .retro-shadow {
          box-shadow: 8px 8px 0 0 #1a1a1a;
        }
        .retro-shadow-pink {
          box-shadow: 8px 8px 0 0 #ff2d87;
        }
        .retro-shadow-cyan {
          box-shadow: 8px 8px 0 0 #00d4ff;
        }
        .retro-checker {
          background-image: linear-gradient(45deg, #1a1a1a 25%, transparent 25%),
            linear-gradient(-45deg, #1a1a1a 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #1a1a1a 75%),
            linear-gradient(-45deg, transparent 75%, #1a1a1a 75%);
          background-size: 16px 16px;
          background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
        }
        .retro-stripe {
          background: repeating-linear-gradient(
            45deg,
            #ff2d87,
            #ff2d87 10px,
            #ffe5b4 10px,
            #ffe5b4 20px
          );
        }
      `}</style>

      {/* Top marquee */}
      <div className="border-b-4 border-[#1a1a1a] bg-[#ff2d87] py-2 text-white">
        <div className="container mx-auto max-w-7xl px-4 text-center text-sm font-black uppercase tracking-wider md:px-8">
          ⭐ LIMITED EDITION · ACT NOW · LIMITED EDITION · ACT NOW · ⭐
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden border-b-4 border-[#1a1a1a]">
        {/* Decorative stars */}
        <div className="pointer-events-none absolute right-10 top-10 text-[#00d4ff]">
          <Sparkles className="h-12 w-12" />
        </div>
        <div className="pointer-events-none absolute bottom-20 left-10 text-[#ff2d87]">
          <Star className="h-8 w-8 fill-current" />
        </div>

        <div className="container relative mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
            <div className="md:col-span-7">
              {c.hero.eyebrow && (
                <div className="mb-5 inline-block border-4 border-[#1a1a1a] bg-[#00d4ff] px-4 py-1.5 text-xs font-black uppercase tracking-wider">
                  ★ {c.hero.eyebrow} ★
                </div>
              )}
              <h1 className="text-5xl font-black uppercase leading-[0.9] tracking-tight md:text-7xl lg:text-8xl">
                <span className="inline-block bg-[#ff2d87] px-3 text-white">
                  {(c.hero.headline || product.name).split(" ")[0]}
                </span>{" "}
                {(c.hero.headline || product.name).split(" ").slice(1).join(" ")}
              </h1>
              {c.hero.subheadline && (
                <p className="mt-6 max-w-lg text-lg font-bold leading-relaxed md:text-xl">
                  {c.hero.subheadline}
                </p>
              )}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="border-4 border-[#1a1a1a] bg-[#fff59e] px-5 py-3 retro-shadow">
                  <p className="text-3xl font-black tabular-nums md:text-5xl">
                    ৳{product.price.toLocaleString()}
                  </p>
                </div>
                {c.hero.badge && (
                  <div className="rotate-[-6deg] border-4 border-[#1a1a1a] bg-[#ff2d87] px-3 py-1 text-sm font-black uppercase text-white retro-shadow">
                    {c.hero.badge}
                  </div>
                )}
              </div>
              <Button
                asChild
                className="mt-8 h-auto rounded-none border-4 border-[#1a1a1a] bg-[#1a1a1a] px-8 py-4 text-base font-black uppercase tracking-wider text-[#fff59e] retro-shadow-pink hover:bg-[#ff2d87] hover:text-white"
              >
                <a href="#order-form">▶ {c.hero.ctaLabel || "Order now"}</a>
              </Button>
            </div>
            <div className="md:col-span-5">
              <div className="relative">
                <div className="retro-shadow-pink relative aspect-square overflow-hidden border-4 border-[#1a1a1a] bg-white">
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
                <div className="pointer-events-none absolute -left-3 -top-3 rotate-[-12deg] border-4 border-[#1a1a1a] bg-[#fff59e] px-3 py-1 text-xs font-black uppercase retro-shadow-cyan">
                  NEW!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stripe divider */}
      <div className="retro-stripe h-6 border-b-4 border-[#1a1a1a]" />

      {/* Video */}
      {landing.videoUrl && (
        <section className="border-b-4 border-[#1a1a1a] bg-[#00d4ff]">
          <div className="container mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-20">
            <p className="mb-4 text-center text-xs font-black uppercase tracking-wider">
              ▶ WATCH NOW ◀
            </p>
            <div className="border-4 border-[#1a1a1a] retro-shadow">
              <YouTubeEmbed url={landing.videoUrl} title={landing.title} />
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      {c.benefits.length > 0 && (
        <section className="border-b-4 border-[#1a1a1a]">
          <div className="container mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-black uppercase tracking-wider text-[#ff2d87]">
                ★ ★ ★
              </p>
              <h2 className="text-4xl font-black uppercase tracking-tight md:text-6xl">
                Why it <span className="bg-[#fff59e] px-2">rules</span>
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {c.benefits.map((b, i) => {
                const colors = ["#ff2d87", "#00d4ff", "#fff59e", "#a7f432", "#ff8c42"];
                const bg = colors[i % colors.length];
                return (
                  <div
                    key={i}
                    className="border-4 border-[#1a1a1a] p-6 retro-shadow"
                    style={{ backgroundColor: bg }}
                  >
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center border-4 border-[#1a1a1a] bg-white">
                      <Zap className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-black uppercase">{b.title}</h3>
                    {b.body && (
                      <p className="mt-3 text-sm font-bold leading-relaxed">
                        {b.body}
                      </p>
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
        <section className="border-b-4 border-[#1a1a1a] bg-[#a7f432]">
          <div className="container mx-auto max-w-6xl space-y-20 px-4 py-20 md:px-8 md:py-28">
            {c.highlights.map((h, i) => (
              <div
                key={i}
                className={`grid items-center gap-10 md:grid-cols-2 md:gap-14 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                <div>
                  {h.image && (
                    <div className="retro-shadow relative aspect-square overflow-hidden border-4 border-[#1a1a1a] bg-white">
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
                  <div className="mb-4 inline-block border-4 border-[#1a1a1a] bg-[#ff2d87] px-3 py-1 text-xs font-black uppercase tracking-wider text-white">
                    PART {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-4xl font-black uppercase leading-tight tracking-tight md:text-5xl">
                    {h.title}
                  </h3>
                  {h.body && (
                    <p className="mt-4 text-lg font-bold leading-relaxed">
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
        <section className="border-b-4 border-[#1a1a1a]">
          <div className="container mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-24">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-black uppercase tracking-wider text-[#ff2d87]">
                ◆ ◆ ◆
              </p>
              <h2 className="text-4xl font-black uppercase tracking-tight md:text-6xl">
                Behold
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {c.gallery.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden border-4 border-[#1a1a1a] retro-shadow"
                  style={{
                    transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 2}deg)`,
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
        <section className="border-b-4 border-[#1a1a1a] bg-[#1a1a1a] text-[#fff59e]">
          <div className="container mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-black uppercase tracking-wider text-[#00d4ff]">
                ★ ★ ★ ★ ★
              </p>
              <h2 className="text-4xl font-black uppercase tracking-tight md:text-6xl">
                <span className="bg-[#ff2d87] px-3 text-white">People</span>{" "}
                love it
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {c.testimonials.map((t, i) => (
                <figure
                  key={i}
                  className="border-4 border-[#fff59e] bg-[#1a1a1a] p-6"
                >
                  {t.rating && (
                    <div className="mb-3 flex gap-0.5 text-[#00d4ff]">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  )}
                  <blockquote className="flex-1 text-base font-bold leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4 text-sm font-black uppercase">
                    — {t.name}
                    {t.location && (
                      <span className="text-[#00d4ff]"> · {t.location}</span>
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
        <section className="border-b-4 border-[#1a1a1a] bg-[#fff59e]">
          <div className="container mx-auto max-w-3xl px-4 py-20 md:px-8 md:py-28">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-black uppercase tracking-wider text-[#ff2d87]">
                ? ? ?
              </p>
              <h2 className="text-4xl font-black uppercase tracking-tight md:text-6xl">
                You ask
              </h2>
            </div>
            <LandingFaq items={c.faq} />
          </div>
        </section>
      )}

      {/* Order */}
      <section id="order-form" className="bg-[#ffe5b4]">
        <div className="container mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
          <div className="grid items-start gap-10 md:grid-cols-2 md:gap-16">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-wider text-[#ff2d87]">
                ▶ ▶ ▶
              </p>
              {c.finalCta.headline && (
                <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-tight md:text-6xl">
                  {c.finalCta.headline}
                </h2>
              )}
              {c.finalCta.subheadline && (
                <p className="mt-5 text-lg font-bold leading-relaxed">
                  {c.finalCta.subheadline}
                </p>
              )}
              {c.trustBadges.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {c.trustBadges.map((b, i) => (
                    <div
                      key={i}
                      className="border-4 border-[#1a1a1a] bg-white px-3 py-1.5 text-xs font-black uppercase"
                    >
                      ✓ {b}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="retro-shadow border-4 border-[#1a1a1a] bg-white p-6 md:p-8">
              {c.orderForm.title && (
                <h3 className="mb-2 text-2xl font-black uppercase tracking-tight">
                  {c.orderForm.title}
                </h3>
              )}
              {c.orderForm.subtitle && (
                <p className="mb-5 text-sm font-bold">
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
