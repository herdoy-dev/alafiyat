import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";
import { updatePurchaseSchema } from "@/schemas/purchase";
import { validationError } from "@/lib/api-utils";
import {
  approvePurchase,
  rejectPurchase,
  reopenPurchase,
  unapprovePurchase,
} from "@/services/purchases";
import { logAction } from "@/lib/audit";

export async function GET(request: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const method = searchParams.get("method");
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 8));

    const where: Record<string, unknown> = {};

    if (status) where.status = status;
    if (method) where.paymentMethod = method;

    if (search) {
      where.OR = [
        { shippingName: { contains: search, mode: "insensitive" } },
        { customerEmail: { contains: search, mode: "insensitive" } },
        { phoneNumber: { contains: search, mode: "insensitive" } },
        { transactionId: { contains: search, mode: "insensitive" } },
        { shippingPhone: { contains: search, mode: "insensitive" } },
      ];
    }

    const [purchases, total] = await Promise.all([
      prisma.purchase.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: { items: true },
      }),
      prisma.purchase.count({ where }),
    ]);

    return NextResponse.json({ purchases, total });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = updatePurchaseSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed);
    }

    const { purchaseId, status } = parsed.data;

    const current = await prisma.purchase.findUnique({
      where: { id: purchaseId },
      select: { status: true, courierProvider: true },
    });
    if (!current) throw new Error("Purchase not found");
    if (current.courierProvider) {
      throw new Error("Cannot change status after sending to courier");
    }

    let updated;
    if (status === current.status) {
      updated = await prisma.purchase.findUnique({
        where: { id: purchaseId },
        include: { items: true },
      });
    } else if (status === "approved") {
      // pending → approved, or rejected → pending → approved
      if (current.status === "rejected") {
        await reopenPurchase(purchaseId);
      }
      updated = await approvePurchase(purchaseId);
    } else if (status === "rejected") {
      // pending → rejected, or approved → pending → rejected
      if (current.status === "approved") {
        await unapprovePurchase(purchaseId);
      }
      updated = await rejectPurchase(purchaseId);
    } else {
      // status === "pending"
      if (current.status === "approved") {
        updated = await unapprovePurchase(purchaseId);
      } else {
        updated = await reopenPurchase(purchaseId);
      }
    }

    // Audit log
    if (status !== current.status) {
      logAction(admin.id, `order.status_${status}`, "Purchase", purchaseId, {
        from: current.status,
        to: status,
      }).catch(() => {});
    }

    return NextResponse.json({ purchase: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "Purchase not found") {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    if (
      message === "Purchase already processed" ||
      message === "Only rejected orders can be reopened" ||
      message === "Only approved orders can be reverted" ||
      message === "Cannot change status after sending to courier"
    ) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
