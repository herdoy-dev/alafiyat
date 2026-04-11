import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import {
  createCustomerToken,
  setCustomerCookie,
} from "@/lib/customer-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json(
        { error: "Phone and password are required" },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.findUnique({
      where: { phone },
    });

    if (!customer || !customer.passwordHash) {
      return NextResponse.json(
        { error: "Invalid phone or password" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, customer.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid phone or password" },
        { status: 401 }
      );
    }

    const token = await createCustomerToken(customer.id);
    await setCustomerCookie(token);

    return NextResponse.json({
      customer: {
        id: customer.id,
        fullName: customer.fullName,
        phone: customer.phone,
        email: customer.email,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
