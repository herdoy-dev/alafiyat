import { z } from "zod/v4";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, hyphens"),
  description: z.string().min(1, "Description is required"),
  price: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative(),
  thumbnail: z.string().min(1, "Thumbnail URL is required"),
  images: z.array(z.string().min(1)).default([]),
  categoryId: z.string().optional().nullable(),
  featured: z.boolean().optional(),
});

export const updateProductSchema = productSchema.partial();

export type ProductInput = z.infer<typeof productSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
