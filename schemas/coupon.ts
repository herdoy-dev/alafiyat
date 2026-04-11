import { z } from "zod/v4";

export const couponSchema = z.object({
  code: z
    .string()
    .min(3, "Code must be at least 3 characters")
    .transform((v) => v.toUpperCase().trim()),
  type: z.enum(["percentage", "fixed"]),
  value: z.number().int().positive("Value must be positive"),
  minOrder: z.number().int().nonnegative().default(0),
  maxUses: z.number().int().positive().nullable().default(null),
  active: z.boolean().default(true),
  expiresAt: z.string().nullable().default(null),
});

export type CouponInput = z.infer<typeof couponSchema>;
