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
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4 py-12 md:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/logo.png"
                alt="Al Amirat"
                width={160}
                height={44}
                className="h-10 w-auto"
              />
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              Curated quality goods, delivered to your door. Pay easily with
              bKash, Nagad, Rocket, Upay, or cash on delivery.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wide uppercase">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wide uppercase">
              Follow Us
            </h3>
            {socials.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Social links coming soon.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {socials.map(({ key, url }) => {
                  const Icon = ICONS[key];
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={LABELS[key]}
                      className="flex h-10 w-10 items-center justify-center rounded-full border bg-background text-muted-foreground transition hover:border-primary hover:text-primary"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
          © {year} Al Amirat. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
