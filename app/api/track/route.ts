import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { trackServerPageView } from "@/lib/facebook-capi";

function parseDevice(ua: string): string {
  if (/tablet|ipad/i.test(ua)) return "tablet";
  if (/mobile|android|iphone/i.test(ua)) return "mobile";
  return "desktop";
}

function parseBrowser(ua: string): string {
  if (/samsung/i.test(ua)) return "Samsung Internet";
  if (/edg/i.test(ua)) return "Edge";
  if (/firefox/i.test(ua)) return "Firefox";
  if (/chrome/i.test(ua)) return "Chrome";
  if (/safari/i.test(ua)) return "Safari";
  return "Other";
}

// Free IP geolocation via ip-api.com (no key, 45 req/min limit)
async function geolocateIP(ip: string | null): Promise<{
  country: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
}> {
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    // Local IP - fallback to Dhaka for development
    return {
      country: "Bangladesh",
      city: "Dhaka",
      latitude: 23.8103,
      longitude: 90.4125,
    };
  }

  try {
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,city,lat,lon`,
      { signal: AbortSignal.timeout(2000) }
    );
    if (!res.ok) throw new Error("geo lookup failed");
    const data = await res.json();
    if (data.status !== "success") throw new Error("geo lookup failed");
    return {
      country: data.country || null,
      city: data.city || null,
      latitude: typeof data.lat === "number" ? data.lat : null,
      longitude: typeof data.lon === "number" ? data.lon : null,
    };
  } catch {
    return { country: null, city: null, latitude: null, longitude: null };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, page, referrer } = body;
    if (!sessionId || !page) {
      return new Response(null, { status: 400 });
    }

    const ua = request.headers.get("user-agent") || "";
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null;

    // UTM from cookie
    let utmSource: string | null = null;
    let utmMedium: string | null = null;
    let utmCampaign: string | null = null;
    let utmContent: string | null = null;
    let utmTerm: string | null = null;

    const utmCookie = request.cookies.get("utm_params")?.value;
    if (utmCookie) {
      try {
        const utm = JSON.parse(utmCookie);
        utmSource = utm.utm_source || null;
        utmMedium = utm.utm_medium || null;
        utmCampaign = utm.utm_campaign || null;
        utmContent = utm.utm_content || null;
        utmTerm = utm.utm_term || null;
      } catch {}
    }

    // Geolocate IP (fire-and-forget via Promise that doesn't block if slow)
    const geo = await geolocateIP(ip).catch(() => ({
      country: null,
      city: null,
      latitude: null,
      longitude: null,
    }));

    await prisma.pageView.create({
      data: {
        sessionId,
        page,
        referrer: referrer || null,
        utmSource,
        utmMedium,
        utmCampaign,
        utmContent,
        utmTerm,
        userAgent: ua.slice(0, 500),
        device: parseDevice(ua),
        browser: parseBrowser(ua),
        ip,
        country: geo.country,
        city: geo.city,
        latitude: geo.latitude,
        longitude: geo.longitude,
      },
    });

    // Facebook CAPI: send PageView server-side (fire-and-forget)
    const fbc = request.cookies.get("_fbc")?.value || null;
    const fbp = request.cookies.get("_fbp")?.value || null;
    trackServerPageView({
      page,
      ip,
      userAgent: ua,
      fbc,
      fbp,
    }).catch(() => {});

    return new Response(null, { status: 204 });
  } catch {
    return new Response(null, { status: 500 });
  }
}
