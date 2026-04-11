import { z } from "zod/v4";

export const purchaseItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
});

export const purchaseSchema = z
  .object({
    items: z.array(purchaseItemSchema).min(1, "Cart is empty"),
    customerEmail: z.string().email("Valid email required").optional().or(z.literal("")),
    paymentMethod: z.string().min(1, "Payment method is required"),
    phoneNumber: z.string().optional().default(""),
    transactionId: z.string().optional().default(""),
    shippingName: z.string().min(1, "Name is required"),
    shippingPhone: z.string().min(1, "Shipping phone is required"),
    shippingAddress: z.string().min(1, "Address is required"),
    shippingCity: z.string().min(1, "City is required"),
    notes: z.string().optional(),
    discountCode: z.string().optional(),
    discountAmount: z.number().int().nonnegative().optional().default(0),
    utmSource: z.string().optional(),
    utmMedium: z.string().optional(),
    utmCampaign: z.string().optional(),
    utmContent: z.string().optional(),
    utmTerm: z.string().optional(),
  })
  .refine(
    (data) =>
      data.paymentMethod === "Cash on Delivery" ||
      (data.phoneNumber && data.phoneNumber.length > 0),
    {
      message: "Payer phone number is required",
      path: ["phoneNumber"],
    }
  )
  .refine(
    (data) =>
      data.paymentMethod === "Cash on Delivery" ||
      (data.transactionId && data.transactionId.length > 0),
    {
      message: "Transaction ID is required",
      path: ["transactionId"],
    }
  );

export const updatePurchaseSchema = z.object({
  purchaseId: z.string().min(1, "Purchase ID is required"),
  status: z.enum(["approved", "rejected", "pending"]),
});

export const editPurchaseItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  productName: z.string().min(1, "Product name is required"),
  price: z.number().int().nonnegative("Price must be 0 or more"),
  quantity: z.number().int().positive("Quantity must be at least 1"),
});

export const editPurchaseSchema = z.object({
  shippingName: z.string().min(1, "Name is required"),
  shippingPhone: z.string().min(1, "Phone is required"),
  shippingAddress: z.string().min(1, "Address is required"),
  shippingCity: z.string().min(1, "City is required"),
  notes: z.string().optional().nullable(),
  items: z.array(editPurchaseItemSchema).min(1, "Order must have at least one item"),
});

export type PurchaseInput = z.infer<typeof purchaseSchema>;
export type UpdatePurchaseInput = z.infer<typeof updatePurchaseSchema>;
export type EditPurchaseInput = z.infer<typeof editPurchaseSchema>;
