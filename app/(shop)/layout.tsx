import prisma from "@/lib/prisma";
import { StorefrontNav } from "@/components/storefront/nav";
import { Footer } from "@/components/storefront/footer";
import { ChatWidget } from "@/components/storefront/chat-widget";
import { FacebookPixel } from "@/components/marketing/facebook-pixel";

async function getFacebookPixelId(): Promise<string> {
  const row = await prisma.siteSetting.findUnique({
    where: { key: "marketing_facebook_pixel_id" },
  });
  return row?.value || "";
}

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pixelId = await getFacebookPixelId();

  return (
    <div className="flex min-h-screen flex-col">
      <FacebookPixel pixelId={pixelId} />
      <StorefrontNav />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
