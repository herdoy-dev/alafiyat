import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/customer-auth";

export async function GET() {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) {
      return NextResponse.json({ customer: null });
    }
    return NextResponse.json({ customer });
  } catch {
    return NextResponse.json({ customer: null });
  }
}

export async function PATCH(request: Request) {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data: Record<string, string> = {};
    if (body.fullName !== undefined) data.fullName = String(body.fullName);
    if (body.email !== undefined) data.email = String(body.email);
    if (body.address !== undefined) data.address = String(body.address);
    if (body.city !== undefined) data.city = String(body.city);

    const updated = await prisma.customer.update({
      where: { id: customer.id },
      select: {
        id: true,
        fullName: true,
        phone: true,
        email: true,
        address: true,
        city: true,
      },
      data,
    });

    return NextResponse.json({ customer: updated });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
