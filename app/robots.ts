import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const row = await prisma.siteSetting.findUnique({
    where: { key: "site_domain" },
  });
  const domain = row?.value || "https://example.com";
  const base = domain.startsWith("http") ? domain : `https://${domain}`;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/login"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
