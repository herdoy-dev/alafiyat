import { NextResponse } from "next/server";
import type { z } from "zod/v4";

export function validationError(parsed: { error: z.ZodError }) {
  return NextResponse.json(
    { error: parsed.error.issues[0]?.message || "Invalid input" },
    { status: 400 }
  );
}
