import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createToken, setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/schemas/auth";
import { validationError } from "@/lib/api-utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed);
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!user.passwordHash) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await createToken(user.id);
    await setAuthCookie(token);

    // Record login event (non-blocking)
    try {
      const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
      const ua = request.headers.get("user-agent") || null;
      prisma.loginEvent.create({
        data: { userId: user.id, method: "credentials", ipAddress: ip, userAgent: ua },
      }).catch(() => {});
    } catch {}

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
