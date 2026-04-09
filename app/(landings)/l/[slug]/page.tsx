import { notFound } from "next/navigation";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { TEMPLATE_COMPONENTS } from "@/lib/landing-templates";
import {
  landingContentSchema,
  type LandingTemplate,
} from "@/schemas/landing";
import type {
  LandingProductLite,
  LandingViewModel,
} from "@/components/landing/templates/types";
import { LandingTracker } from "./landing-tracker";

export const dynamic = "force-dynamic";

async function loadLanding(slug: string) {
  const landing = await prisma.landing.findUnique({
    where: { slug },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          stock: true,
          thumbnail: true,
          images: true,
        },
      },
    },
  });
  if (!landing) return null;
  if (landing.status !== "published") return null;
  return landing;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const landing = await loadLanding(slug);
  if (!landing) return { title: "Not found" };
  return {
    title: landing.title,
    description:
      typeof landing.content === "object" &&
      landing.content &&
      "hero" in landing.content &&
      typeof (landing.content as { hero?: { subheadline?: string } }).hero
        ?.subheadline === "string"
        ? (landing.content as { hero: { subheadline: string } }).hero
            .subheadline
        : undefined,
    openGraph: {
      title: landing.title,
      images: landing.product.thumbnail
        ? [landing.product.thumbnail]
        : undefined,
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const landing = await loadLanding(slug);
  if (!landing) notFound();

  // Increment views (fire-and-forget so we don't slow the response)
  prisma.landing
    .update({
      where: { id: landing.id },
      data: { views: { increment: 1 } },
    })
    .catch(() => {
      /* swallow — view counter is best effort */
    });

  // Validate / coerce content; fall back to empty if it's somehow corrupted
  const parsed = landingContentSchema.safeParse(landing.content);
  const content = parsed.success
    ? parsed.data
    : landingContentSchema.parse({
        hero: { headline: landing.product.name },
      });

  const Template =
    TEMPLATE_COMPONENTS[landing.template as LandingTemplate] ??
    TEMPLATE_COMPONENTS.classic;

  const product: LandingProductLite = {
    id: landing.product.id,
    name: landing.product.name,
    slug: landing.product.slug,
    price: landing.product.price,
    stock: landing.product.stock,
    thumbnail: landing.product.thumbnail,
    images: landing.product.images,
  };

  const viewModel: LandingViewModel = {
    id: landing.id,
    slug: landing.slug,
    title: landing.title,
    template: landing.template,
    videoUrl: landing.videoUrl,
    content,
  };

  return (
    <>
      <LandingTracker productId={product.id} value={product.price} />
      <Template landing={viewModel} product={product} />
    </>
  );
}
