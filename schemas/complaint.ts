import { z } from "zod/v4";

export const complaintSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Valid email required"),
  message: z.string().min(10, "Please describe your complaint (min 10 chars)"),
});

export const updateComplaintSchema = z.object({
  status: z.enum(["open", "resolved"]),
});

export type ComplaintInput = z.infer<typeof complaintSchema>;
