export const HERO_PRODUCTS_KEY = "heroProductIds";
export const HERO_MAX = 8;

export const SOCIAL_KEYS = [
  "facebook",
  "instagram",
  "twitter",
  "youtube",
  "linkedin",
  "tiktok",
  "whatsapp",
] as const;

export type SocialKey = (typeof SOCIAL_KEYS)[number];

export type SocialLinks = Record<SocialKey, string>;

export const EMPTY_SOCIAL: SocialLinks = {
  facebook: "",
  instagram: "",
  twitter: "",
  youtube: "",
  linkedin: "",
  tiktok: "",
  whatsapp: "",
};

export const SOCIAL_LABELS: Record<SocialKey, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  twitter: "Twitter / X",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  whatsapp: "WhatsApp",
};

export const COURIER_KEYS = [
  "courier_steadfast_base_url",
  "courier_steadfast_api_key",
  "courier_steadfast_api_secret",
  "courier_pathao_base_url",
  "courier_pathao_client_id",
  "courier_pathao_client_secret",
  "courier_pathao_username",
  "courier_pathao_password",
  "courier_pathao_store_id",
  "courier_pathao_city_id",
  "courier_pathao_zone_id",
  "courier_pathao_area_id",
] as const;

export type CourierKey = (typeof COURIER_KEYS)[number];

export type CourierConfig = Record<CourierKey, string>;

export const EMPTY_COURIER_CONFIG: CourierConfig = {
  courier_steadfast_base_url: "",
  courier_steadfast_api_key: "",
  courier_steadfast_api_secret: "",
  courier_pathao_base_url: "",
  courier_pathao_client_id: "",
  courier_pathao_client_secret: "",
  courier_pathao_username: "",
  courier_pathao_password: "",
  courier_pathao_store_id: "",
  courier_pathao_city_id: "",
  courier_pathao_zone_id: "",
  courier_pathao_area_id: "",
};

export const COURIER_DEFAULTS: Partial<CourierConfig> = {
  courier_steadfast_base_url: "https://portal.packzy.com/api/v1",
  courier_pathao_base_url: "https://api-hermes.pathao.com",
};

export const MARKETING_KEYS = [
  "marketing_facebook_pixel_id",
  "marketing_facebook_capi_token",
  "marketing_ga4_measurement_id",
  "marketing_tiktok_pixel_id",
  "marketing_gtm_container_id",
] as const;

export type MarketingKey = (typeof MARKETING_KEYS)[number];

export type MarketingConfig = Record<MarketingKey, string>;

export const EMPTY_MARKETING: MarketingConfig = {
  marketing_facebook_pixel_id: "",
  marketing_facebook_capi_token: "",
  marketing_ga4_measurement_id: "",
  marketing_tiktok_pixel_id: "",
  marketing_gtm_container_id: "",
};

export const BANNER_KEYS = [
  "banner_enabled",
  "banner_text",
  "banner_link",
  "banner_bg_color",
] as const;

export type BannerKey = (typeof BANNER_KEYS)[number];

export type BannerConfig = Record<BannerKey, string>;

export const EMPTY_BANNER: BannerConfig = {
  banner_enabled: "",
  banner_text: "",
  banner_link: "",
  banner_bg_color: "",
};

export const SITE_KEYS = ["site_domain"] as const;

export type SiteKey = (typeof SITE_KEYS)[number];

export type SiteConfig = Record<SiteKey, string>;

export const EMPTY_SITE: SiteConfig = {
  site_domain: "",
};
