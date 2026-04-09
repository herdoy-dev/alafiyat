/**
 * Type-safe wrappers around `window.fbq`. All calls silently no-op if the
 * Facebook Pixel script hasn't loaded (e.g. admin hasn't configured a Pixel
 * ID, or running on the server).
 */

type FbqFn = (
  cmd: "track" | "trackCustom",
  event: string,
  params?: Record<string, unknown>
) => void;

declare global {
  interface Window {
    fbq?: FbqFn;
  }
}

function fbq(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") return;
  try {
    window.fbq("track", event, params);
  } catch {
    // ignore
  }
}

const CURRENCY = "BDT";

export function trackViewContent(productId: string, value: number) {
  fbq("ViewContent", {
    content_ids: [productId],
    content_type: "product",
    value,
    currency: CURRENCY,
  });
}

export function trackAddToCart(productId: string, value: number, quantity = 1) {
  fbq("AddToCart", {
    content_ids: [productId],
    content_type: "product",
    value: value * quantity,
    currency: CURRENCY,
  });
}

export function trackInitiateCheckout(productId: string, value: number) {
  fbq("InitiateCheckout", {
    content_ids: [productId],
    content_type: "product",
    value,
    currency: CURRENCY,
  });
}

export function trackPurchase(
  productId: string,
  value: number,
  orderId?: string
) {
  fbq("Purchase", {
    content_ids: [productId],
    content_type: "product",
    value,
    currency: CURRENCY,
    ...(orderId ? { order_id: orderId } : {}),
  });
}
