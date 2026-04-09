import prisma from "@/lib/prisma";
import { FacebookPixel } from "@/components/marketing/facebook-pixel";

async function getFacebookPixelId(): Promise<string> {
  const row = await prisma.siteSetting.findUnique({
    where: { key: "marketing_facebook_pixel_id" },
  });
  return row?.value || "";
}

export default async function LandingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pixelId = await getFacebookPixelId();
  return (
    <>
      <FacebookPixel pixelId={pixelId} />
      {children}
    </>
  );
}
