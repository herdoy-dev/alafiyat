import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get("productId");
    if (!productId) {
      return NextResponse.json({ error: "productId required" }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { productId, status: "approved" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        rating: true,
        comment: true,
        customerName: true,
        createdAt: true,
      },
    });

    const avg =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return NextResponse.json({ reviews, averageRating: Math.round(avg * 10) / 10, total: reviews.length });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, rating, comment, customerName, customerPhone } = body;

    if (!productId || !rating || !comment || !customerName || !customerPhone) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        productId,
        rating: Number(rating),
        comment: String(comment).trim(),
        customerName: String(customerName).trim(),
        customerPhone: String(customerPhone).trim(),
        status: "pending",
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
