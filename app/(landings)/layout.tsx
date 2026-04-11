import prisma from "@/lib/prisma";
import { FacebookPixel } from "@/components/marketing/facebook-pixel";
import { GoogleAnalytics } from "@/components/marketing/google-analytics";
import { TikTokPixel } from "@/components/marketing/tiktok-pixel";
import { GoogleTagManager } from "@/components/marketing/google-tag-manager";
import { PageTracker } from "@/components/marketing/page-tracker";
import { MARKETING_KEYS } from "@/lib/settings";

async function getMarketingIds() {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: [...MARKETING_KEYS] } },
  });
  const map = new Map(rows.map((r) => [r.key, r.value]));
  return {
    fbPixelId: map.get("marketing_facebook_pixel_id") || "",
    ga4Id: map.get("marketing_ga4_measurement_id") || "",
    tiktokPixelId: map.get("marketing_tiktok_pixel_id") || "",
    gtmId: map.get("marketing_gtm_container_id") || "",
  };
}

export default async function LandingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ids = await getMarketingIds();
  return (
    <>
      <FacebookPixel pixelId={ids.fbPixelId} />
      <GoogleAnalytics measurementId={ids.ga4Id} />
      <TikTokPixel pixelId={ids.tiktokPixelId} />
      <GoogleTagManager containerId={ids.gtmId} />
      <PageTracker />
      {children}
    </>
  );
}
