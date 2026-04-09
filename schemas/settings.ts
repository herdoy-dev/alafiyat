import { z } from "zod/v4";
import { COURIER_KEYS, type CourierKey } from "@/lib/settings";

const courierShape: Record<CourierKey, z.ZodOptional<z.ZodString>> = Object
  .fromEntries(
    COURIER_KEYS.map((key) => [key, z.string().trim().optional()])
  ) as Record<CourierKey, z.ZodOptional<z.ZodString>>;

export const courierSettingsSchema = z.object(courierShape);

export type CourierSettingsInput = z.infer<typeof courierSettingsSchema>;
