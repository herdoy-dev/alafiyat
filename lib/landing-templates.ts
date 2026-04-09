import { ClassicTemplate } from "@/components/landing/templates/classic";
import { BoldTemplate } from "@/components/landing/templates/bold";
import { MinimalTemplate } from "@/components/landing/templates/minimal";
import { VibrantTemplate } from "@/components/landing/templates/vibrant";
import { LuxuryTemplate } from "@/components/landing/templates/luxury";
import type { TemplateProps } from "@/components/landing/templates/types";
import type { LandingTemplate } from "@/schemas/landing";

export const TEMPLATE_COMPONENTS: Record<
  LandingTemplate,
  (props: TemplateProps) => React.ReactNode
> = {
  classic: ClassicTemplate,
  bold: BoldTemplate,
  minimal: MinimalTemplate,
  vibrant: VibrantTemplate,
  luxury: LuxuryTemplate,
};
