import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, cartTotal } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { valid: false, error: "Coupon code is required" },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!coupon) {
      return NextResponse.json({ valid: false, error: "Invalid coupon code" });
    }

    if (!coupon.active) {
      return NextResponse.json({
        valid: false,
        error: "This coupon is no longer active",
      });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({
        valid: false,
        error: "This coupon has expired",
      });
    }

    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({
        valid: false,
        error: "This coupon has reached its usage limit",
      });
    }

    const total = Number(cartTotal) || 0;
    if (total < coupon.minOrder) {
      return NextResponse.json({
        valid: false,
        error: `Minimum order amount is ৳${coupon.minOrder.toLocaleString()}`,
      });
    }

    let discountAmount: number;
    if (coupon.type === "percentage") {
      discountAmount = Math.round((total * coupon.value) / 100);
    } else {
      discountAmount = Math.min(coupon.value, total);
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discountAmount,
      },
    });
  } catch {
    return NextResponse.json(
      { valid: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
