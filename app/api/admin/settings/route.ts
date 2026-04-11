import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";
import {
  SOCIAL_KEYS,
  EMPTY_SOCIAL,
  HERO_PRODUCTS_KEY,
  HERO_MAX,
  COURIER_KEYS,
  EMPTY_COURIER_CONFIG,
  MARKETING_KEYS,
  EMPTY_MARKETING,
  BANNER_KEYS,
  EMPTY_BANNER,
  SITE_KEYS,
  EMPTY_SITE,
  type SocialLinks,
  type CourierConfig,
  type CourierKey,
  type MarketingConfig,
  type MarketingKey,
  type BannerConfig,
  type BannerKey,
  type SiteConfig,
  type SiteKey,
} from "@/lib/settings";
import { invalidatePathaoTokenCache } from "@/services/courier/pathao";

function buildSocialMap(rows: { key: string; value: string }[]): SocialLinks {
  const map: SocialLinks = { ...EMPTY_SOCIAL };
  for (const row of rows) {
    if ((SOCIAL_KEYS as readonly string[]).includes(row.key)) {
      (map as Record<string, string>)[row.key] = row.value;
    }
  }
  return map;
}

function parseHero(value: string | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((id): id is string => typeof id === "string");
    }
  } catch {}
  return [];
}

function buildCourierMap(
  rows: { key: string; value: string }[]
): CourierConfig {
  const map: CourierConfig = { ...EMPTY_COURIER_CONFIG };
  for (const row of rows) {
    if ((COURIER_KEYS as readonly string[]).includes(row.key)) {
      map[row.key as CourierKey] = row.value;
    }
  }
  return map;
}

function buildMarketingMap(
  rows: { key: string; value: string }[]
): MarketingConfig {
  const map: MarketingConfig = { ...EMPTY_MARKETING };
  for (const row of rows) {
    if ((MARKETING_KEYS as readonly string[]).includes(row.key)) {
      map[row.key as MarketingKey] = row.value;
    }
  }
  return map;
}

function buildBannerMap(
  rows: { key: string; value: string }[]
): BannerConfig {
  const map: BannerConfig = { ...EMPTY_BANNER };
  for (const row of rows) {
    if ((BANNER_KEYS as readonly string[]).includes(row.key)) {
      map[row.key as BannerKey] = row.value;
    }
  }
  return map;
}

function buildSiteMap(
  rows: { key: string; value: string }[]
): SiteConfig {
  const map: SiteConfig = { ...EMPTY_SITE };
  for (const row of rows) {
    if ((SITE_KEYS as readonly string[]).includes(row.key)) {
      map[row.key as SiteKey] = row.value;
    }
  }
  return map;
}

async function readSettings() {
  const rows = await prisma.siteSetting.findMany({
    where: {
      key: {
        in: [
          ...SOCIAL_KEYS,
          HERO_PRODUCTS_KEY,
          ...COURIER_KEYS,
          ...MARKETING_KEYS,
          ...BANNER_KEYS,
          ...SITE_KEYS,
        ],
      },
    },
  });
  const heroRow = rows.find((r) => r.key === HERO_PRODUCTS_KEY);
  return {
    social: buildSocialMap(rows),
    heroProductIds: parseHero(heroRow?.value),
    courier: buildCourierMap(rows),
    marketing: buildMarketingMap(rows),
    banner: buildBannerMap(rows),
    site: buildSiteMap(rows),
  };
}

export async function GET() {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(await readSettings());
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const social = body?.social as Record<string, unknown> | undefined;
    const heroProductIds = body?.heroProductIds as unknown;
    const courier = body?.courier as Record<string, unknown> | undefined;
    const marketing = body?.marketing as Record<string, unknown> | undefined;
    const banner = body?.banner as Record<string, unknown> | undefined;
    const site = body?.site as Record<string, unknown> | undefined;

    const ops = [] as ReturnType<typeof prisma.siteSetting.upsert>[];
    let courierTouched = false;
    let pathaoTouched = false;

    if (social && typeof social === "object") {
      for (const key of SOCIAL_KEYS) {
        const raw = (social as Record<string, unknown>)[key];
        const value = typeof raw === "string" ? raw.trim() : "";
        ops.push(
          prisma.siteSetting.upsert({
            where: { key },
            create: { key, value },
            update: { value },
          })
        );
      }
    }

    if (courier && typeof courier === "object") {
      for (const key of COURIER_KEYS) {
        const raw = (courier as Record<string, unknown>)[key];
        if (raw === undefined) continue;
        const value = typeof raw === "string" ? raw.trim() : "";
        courierTouched = true;
        if (key.startsWith("courier_pathao_")) pathaoTouched = true;
        ops.push(
          prisma.siteSetting.upsert({
            where: { key },
            create: { key, value },
            update: { value },
          })
        );
      }
    }

    if (marketing && typeof marketing === "object") {
      for (const key of MARKETING_KEYS) {
        const raw = (marketing as Record<string, unknown>)[key];
        if (raw === undefined) continue;
        const value = typeof raw === "string" ? raw.trim() : "";
        ops.push(
          prisma.siteSetting.upsert({
            where: { key },
            create: { key, value },
            update: { value },
          })
        );
      }
    }

    if (banner && typeof banner === "object") {
      for (const key of BANNER_KEYS) {
        const raw = (banner as Record<string, unknown>)[key];
        if (raw === undefined) continue;
        const value = typeof raw === "string" ? raw.trim() : "";
        ops.push(
          prisma.siteSetting.upsert({
            where: { key },
            create: { key, value },
            update: { value },
          })
        );
      }
    }

    if (site && typeof site === "object") {
      for (const key of SITE_KEYS) {
        const raw = (site as Record<string, unknown>)[key];
        if (raw === undefined) continue;
        const value = typeof raw === "string" ? raw.trim() : "";
        ops.push(
          prisma.siteSetting.upsert({
            where: { key },
            create: { key, value },
            update: { value },
          })
        );
      }
    }

    if (Array.isArray(heroProductIds)) {
      const ids = heroProductIds
        .filter((id): id is string => typeof id === "string")
        .slice(0, HERO_MAX);
      ops.push(
        prisma.siteSetting.upsert({
          where: { key: HERO_PRODUCTS_KEY },
          create: { key: HERO_PRODUCTS_KEY, value: JSON.stringify(ids) },
          update: { value: JSON.stringify(ids) },
        })
      );
    }

    if (ops.length === 0) {
      return NextResponse.json(
        { error: "Nothing to update" },
        { status: 400 }
      );
    }

    await prisma.$transaction(ops);

    if (courierTouched && pathaoTouched) {
      invalidatePathaoTokenCache();
    }

    return NextResponse.json(await readSettings());
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
