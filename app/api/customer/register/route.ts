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
    const { fullName, phone, password, email } = body;

    if (!fullName || !phone || !password) {
      return NextResponse.json(
        { error: "Name, phone, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if customer exists with a password already
    const existing = await prisma.customer.findUnique({
      where: { phone },
    });

    if (existing?.passwordHash) {
      return NextResponse.json(
        { error: "An account with this phone number already exists. Please login." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Upsert: if customer exists without password, they claim their account
    const customer = await prisma.customer.upsert({
      where: { phone },
      create: {
        fullName,
        phone,
        email: email || null,
        passwordHash,
        address: "",
        city: "",
      },
      update: {
        fullName,
        email: email || undefined,
        passwordHash,
      },
    });

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
