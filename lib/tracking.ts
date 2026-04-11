import { trackViewContent, trackAddToCart, trackInitiateCheckout, trackPurchase } from "./pixel";
import { trackGA4ViewItem, trackGA4AddToCart, trackGA4BeginCheckout, trackGA4Purchase } from "./gtag";
import { trackTikTokViewContent, trackTikTokAddToCart, trackTikTokCheckout, trackTikTokPurchase } from "./tiktok-pixel";

export function trackAllViewContent(productId: string, name: string, value: number) {
  trackViewContent(productId, value);
  trackGA4ViewItem(productId, name, value);
  trackTikTokViewContent(productId, value);
}

export function trackAllAddToCart(
  productId: string,
  name: string,
  value: number,
  quantity = 1
) {
  trackAddToCart(productId, value, quantity);
  trackGA4AddToCart(productId, name, value, quantity);
  trackTikTokAddToCart(productId, value, quantity);
}

export function trackAllInitiateCheckout(productId: string, value: number) {
  trackInitiateCheckout(productId, value);
  trackGA4BeginCheckout(value);
  trackTikTokCheckout(value);
}

export function trackAllPurchase(
  productId: string,
  value: number,
  orderId?: string
) {
  trackPurchase(productId, value, orderId);
  trackGA4Purchase(orderId ?? "", value);
  trackTikTokPurchase(orderId ?? "", value);
}
