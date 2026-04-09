import { z } from "zod/v4";

export const sendToCourierSchema = z.object({
  provider: z.enum(["pathao", "steadfast"]),
});

export type SendToCourierInput = z.infer<typeof sendToCourierSchema>;
