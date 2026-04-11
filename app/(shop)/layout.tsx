import prisma from "@/lib/prisma";
import { StorefrontNav } from "@/components/storefront/nav";
import { Footer } from "@/components/storefront/footer";
import { ChatWidget } from "@/components/storefront/chat-widget";
import { FacebookPixel } from "@/components/marketing/facebook-pixel";
import { GoogleAnalytics } from "@/components/marketing/google-analytics";
import { TikTokPixel } from "@/components/marketing/tiktok-pixel";
import { GoogleTagManager } from "@/components/marketing/google-tag-manager";
import { PageTracker } from "@/components/marketing/page-tracker";
import { AnnouncementBar } from "@/components/storefront/announcement-bar";
import { WhatsAppButton } from "@/components/storefront/whatsapp-button";
import { MARKETING_KEYS, BANNER_KEYS } from "@/lib/settings";

async function getLayoutSettings() {
  const rows = await prisma.siteSetting.findMany({
    where: {
      key: {
        in: [...MARKETING_KEYS, ...BANNER_KEYS, "whatsapp"],
      },
    },
  });
  const map = new Map(rows.map((r) => [r.key, r.value]));
  return {
    fbPixelId: map.get("marketing_facebook_pixel_id") || "",
    ga4Id: map.get("marketing_ga4_measurement_id") || "",
    tiktokPixelId: map.get("marketing_tiktok_pixel_id") || "",
    gtmId: map.get("marketing_gtm_container_id") || "",
    bannerEnabled: map.get("banner_enabled") === "true",
    bannerText: map.get("banner_text") || "",
    bannerLink: map.get("banner_link") || "",
    bannerBgColor: map.get("banner_bg_color") || "#1a1a2e",
    whatsapp: map.get("whatsapp") || "",
  };
}

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const s = await getLayoutSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <FacebookPixel pixelId={s.fbPixelId} />
      <GoogleAnalytics measurementId={s.ga4Id} />
      <TikTokPixel pixelId={s.tiktokPixelId} />
      <GoogleTagManager containerId={s.gtmId} />
      <PageTracker />
      {s.bannerEnabled && (
        <AnnouncementBar
          text={s.bannerText}
          link={s.bannerLink}
          bgColor={s.bannerBgColor}
        />
      )}
      <StorefrontNav />
      <main className="flex-1">{children}</main>
      <Footer />
      {s.whatsapp && <WhatsAppButton phoneNumber={s.whatsapp} />}
      <ChatWidget />
    </div>
  );
}
