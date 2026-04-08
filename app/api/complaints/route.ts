import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { complaintSchema } from "@/schemas/complaint";
import { validationError } from "@/lib/api-utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = complaintSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed);

    const complaint = await prisma.complaint.create({
      data: parsed.data,
    });
    return NextResponse.json({ complaint });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
