import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Music2,
  MessageCircle,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { SOCIAL_KEYS, type SocialKey } from "@/lib/settings";

const ICONS: Record<SocialKey, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
  tiktok: Music2,
  whatsapp: MessageCircle,
};

const LABELS: Record<SocialKey, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  twitter: "Twitter",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  whatsapp: "WhatsApp",
};

async function getSocialLinks() {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: [...SOCIAL_KEYS] } },
  });
  return rows
    .filter((r) => r.value && r.value.trim() !== "")
    .map((r) => ({ key: r.key as SocialKey, url: r.value }));
}

export async function Footer() {
  const socials = await getSocialLinks();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-muted/40">
      <div className="container mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
        {/* Editorial brand block */}
        <div className="border-b border-border/60 pb-10 md:pb-14">
          <p className="font-display text-sm italic text-muted-foreground">
            Al Amirat — since today
          </p>
          <h2 className="mt-2 max-w-3xl font-display text-3xl leading-[1.05] tracking-tight md:text-5xl">
            Curated quality goods,{" "}
            <em className="font-display italic">delivered to your door.</em>
          </h2>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            Pay easily with bKash, Nagad, Rocket, Upay — or cash on delivery.
          </p>
        </div>

        {/* Links + brand grid */}
        <div className="grid gap-10 pt-10 md:grid-cols-12 md:gap-12 md:pt-14">
          {/* Brand column */}
          <div className="space-y-4 md:col-span-5">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/logo.png"
                alt="Al Amirat"
                width={160}
                height={44}
                className="h-9 w-auto"
              />
            </Link>
            {socials.length > 0 && (
              <div>
                <p className="font-display text-[11px] italic uppercase tracking-[0.2em] text-muted-foreground">
                  Follow along
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {socials.map(({ key, url }) => {
                    const Icon = ICONS[key];
                    return (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={LABELS[key]}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Legal */}
          <div className="space-y-4 md:col-span-3">
            <p className="font-display text-[11px] italic uppercase tracking-[0.2em] text-muted-foreground">
              Legal
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/terms"
                  className="text-foreground/70 transition-colors hover:text-foreground"
                >
                  Terms &amp; conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-foreground/70 transition-colors hover:text-foreground"
                >
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-foreground/70 transition-colors hover:text-foreground"
                >
                  Cookie policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4 md:col-span-4">
            <p className="font-display text-[11px] italic uppercase tracking-[0.2em] text-muted-foreground">
              Support
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/complain"
                  className="text-foreground/70 transition-colors hover:text-foreground"
                >
                  Submit a complaint
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-foreground/70 transition-colors hover:text-foreground"
                >
                  Browse products
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-foreground/70 transition-colors hover:text-foreground"
                >
                  Your cart
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground md:mt-14 md:flex-row md:items-center">
          <p>© {year} Al Amirat. All rights reserved.</p>
          <p className="font-display italic">
            Made with care in Bangladesh.
          </p>
        </div>
      </div>
    </footer>
  );
}
