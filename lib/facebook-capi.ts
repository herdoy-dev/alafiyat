/**
 * Facebook Conversions API (CAPI) - Server-side event tracking.
 *
 * Sends events directly to Facebook's servers, bypassing ad blockers and
 * browser restrictions. Used alongside the client-side Pixel for
 * deduplication via event_id.
 *
 * Docs: https://developers.facebook.com/docs/marketing-api/conversions-api
 */

import crypto from "crypto";
import prisma from "@/lib/prisma";

const FB_GRAPH_URL = "https://graph.facebook.com/v21.0";

type UserData = {
  email?: string | null;
  phone?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  fbc?: string | null;
  fbp?: string | null;
  city?: string | null;
  country?: string | null;
};

type EventParams = {
  eventName: string;
  eventId?: string;
  eventTime?: number;
  sourceUrl?: string;
  userData: UserData;
  customData?: Record<string, unknown>;
};

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function buildUserData(user: UserData) {
  const data: Record<string, string> = {};

  if (user.email) data.em = sha256(user.email);
  if (user.phone) {
    // Normalize: remove spaces/dashes, ensure starts with country code
    const phone = user.phone.replace(/[\s\-()]/g, "");
    data.ph = sha256(phone);
  }
  if (user.city) data.ct = sha256(user.city);
  if (user.country) data.country = sha256(user.country);
  if (user.ip) data.client_ip_address = user.ip;
  if (user.userAgent) data.client_user_agent = user.userAgent;
  if (user.fbc) data.fbc = user.fbc;
  if (user.fbp) data.fbp = user.fbp;

  return data;
}

async function getCapiCredentials(): Promise<{
  pixelId: string;
  accessToken: string;
} | null> {
  const rows = await prisma.siteSetting.findMany({
    where: {
      key: {
        in: ["marketing_facebook_pixel_id", "marketing_facebook_capi_token"],
      },
    },
  });

  const pixelId = rows.find((r) => r.key === "marketing_facebook_pixel_id")?.value;
  const accessToken = rows.find((r) => r.key === "marketing_facebook_capi_token")?.value;

  if (!pixelId || !accessToken) return null;
  return { pixelId, accessToken };
}

async function sendEvent(params: EventParams) {
  const creds = await getCapiCredentials();
  if (!creds) return;

  const eventData = {
    event_name: params.eventName,
    event_time: params.eventTime || Math.floor(Date.now() / 1000),
    event_id: params.eventId || crypto.randomUUID(),
    action_source: "website" as const,
    event_source_url: params.sourceUrl,
    user_data: buildUserData(params.userData),
    custom_data: params.customData,
  };

  const url = `${FB_GRAPH_URL}/${creds.pixelId}/events?access_token=${creds.accessToken}`;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [eventData] }),
    });
  } catch {
    // Silently fail - don't break the app for tracking errors
  }
}

/**
 * Track a Purchase event server-side.
 * This is the most critical CAPI event for Facebook ad optimization.
 */
export async function trackServerPurchase(opts: {
  orderId: string;
  value: number;
  email?: string | null;
  phone: string;
  city?: string;
  ip?: string | null;
  userAgent?: string | null;
  fbc?: string | null;
  fbp?: string | null;
  sourceUrl?: string;
}) {
  await sendEvent({
    eventName: "Purchase",
    eventId: `purchase_${opts.orderId}`,
    userData: {
      email: opts.email,
      phone: opts.phone,
      ip: opts.ip,
      userAgent: opts.userAgent,
      fbc: opts.fbc,
      fbp: opts.fbp,
      city: opts.city,
      country: "bd",
    },
    customData: {
      currency: "BDT",
      value: opts.value,
      order_id: opts.orderId,
      content_type: "product",
    },
    sourceUrl: opts.sourceUrl,
  });
}

/**
 * Track a PageView event server-side.
 */
export async function trackServerPageView(opts: {
  page: string;
  ip?: string | null;
  userAgent?: string | null;
  fbc?: string | null;
  fbp?: string | null;
}) {
  await sendEvent({
    eventName: "PageView",
    eventId: `pv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userData: {
      ip: opts.ip,
      userAgent: opts.userAgent,
      fbc: opts.fbc,
      fbp: opts.fbp,
    },
    sourceUrl: opts.page,
  });
}

/**
 * Track ViewContent event server-side.
 */
export async function trackServerViewContent(opts: {
  productId: string;
  value: number;
  ip?: string | null;
  userAgent?: string | null;
  fbc?: string | null;
  fbp?: string | null;
  sourceUrl?: string;
}) {
  await sendEvent({
    eventName: "ViewContent",
    eventId: `vc_${opts.productId}_${Date.now()}`,
    userData: {
      ip: opts.ip,
      userAgent: opts.userAgent,
      fbc: opts.fbc,
      fbp: opts.fbp,
    },
    customData: {
      currency: "BDT",
      value: opts.value,
      content_ids: [opts.productId],
      content_type: "product",
    },
    sourceUrl: opts.sourceUrl,
  });
}

/**
 * Track InitiateCheckout event server-side.
 */
export async function trackServerInitiateCheckout(opts: {
  value: number;
  email?: string | null;
  phone?: string;
  ip?: string | null;
  userAgent?: string | null;
  fbc?: string | null;
  fbp?: string | null;
  sourceUrl?: string;
}) {
  await sendEvent({
    eventName: "InitiateCheckout",
    eventId: `ic_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userData: {
      email: opts.email,
      phone: opts.phone,
      ip: opts.ip,
      userAgent: opts.userAgent,
      fbc: opts.fbc,
      fbp: opts.fbp,
      country: "bd",
    },
    customData: {
      currency: "BDT",
      value: opts.value,
    },
    sourceUrl: opts.sourceUrl,
  });
}
