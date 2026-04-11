/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const CURRENCY = "BDT";

function gtag(...args: any[]) {
  if (typeof window === "undefined" || !window.gtag) return;
  try {
    window.gtag(...args);
  } catch {}
}

export function trackGA4ViewItem(productId: string, name: string, value: number) {
  gtag("event", "view_item", {
    currency: CURRENCY,
    value,
    items: [{ item_id: productId, item_name: name, price: value }],
  });
}

export function trackGA4AddToCart(
  productId: string,
  name: string,
  value: number,
  quantity = 1
) {
  gtag("event", "add_to_cart", {
    currency: CURRENCY,
    value: value * quantity,
    items: [
      { item_id: productId, item_name: name, price: value, quantity },
    ],
  });
}

export function trackGA4BeginCheckout(value: number) {
  gtag("event", "begin_checkout", {
    currency: CURRENCY,
    value,
  });
}

export function trackGA4Purchase(
  orderId: string,
  value: number
) {
  gtag("event", "purchase", {
    transaction_id: orderId,
    currency: CURRENCY,
    value,
  });
}
