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
