import { z } from "zod/v4";

export const LANDING_TEMPLATES = [
  "classic",
  "bold",
  "minimal",
  "vibrant",
  "luxury",
  "editorial",
  "tech",
  "nature",
  "retro",
  "split",
  "urban",
] as const;

export type LandingTemplate = (typeof LANDING_TEMPLATES)[number];

const benefitSchema = z.object({
  icon: z.string().optional().default(""),
  title: z.string().min(1, "Title required"),
  body: z.string().optional().default(""),
});

const highlightSchema = z.object({
  title: z.string().min(1, "Title required"),
  body: z.string().optional().default(""),
  image: z.string().optional().default(""),
});

const testimonialSchema = z.object({
  name: z.string().min(1, "Name required"),
  location: z.string().optional().default(""),
  quote: z.string().min(1, "Quote required"),
  rating: z.number().int().min(1).max(5).optional(),
});

const faqSchema = z.object({
  q: z.string().min(1, "Question required"),
  a: z.string().min(1, "Answer required"),
});

export const landingContentSchema = z.object({
  hero: z.object({
    eyebrow: z.string().optional().default(""),
    headline: z.string().min(1, "Headline required"),
    subheadline: z.string().optional().default(""),
    ctaLabel: z.string().optional().default("Order now"),
    badge: z.string().optional().default(""),
  }),
  benefits: z.array(benefitSchema).optional().default([]),
  highlights: z.array(highlightSchema).optional().default([]),
  testimonials: z.array(testimonialSchema).optional().default([]),
  gallery: z.array(z.string()).optional().default([]),
  faq: z.array(faqSchema).optional().default([]),
  finalCta: z
    .object({
      headline: z.string().optional().default(""),
      subheadline: z.string().optional().default(""),
      ctaLabel: z.string().optional().default("Place your order"),
    })
    .optional()
    .default({
      headline: "",
      subheadline: "",
      ctaLabel: "Place your order",
    }),
  orderForm: z
    .object({
      title: z.string().optional().default("Order now"),
      subtitle: z.string().optional().default(""),
    })
    .optional()
    .default({ title: "Order now", subtitle: "" }),
  trustBadges: z.array(z.string()).optional().default([]),
});

export type LandingContent = z.infer<typeof landingContentSchema>;

export const landingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  productId: z.string().min(1, "Product is required"),
  template: z.enum(LANDING_TEMPLATES),
  status: z.enum(["draft", "published"]).default("draft"),
  videoUrl: z.string().optional().nullable().default(""),
  content: landingContentSchema,
});

export type LandingInput = z.infer<typeof landingSchema>;

export const EMPTY_LANDING_CONTENT: LandingContent = {
  hero: {
    eyebrow: "",
    headline: "",
    subheadline: "",
    ctaLabel: "Order now",
    badge: "",
  },
  benefits: [],
  highlights: [],
  testimonials: [],
  gallery: [],
  faq: [],
  finalCta: {
    headline: "",
    subheadline: "",
    ctaLabel: "Place your order",
  },
  orderForm: { title: "Order now", subtitle: "" },
  trustBadges: [],
};

export const TEMPLATE_META: Record<
  LandingTemplate,
  { name: string; description: string; tone: string }
> = {
  classic: {
    name: "Classic",
    description: "Refined editorial with generous whitespace",
    tone: "Premium grocery, home goods",
  },
  bold: {
    name: "Bold",
    description: "High-contrast type and gradient blocks",
    tone: "Gadgets, viral products",
  },
  minimal: {
    name: "Minimal",
    description: "Centered, monochrome, single image hero",
    tone: "Elegant single-SKU items",
  },
  vibrant: {
    name: "Vibrant",
    description: "Playful colors and rounded shapes",
    tone: "Impulse buys, FB ad traffic",
  },
  luxury: {
    name: "Luxury",
    description: "Dark canvas with cream accents",
    tone: "High-ticket items, gift sets",
  },
  editorial: {
    name: "Editorial",
    description: "Magazine-style spread with serif accents and pull quotes",
    tone: "Books, artisan goods, feature stories",
  },
  tech: {
    name: "Tech",
    description: "Dark futuristic with neon accents and terminal UI",
    tone: "Electronics, gadgets, software",
  },
  nature: {
    name: "Nature",
    description: "Earthy greens, organic shapes, and soft photography",
    tone: "Organic, wellness, home & garden",
  },
  retro: {
    name: "Retro",
    description: "80s/90s neon colors with checker patterns and drop shadows",
    tone: "Fun youth products, toys, snacks",
  },
  split: {
    name: "Split",
    description: "Dramatic split-screen with full-bleed imagery",
    tone: "Fashion, apparel, lifestyle",
  },
  urban: {
    name: "Urban",
    description: "Streetwear brutalist with orange accents and numbered sections",
    tone: "Streetwear, sneakers, limited drops",
  },
};
