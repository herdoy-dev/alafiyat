import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { sendToCourierSchema } from "@/schemas/courier";
import { validationError } from "@/lib/api-utils";
import {
  refreshCourierStatus,
  sendPurchaseToCourier,
} from "@/services/courier";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const updated = await refreshCourierStatus(id);
    return NextResponse.json({ purchase: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (message === "Purchase not found") {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    if (
      message === "Order has not been sent to a courier" ||
      message === "Unsupported courier provider"
    ) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    if (message.startsWith("Pathao:") || message.startsWith("Steadfast:")) {
      return NextResponse.json({ error: message }, { status: 502 });
    }
    if (message.includes("not configured")) {
      return NextResponse.json({ error: message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = sendToCourierSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed);
    }

    const updated = await sendPurchaseToCourier(id, parsed.data.provider);
    return NextResponse.json({ purchase: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (message === "Purchase not found") {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    if (
      message === "Order must be approved before sending to courier" ||
      message === "Order has already been sent to a courier" ||
      message === "Unsupported courier provider"
    ) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    if (message.startsWith("Pathao:") || message.startsWith("Steadfast:")) {
      return NextResponse.json({ error: message }, { status: 502 });
    }
    if (
      message.includes("credentials are not configured") ||
      message.includes("not configured")
    ) {
      return NextResponse.json({ error: message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
