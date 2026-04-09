import type { LandingContent } from "@/schemas/landing";

export type LandingProductLite = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  thumbnail: string;
  images: string[];
};

export type LandingViewModel = {
  id: string;
  slug: string;
  title: string;
  template: string;
  videoUrl: string | null;
  content: LandingContent;
};

export type TemplateProps = {
  landing: LandingViewModel;
  product: LandingProductLite;
};
