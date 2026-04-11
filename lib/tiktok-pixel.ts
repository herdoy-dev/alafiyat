/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    ttq?: any;
  }
}

const CURRENCY = "BDT";

function ttq() {
  if (typeof window === "undefined" || !window.ttq) return null;
  return window.ttq;
}

export function trackTikTokViewContent(productId: string, value: number) {
  try {
    ttq()?.track("ViewContent", {
      content_id: productId,
      content_type: "product",
      currency: CURRENCY,
      value,
    });
  } catch {}
}

export function trackTikTokAddToCart(
  productId: string,
  value: number,
  quantity = 1
) {
  try {
    ttq()?.track("AddToCart", {
      content_id: productId,
      content_type: "product",
      currency: CURRENCY,
      value: value * quantity,
      quantity,
    });
  } catch {}
}

export function trackTikTokCheckout(value: number) {
  try {
    ttq()?.track("InitiateCheckout", {
      currency: CURRENCY,
      value,
    });
  } catch {}
}

export function trackTikTokPurchase(orderId: string, value: number) {
  try {
    ttq()?.track("CompletePayment", {
      content_type: "product",
      currency: CURRENCY,
      value,
      order_id: orderId,
    });
  } catch {}
}
