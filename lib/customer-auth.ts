import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import prisma from "./prisma";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const COOKIE_NAME = "al-customer-token";
const TOKEN_EXPIRY = "30d";

export async function createCustomerToken(
  customerId: string
): Promise<string> {
  return new SignJWT({ customerId, role: "CUSTOMER" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(TOKEN_EXPIRY)
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifyCustomerToken(
  token: string
): Promise<{ customerId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role !== "CUSTOMER") return null;
    return { customerId: payload.customerId as string };
  } catch {
    return null;
  }
}

export async function setCustomerCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

export async function getCustomerCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export async function clearCustomerCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentCustomer() {
  const token = await getCustomerCookie();
  if (!token) return null;

  const payload = await verifyCustomerToken(token);
  if (!payload) return null;

  const customer = await prisma.customer.findUnique({
    where: { id: payload.customerId },
    select: {
      id: true,
      fullName: true,
      phone: true,
      email: true,
      address: true,
      city: true,
    },
  });

  return customer;
}
