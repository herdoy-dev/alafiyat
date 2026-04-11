import Image from "next/image";
import { Zap, Star, Cpu, ArrowRight, Terminal } from "lucide-react";
import { YouTubeEmbed } from "@/components/landing/sections/youtube-embed";
import { LandingOrderForm } from "@/components/landing/sections/order-form";
import { LandingFaq } from "@/components/landing/sections/landing-faq";
import { Button } from "@/components/ui/button";
import type { TemplateProps } from "./types";

// TECH — Dark futuristic with neon green accents, monospace fonts,
// terminal-style UI, grid backgrounds. For tech gadgets & electronics.

export function TechTemplate({ landing, product }: TemplateProps) {
  const c = landing.content;

  return (
    <div className="overflow-x-hidden bg-[#0a0e14] text-[#c9d1d9]">
      {/* Grid background */}
      <style>{`
        .tech-grid {
          background-image:
            linear-gradient(rgba(34, 211, 238, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 211, 238, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .tech-glow {
          box-shadow: 0 0 40px rgba(34, 211, 238, 0.3);
        }
      `}</style>

      {/* Top bar */}
      <div className="border-b border-[#22d3ee]/20 bg-[#0a0e14]">
        <div className="container mx-auto max-w-7xl px-4 py-2 md:px-8">
          <div className="flex items-center justify-between font-mono text-xs text-[#22d3ee]">
            <span className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#22c55e]" />
              SYSTEM://ONLINE
            </span>
            <span>v2.0.1 · STABLE</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="tech-grid relative overflow-hidden border-b border-[#22d3ee]/20">
        {/* Glowing orbs */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#22d3ee]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#22c55e]/10 blur-3xl" />

        <div className="container relative mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
            <div className="md:col-span-7">
              {c.hero.eyebrow && (
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#22d3ee]/40 bg-[#22d3ee]/5 px-3 py-1 font-mono text-xs uppercase tracking-wider text-[#22d3ee]">
                  <Terminal className="h-3 w-3" />
                  {c.hero.eyebrow}
                </div>
              )}
              <h1 className="font-mono text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
                {c.hero.headline || product.name}
              </h1>
              {c.hero.subheadline && (
                <p className="mt-5 max-w-lg font-mono text-base leading-relaxed text-[#8b949e] md:text-lg">
                  &gt; {c.hero.subheadline}
                </p>
              )}
              <div className="mt-8 flex flex-wrap items-baseline gap-4">
                <p className="font-mono text-3xl font-bold tabular-nums text-[#22c55e] md:text-5xl">
                  ৳{product.price.toLocaleString()}
                </p>
                {c.hero.badge && (
                  <span className="rounded border border-[#22c55e]/50 bg-[#22c55e]/10 px-2 py-1 font-mono text-xs uppercase tracking-wider text-[#22c55e]">
                    [{c.hero.badge}]
                  </span>
                )}
              </div>
              <Button
                asChild
                size="lg"
                className="mt-8 rounded-none border border-[#22d3ee] bg-[#22d3ee] font-mono text-sm uppercase tracking-wider text-[#0a0e14] hover:bg-[#67e8f9]"
              >
                <a href="#order-form">
                  $ {c.hero.ctaLabel || "execute order"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
            <div className="md:col-span-5">
              <div className="relative">
                <div className="tech-glow relative aspect-square overflow-hidden rounded-xl border border-[#22d3ee]/40 bg-[#0d1117]">
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
                {/* Corner brackets */}
                <div className="pointer-events-none absolute -left-1 -top-1 h-6 w-6 border-l-2 border-t-2 border-[#22d3ee]" />
                <div className="pointer-events-none absolute -right-1 -top-1 h-6 w-6 border-r-2 border-t-2 border-[#22d3ee]" />
                <div className="pointer-events-none absolute -bottom-1 -left-1 h-6 w-6 border-b-2 border-l-2 border-[#22d3ee]" />
                <div className="pointer-events-none absolute -bottom-1 -right-1 h-6 w-6 border-b-2 border-r-2 border-[#22d3ee]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video */}
      {landing.videoUrl && (
        <section className="border-b border-[#22d3ee]/20 bg-[#0d1117]">
          <div className="container mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-20">
            <p className="mb-4 text-center font-mono text-xs uppercase tracking-wider text-[#22d3ee]">
              &gt;&gt; DEMO.mp4
            </p>
            <YouTubeEmbed url={landing.videoUrl} title={landing.title} />
          </div>
        </section>
      )}

      {/* Benefits — spec cards */}
      {c.benefits.length > 0 && (
        <section className="border-b border-[#22d3ee]/20">
          <div className="container mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
            <p className="mb-3 text-center font-mono text-xs uppercase tracking-wider text-[#22d3ee]">
              // SPECIFICATIONS
            </p>
            <h2 className="mb-12 text-center font-mono text-3xl font-bold text-white md:text-5xl">
              Core features
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {c.benefits.map((b, i) => (
                <div
                  key={i}
                  className="group rounded-xl border border-[#22d3ee]/20 bg-[#0d1117] p-6 transition-all hover:border-[#22d3ee]/60 hover:bg-[#0d1117]/80"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#22c55e]/30 bg-[#22c55e]/10">
                      <Zap className="h-5 w-5 text-[#22c55e]" />
                    </div>
                    <span className="font-mono text-xs text-[#22d3ee]">
                      0x{String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="font-mono text-lg font-bold text-white">
                    {b.title}
                  </h3>
                  {b.body && (
                    <p className="mt-2 text-sm leading-relaxed text-[#8b949e]">
                      {b.body}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Highlights — feature blocks */}
      {c.highlights.length > 0 && (
        <section className="tech-grid relative border-b border-[#22d3ee]/20 bg-[#0d1117]/50">
          <div className="container relative mx-auto max-w-6xl space-y-20 px-4 py-20 md:px-8 md:py-28">
            {c.highlights.map((h, i) => (
              <div
                key={i}
                className={`grid items-center gap-10 md:grid-cols-2 md:gap-14 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                <div>
                  {h.image && (
                    <div className="tech-glow relative aspect-[4/3] overflow-hidden rounded-xl border border-[#22d3ee]/30">
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
                  <div className="mb-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#22c55e]">
                    <Cpu className="h-3 w-3" />
                    MODULE_{String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-mono text-3xl font-bold text-white md:text-4xl">
                    {h.title}
                  </h3>
                  {h.body && (
                    <p className="mt-4 leading-relaxed text-[#8b949e]">
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
        <section className="border-b border-[#22d3ee]/20">
          <div className="container mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-24">
            <p className="mb-8 text-center font-mono text-xs uppercase tracking-wider text-[#22d3ee]">
              // PREVIEW_IMAGES
            </p>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {c.gallery.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-xl border border-[#22d3ee]/20 bg-[#0d1117] transition-all hover:border-[#22d3ee]/60"
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

      {/* Testimonials — terminal output style */}
      {c.testimonials.length > 0 && (
        <section className="border-b border-[#22d3ee]/20 bg-[#0d1117]">
          <div className="container mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
            <p className="mb-3 text-center font-mono text-xs uppercase tracking-wider text-[#22d3ee]">
              // USER_FEEDBACK.log
            </p>
            <h2 className="mb-12 text-center font-mono text-3xl font-bold text-white md:text-5xl">
              Verified users
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {c.testimonials.map((t, i) => (
                <figure
                  key={i}
                  className="rounded-xl border border-[#22d3ee]/20 bg-[#0a0e14] p-6 font-mono"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-xs text-[#8b949e]">&gt;</span>
                    {t.rating && (
                      <div className="flex gap-0.5 text-[#22c55e]">
                        {Array.from({ length: t.rating }).map((_, j) => (
                          <Star key={j} className="h-3 w-3 fill-current" />
                        ))}
                      </div>
                    )}
                  </div>
                  <blockquote className="flex-1 text-sm leading-relaxed text-[#c9d1d9]">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-4 border-t border-[#22d3ee]/20 pt-3 text-xs">
                    <span className="text-[#22c55e]">@{t.name.toLowerCase().replace(/\s+/g, "_")}</span>
                    {t.location && (
                      <span className="text-[#8b949e]"> · {t.location}</span>
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
        <section className="border-b border-[#22d3ee]/20">
          <div className="container mx-auto max-w-3xl px-4 py-20 md:px-8 md:py-28">
            <p className="mb-3 text-center font-mono text-xs uppercase tracking-wider text-[#22d3ee]">
              // README.md
            </p>
            <h2 className="mb-10 text-center font-mono text-3xl font-bold text-white md:text-5xl">
              FAQ
            </h2>
            <LandingFaq items={c.faq} theme="dark" />
          </div>
        </section>
      )}

      {/* Order */}
      <section id="order-form" className="tech-grid relative overflow-hidden">
        <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-[#22c55e]/10 blur-3xl" />
        <div className="container relative mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
          <div className="grid items-start gap-10 md:grid-cols-2 md:gap-14">
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-wider text-[#22d3ee]">
                // READY_TO_DEPLOY
              </p>
              {c.finalCta.headline && (
                <h2 className="font-mono text-4xl font-bold leading-tight text-white md:text-6xl">
                  {c.finalCta.headline}
                </h2>
              )}
              {c.finalCta.subheadline && (
                <p className="mt-5 text-lg leading-relaxed text-[#8b949e]">
                  {c.finalCta.subheadline}
                </p>
              )}
              {c.trustBadges.length > 0 && (
                <div className="mt-8 grid gap-2 font-mono text-xs">
                  {c.trustBadges.map((b, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-[#22c55e]"
                    >
                      <span>[✓]</span>
                      <span className="text-[#c9d1d9]">{b}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="rounded-xl border border-[#22d3ee]/40 bg-[#0d1117] p-6 md:p-8">
              {c.orderForm.title && (
                <h3 className="mb-2 font-mono text-2xl font-bold text-white">
                  &gt; {c.orderForm.title}
                </h3>
              )}
              {c.orderForm.subtitle && (
                <p className="mb-5 font-mono text-sm text-[#8b949e]">
                  # {c.orderForm.subtitle}
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
