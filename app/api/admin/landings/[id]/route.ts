import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";
import { landingSchema } from "@/schemas/landing";
import { validationError } from "@/lib/api-utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;

    const landing = await prisma.landing.findUnique({
      where: { id },
      include: {
        product: {
          select: { id: true, name: true, thumbnail: true, price: true },
        },
      },
    });
    if (!landing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ landing });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;

    const body = await request.json();
    const parsed = landingSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed);

    const current = await prisma.landing.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (parsed.data.slug !== current.slug) {
      const slugTaken = await prisma.landing.findUnique({
        where: { slug: parsed.data.slug },
      });
      if (slugTaken) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 400 }
        );
      }
    }

    const product = await prisma.product.findUnique({
      where: { id: parsed.data.productId },
      select: { id: true },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 400 });
    }

    const landing = await prisma.landing.update({
      where: { id },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        productId: parsed.data.productId,
        template: parsed.data.template,
        status: parsed.data.status,
        videoUrl: parsed.data.videoUrl || null,
        content: parsed.data.content,
      },
    });

    return NextResponse.json({ landing });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;

    await prisma.landing.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
