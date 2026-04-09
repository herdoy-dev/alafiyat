import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import {
  EMPTY_LANDING_CONTENT,
  LANDING_TEMPLATES,
  landingContentSchema,
  type LandingTemplate,
} from "@/schemas/landing";
import { LandingForm, type LandingFormValues } from "../../landing-form";

export default async function EditLandingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const landing = await prisma.landing.findUnique({ where: { id } });
  if (!landing) notFound();

  const parsed = landingContentSchema.safeParse(landing.content);
  const content = parsed.success ? parsed.data : EMPTY_LANDING_CONTENT;

  const template = LANDING_TEMPLATES.includes(
    landing.template as LandingTemplate
  )
    ? (landing.template as LandingTemplate)
    : "classic";

  const initialValues: LandingFormValues = {
    title: landing.title,
    slug: landing.slug,
    productId: landing.productId,
    template,
    status: landing.status === "published" ? "published" : "draft",
    videoUrl: landing.videoUrl ?? "",
    content,
  };

  return (
    <LandingForm
      mode="edit"
      landingId={landing.id}
      initialValues={initialValues}
    />
  );
}
