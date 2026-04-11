import prisma from "./prisma";
import type { Prisma } from "@/app/generated/prisma/client";

export async function logAction(
  userId: string,
  action: string,
  entity: string,
  entityId?: string | null,
  details?: Record<string, unknown>
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId: entityId || null,
        details: (details as Prisma.InputJsonValue) ?? undefined,
      },
    });
  } catch {
    // Never let audit logging break the main flow
  }
}
