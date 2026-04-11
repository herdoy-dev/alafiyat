import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const hasUtm = UTM_PARAMS.some((p) => url.searchParams.has(p));

  if (!hasUtm) return NextResponse.next();

  const utmData: Record<string, string> = {};
  for (const param of UTM_PARAMS) {
    const value = url.searchParams.get(param);
    if (value) utmData[param] = value;
  }

  const response = NextResponse.next();
  response.cookies.set("utm_params", JSON.stringify(utmData), {
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|admin).*)",
  ],
};
