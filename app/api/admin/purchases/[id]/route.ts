import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { editPurchaseSchema } from "@/schemas/purchase";
import { validationError } from "@/lib/api-utils";
import { editPurchase } from "@/services/purchases";

export async function PATCH(
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
    const parsed = editPurchaseSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed);
    }

    const updated = await editPurchase(id, parsed.data);
    return NextResponse.json({ purchase: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (message === "Purchase not found") {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    if (
      message === "Cannot edit an order that has been sent to courier" ||
      message.startsWith("Insufficient stock") ||
      message.startsWith("Product not found")
    ) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
